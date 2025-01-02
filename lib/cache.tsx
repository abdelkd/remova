import { getUserImages } from '@/server/actions/supabase';
import { getUserCredits } from '@/server/db';
import { cache } from 'react';

export const getCachedUserCredits = cache(getUserCredits);
export const getCachesUserImages = cache(getUserImages);
