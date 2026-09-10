import http from 'node:http';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import pg from 'pg';

const execFileAsync = promisify(execFile);
const { Pool } = pg;
const port = Number(process.env.PORT || 8080);
const serviceToken = process.env.SERVICE_TOKEN || '';
const postgresUrl = process.env.POSTGRES_URL;
const pool = postgresUrl ? new Pool({ connectionString: postgresUrl, max: 4, statement_timeout: 5000 }) : null;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function send(response, status, body) {
  response.writeHead(status, { ...corsHeaders, 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let raw = '';
    request.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 25000) reject(new Error('Request too large'));
    });
    request.on('end', () => {
      try { resolve(JSON.parse(raw)); } catch { reject(new Error('Invalid JSON')); }
    });
    request.on('error', reject);
  });
}

function validate(body) {
  if (!body || !['python', 'sql'].includes(body.language) || typeof body.code !== 'string' || !body.code.trim() || body.code.length > 20000) {
    throw new Error('Invalid execution request');
  }
}

async function runPython(code) {
  const directory = await mkdtemp(join(tmpdir(), 'practical-'));
  const sourcePath = join(directory, 'main.py');
  try {
    await writeFile(sourcePath, code, { encoding: 'utf8', mode: 0o400 });
    const args = [
      'run', '--rm', '--network', 'none', '--cpus', '0.5', '--memory', '128m', '--pids-limit', '64',
      '--read-only', '--tmpfs', '/tmp:rw,noexec,nosuid,size=16m', '--cap-drop', 'ALL',
      '--security-opt', 'no-new-privileges', '--user', '1000:1000',
      '-v', `${sourcePath}:/app/main.py:ro`, 'python:3.12-alpine', 'python', '-I', '/app/main.py',
    ];
    const result = await execFileAsync('docker', args, { timeout: 7000, maxBuffer: 100000 });
    return { output: result.stdout, error: result.stderr || null };
  } catch (error) {
    const message = error?.killed ? 'Execution timed out.' : (error?.stderr || 'Python execution failed.').trim();
    return { output: error?.stdout || '', error: message };
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function runSql(code) {
  if (!/^\s*(select|with)\b/i.test(code) || /;\s*\S/.test(code)) {
    return { output: '', error: 'Only one read-only SELECT query is allowed in this lab.' };
  }
  if (!pool) return { output: '', error: 'The SQL database is not configured.' };

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query("SET LOCAL statement_timeout = '5000'");
    await client.query('SET LOCAL transaction_read_only = on');
    const result = await client.query(code);
    await client.query('ROLLBACK');
    const columns = result.fields.map((field) => field.name);
    const output = JSON.stringify({ columns, rows: result.rows }, null, 2);
    return { output, error: null, columns, rows: result.rows };
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    return { output: '', error: 'The SQL query could not be executed.' };
  } finally {
    client.release();
  }
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') return send(response, 204, {});
  if (request.method !== 'POST' || request.url !== '/execute') return send(response, 404, { error: 'Not found' });
  if (serviceToken && request.headers.authorization !== `Bearer ${serviceToken}`) return send(response, 401, { error: 'Unauthorized' });

  const startedAt = Date.now();
  try {
    const body = await readBody(request);
    validate(body);
    const result = body.language === 'python' ? await runPython(body.code) : await runSql(body.code);
    return send(response, 200, {
      language: body.language,
      ok: !result.error,
      output: result.output,
      error: result.error,
      durationMs: Date.now() - startedAt,
      ...(result.columns ? { columns: result.columns } : {}),
      ...(result.rows ? { rows: result.rows } : {}),
    });
  } catch {
    return send(response, 400, { error: 'Invalid execution request' });
  }
});

server.listen(port, () => console.log(`Docker execution service listening on ${port}`));
