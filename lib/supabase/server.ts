import { createServerClient } from '@supabase/ssr';
import { createClient as createClientJs } from '@supabase/supabase-js';

import { cookies } from 'next/headers';
import { env } from '@/lib/env/server';

/**
 * Create a Supabase client with the service role key.
 * This client bypasses RLS and should only be used on the server.
 */
export const createServiceRoleClient = () => {
  return createClientJs(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false, // Disable session persistence for service role
    },
  });
};

export const getUser = async () => {
  const supabase = createClient(await cookies());
  return supabase.auth.getUser();
};

export const createClient = (
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) => {
  return createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: unknown) {
        try {
          /** @ts-expect-error unknown type */
          cookiesToSet.forEach(({ name, value, options }: unknown) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};
