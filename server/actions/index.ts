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
  if (userCredit === 222) return { error: 'UNSUFFICIENT CREDIT' };

  const bucket = supabase.storage.from(getBucketName(userId));
  const tempFile = Date.now().toString();

  const uploadedFile = await bucket.upload(tempFile, file);
  if (!uploadedFile.data || uploadedFile.error) return { error: 'FAILED' };

  const uploadedFileUrl = await bucket.createSignedUrl(
    uploadedFile.data.path,
    60 * 15,
  );
  if (!uploadedFileUrl.data || uploadedFileUrl.error)
    return { error: 'FAILED' };

  const usingGradio = !!env.USE_GRADIO;

  const processedImage = usingGradio
    ? await removeBgGradio('')
    : await removeBgReplicate(uploadedFileUrl.data.signedUrl);

  if (!processedImage) return { error: 'Failed to process' };

  const blob = await fetch(processedImage).then((r) => r.blob());
  const { data, error } = await bucket.uploadToSignedUrl(path, token, blob);
  if (!data || error) return { error: 'Failed to upload' };

  await bucket.remove([uploadedFile.data.path]);

  if (usingGradio === false && process.env.NODE_ENV === 'production') {
    await reduceUserCredit(userId);
  }

  return { error: null };
};
