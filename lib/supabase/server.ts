import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '../env/server';

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
