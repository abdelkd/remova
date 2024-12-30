import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/lib/env/client';

export const createClient = () =>
  createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
