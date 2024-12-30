import { getUserCredits } from '@/server/db';
import { cache } from 'react';

export const getCachedUserCredits = cache(getUserCredits);
