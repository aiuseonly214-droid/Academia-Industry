const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const allowedLanguages = new Set(['python', 'sql']);
const maxCodeLength = 20_000;
const executionTimeoutMs = 15_000;

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

    const serviceUrl = Deno.env.get('DOCKER_EXECUTION_URL');
    if (!serviceUrl) return jsonResponse({ error: 'Execution service is not configured' }, 503);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), executionTimeoutMs);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const serviceToken = Deno.env.get('DOCKER_EXECUTION_SERVICE_TOKEN');
      if (serviceToken) headers.Authorization = `Bearer ${serviceToken}`;

      const upstream = await fetch(`${serviceUrl.replace(/\/$/, '')}/execute`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ language, code }),
        signal: controller.signal,
      });

      if (!upstream.ok) return jsonResponse({ error: 'The execution service rejected the request' }, 502);
      const result = await upstream.json();
      if (!result || typeof result.output !== 'string' || typeof result.ok !== 'boolean') {
        return jsonResponse({ error: 'The execution service returned an invalid response' }, 502);
      }
      return jsonResponse(result);
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return jsonResponse({ error: 'The execution service is unavailable' }, 502);
  }
});
