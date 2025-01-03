import { z } from 'zod';
import { authFormSchema } from '@/schemas';
import { createClient } from '@/lib/supabase/server';

export type AuthForm = z.infer<typeof authFormSchema>;

export type SupabaseClient = ReturnType<typeof createClient>;
export type SupabaseStorage = SupabaseClient['storage'];
export type SupabaseStorageFileApi = ReturnType<SupabaseStorage['from']>;

export type SupabaseFileObject = Awaited<
  ReturnType<SupabaseStorageFileApi['list']>
>['data'];

export interface RequestInitExtended extends RequestInit {
  duplex?: 'half' | 'full';
}
