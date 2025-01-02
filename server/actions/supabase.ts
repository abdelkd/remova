'use server';

import { createClient } from '@/lib/supabase/server';
import { getBucketName } from '@/lib/utils';
import { cookies } from 'next/headers';

export const getUserImages = async (userId: string) => {
  const bucketName = getBucketName(userId);
  const supabase = createClient(await cookies());

  const result = await supabase.storage.from(bucketName).list();
  if (!result.data || result.error) {
    return {
      data: [],
      error: 'Empty List',
    };
  }

  return {
    data: result.data,
    error: null,
  };
};
