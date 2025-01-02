'use server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { reduceUserCredit, getUserCredits } from '@/server/db';
import { env } from '@/lib/env/server';
import { removeBgGradio, removeBgReplicate } from '@/lib/services';
import { getBucketName } from '@/lib/utils';

type ProcessImageArgs = {
  path: string;
  token: string;
  file: File;
};

export const processImage = async ({ path, token, file }: ProcessImageArgs) => {
  const supabase = createClient(await cookies());

  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  if (!user.data || user.error || !userId) return { error: 'UNAUTHORIZED' };

  const userCredit = await getUserCredits(userId);
  if (userCredit === 0) return { error: 'UNSUFFICIENT CREDIT' };

  const bucket = supabase.storage.from(getBucketName(userId));
  const usingGradio = !!env.USE_GRADIO;

  const processedImage = usingGradio
    ? await removeBgGradio('')
    : await removeBgReplicate(file);

  if (!processedImage) return { error: 'Failed to process' };

  if (usingGradio === false && process.env.NODE_ENV === 'production') {
    await reduceUserCredit(userId);
  }

  const { data, error } = await bucket.uploadToSignedUrl(
    path,
    token,
    processedImage,
  );
  if (!data || error) return { error: 'Failed to upload' };

  return { error: null };
};
