import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    GRADIO_API_URL: z.string().url(),
    USE_GRADIO: z.coerce.boolean(),
    TURSO_AUTH_TOKEN: z.string().min(1),
    TURSO_DATABASE_URL: z.string().url(),
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string().min(1),
  },
  runtimeEnv: {
    GRADIO_API_URL: process.env.GRADIO_API_URL,
    USE_GRADIO: process.env.USE_GRADIO,
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
});
