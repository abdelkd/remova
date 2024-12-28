import { z } from 'zod';
import { authFormSchema } from '@/schemas';

export type AuthForm = z.infer<typeof authFormSchema>;
