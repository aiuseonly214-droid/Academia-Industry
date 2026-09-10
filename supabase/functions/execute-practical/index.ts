import pg from 'npm:pg@8.13.1';

const { Pool } = pg;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const allowedLanguages = new Set(['python', 'sql']);
const maxCodeLength = 20_000;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 200, headers: corsHeaders });
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  try {
    const body = await request.json();
    const language = typeof body?.language === 'string' ? body.language : '';
    const code = typeof body?.code === 'string' ? body.code : '';

    if (!allowedLanguages.has(language) || !code.trim() || code.length > maxCodeLength) {
      return jsonResponse({ error: 'Invalid execution request' }, 400);
    }

    if (language === 'python') {
      return await runPython(code);
    } else {
      return await runSql(code);
    }
  } catch {
    return jsonResponse({ error: 'Execution failed. Please try again.' }, 500);
  }
});

async function runPython(code: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const pistonRes = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'python',
        version: '3.12',
        files: [{ name: 'main.py', content: code }],
      }),
      signal: controller.signal,
    });

    if (!pistonRes.ok) {
      return jsonResponse({ language: 'python', ok: false, output: '', error: 'The Python execution service is temporarily unavailable.', durationMs: 0 });
    }

    const result = await pistonRes.json();
    const output = (result?.run?.stdout || '') + (result?.run?.stderr || '');
    const hasError = result?.run?.code !== 0;
    return jsonResponse({
      language: 'python',
      ok: !hasError,
      output: output.trim() || (hasError ? 'Execution completed with errors.' : '(no output)'),
      error: hasError ? (result?.run?.stderr || 'Your code has an error. Check the output for details.').trim() : null,
      durationMs: 0,
    });
  } catch {
    return jsonResponse({ language: 'python', ok: false, output: '', error: 'The Python execution service is temporarily unavailable. Please try again in a moment.', durationMs: 0 });
  } finally {
    clearTimeout(timeout);
  }
}

async function runSql(code: string): Promise<Response> {
  const trimmed = code.trim().replace(/;+\s*$/, '');
  if (!/^(select|with)\b/i.test(trimmed)) {
    return jsonResponse({ language: 'sql', ok: false, output: '', error: 'Only read-only SELECT queries are allowed in this lab.', durationMs: 0 });
  }

  const dbUrl = Deno.env.get('SUPABASE_DB_URL');
  if (!dbUrl) {
    return jsonResponse({ language: 'sql', ok: false, output: '', error: 'The SQL database is not configured.', durationMs: 0 });
  }

  let pool: InstanceType<typeof Pool> | null = null;
  try {
    pool = new Pool(dbUrl, 1, true);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query("SET LOCAL statement_timeout = '5000'");
      await client.query('SET LOCAL transaction_read_only = on');
      await client.query('SET search_path TO practice');
      const result = await client.query(trimmed);
      await client.query('ROLLBACK');
      const columns = result.fields.map((f: { name: string }) => f.name);
      const rows = result.rows as Record<string, unknown>[];
      const formatted = formatSqlResult(columns, rows);
      return jsonResponse({ language: 'sql', ok: true, output: formatted, error: null, durationMs: 0, columns, rows });
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      const message = err instanceof Error ? err.message : 'The SQL query could not be executed.';
      return jsonResponse({ language: 'sql', ok: false, output: '', error: message, durationMs: 0 });
    } finally {
      client.release();
    }
  } catch {
    return jsonResponse({ language: 'sql', ok: false, output: '', error: 'The SQL database is temporarily unavailable.', durationMs: 0 });
  } finally {
    if (pool) await pool.end();
  }
}

function formatSqlResult(columns: string[], rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '(0 rows returned)';
  const header = columns.join(' | ');
  const separator = columns.map(() => '---').join(' | ');
  const dataRows = rows.slice(0, 50).map((row) => columns.map((col) => String(row[col] ?? '')).join(' | '));
  const truncated = rows.length > 50 ? `\n... (${rows.length - 50} more rows)` : '';
  return [header, separator, ...dataRows, truncated].filter(Boolean).join('\n');
}
