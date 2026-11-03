import { supabase } from './supabaseClient';

const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();

  const res = await fetch(`${API_URL}/api/v1${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(session && { Authorization: `Bearer ${session.access_token}` }),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(result.error?.message ?? 'Request failed');
    error.code = result.error?.code;
    error.status = res.status;
    error.details = result.error?.details;
    throw error;
  }

  return result.data;
}