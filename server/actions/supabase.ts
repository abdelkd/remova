'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export const getUserImages = async (userId: string) => {
  const supabase = createClient(await cookies());

  const result = await supabase.storage.from('images').list(`user_${userId}`);
  if (!result.data || result.error) {
    return {
      data: [],
      error: 'Empty List',
    };
  }

  console.log(userId);
  console.log({ data: result.data });

  return {
    data: result.data,
    error: null,
  };
};
