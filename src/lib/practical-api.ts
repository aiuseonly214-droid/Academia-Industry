import { supabase } from './supabase';

export interface PracticalExecutionResult {
  language: 'python' | 'sql';
  ok: boolean;
  output: string;
  error: string | null;
  durationMs: number;
  columns?: string[];
  rows?: Record<string, unknown>[];
}

function isExecutionResult(value: unknown): value is PracticalExecutionResult {
  if (!value || typeof value !== 'object') return false;
  const result = value as Record<string, unknown>;
  return typeof result.language === 'string'
    && typeof result.ok === 'boolean'
    && typeof result.output === 'string'
    && (result.error === null || typeof result.error === 'string')
    && typeof result.durationMs === 'number';
}

export async function executePractical(language: 'python' | 'sql', code: string): Promise<PracticalExecutionResult> {
  if (!code.trim()) throw new Error('Write some code before running it.');
  if (code.length > 20000) throw new Error('Keep your solution under 20,000 characters.');

  const { data, error } = await supabase.functions.invoke('execute-practical', {
    body: { language, code },
  });

  if (error || !isExecutionResult(data)) {
    throw new Error('The practical environment is unavailable right now.');
  }

  return data;
}
