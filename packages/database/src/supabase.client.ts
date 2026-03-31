import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types/generated';

export type SupabaseTypedClient = SupabaseClient<Database>;

export class SupabaseRepositoryError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
  }
}

const DEFAULT_TIMEOUT_MS = 10000;

const isRetryableError = (error: unknown): boolean => {
  if (!error) {
    return false;
  }
  const message = typeof error === 'string' ? error : (error as Error).message;
  if (!message) {
    return false;
  }
  return (
    message.includes('fetch') ||
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('aborted') ||
    message.includes('ECONNRESET')
  );
};

const createTimedFetch = (timeoutMs: number) => {
  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(input, {
        ...init,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  };
};

const getEnv = (key: string, required = true): string | undefined => {
  const value = process.env[key];
  if (!value && required) {
    throw new SupabaseRepositoryError(`Missing environment variable: ${key}`);
  }
  return value;
};

const getTimeoutMs = (): number => {
  const raw = process.env.SUPABASE_TIMEOUT_MS;
  const parsed = raw ? Number(raw) : DEFAULT_TIMEOUT_MS;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS;
};

const buildClient = (key: string): SupabaseTypedClient => {
  const url = getEnv('SUPABASE_URL') as string;
  const timeoutMs = getTimeoutMs();

  return createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      fetch: createTimedFetch(timeoutMs),
    },
  });
};

let adminClient: SupabaseTypedClient | null = null;
let anonClient: SupabaseTypedClient | null = null;

export const resetSupabaseClients = (): void => {
  adminClient = null;
  anonClient = null;
};

export const getSupabaseAdminClient = (): SupabaseTypedClient => {
  if (!adminClient) {
    const key = getEnv('SUPABASE_SERVICE_ROLE_KEY') as string;
    adminClient = buildClient(key);
  }
  return adminClient;
};

export const getSupabaseAnonClient = (): SupabaseTypedClient => {
  if (!anonClient) {
    const key = getEnv('SUPABASE_ANON_KEY') as string;
    anonClient = buildClient(key);
  }
  return anonClient;
};

export const executeWithRetry = async <T>(
  clientType: 'admin' | 'anon',
  operation: (client: SupabaseTypedClient) => Promise<T>,
  retries = 1,
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const client =
        clientType === 'admin' ? getSupabaseAdminClient() : getSupabaseAnonClient();
      return await operation(client);
    } catch (error) {
      lastError = error;
      if (attempt < retries && isRetryableError(error)) {
        resetSupabaseClients();
        continue;
      }
      break;
    }
  }

  throw lastError;
};

export const throwIfSupabaseError = (error: unknown, context: string): void => {
  if (!error) {
    return;
  }

  const details =
    typeof error === 'object' && error !== null
      ? [
          (error as { message?: string }).message,
          (error as { details?: string }).details,
          (error as { hint?: string }).hint,
        ]
          .filter(Boolean)
          .join(' | ')
      : String(error);

  throw new SupabaseRepositoryError(`Supabase error in ${context}: ${details}`, error);
};
