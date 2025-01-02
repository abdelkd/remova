import { getUserImages } from '@/server/actions/supabase';
import { getUserCredits } from '@/server/db';
import { cache } from 'react';
import { getUser } from '@/lib/supabase/server';

export const getCachedUserCredits = cache(getUserCredits);
export const getCachesUserImages = cache(getUserImages);
export const getCachedUser = cache(getUser);
