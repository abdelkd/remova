'use server';
import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { getUserCredits } from '@/server/db';
import { removeBgReplicate } from '@/lib/services';
import { revalidatePath } from 'next/cache';

type ProcessImageArgs = {
  file: File;
};

export const processImage = async ({ file }: ProcessImageArgs) => {
  const supabase = createClient(await cookies());
  const supabaseServiceRole = createServiceRoleClient();

  const imagesBucket = supabase.storage.from('images');
  const temporaryImagesBucket = supabaseServiceRole.storage.from('images-temp');

  try {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    if (!user.data || user.error || !userId) {
      throw new Error('Unauthorized Request');
    }

    const userCredit = await getUserCredits(userId);
    if (userCredit === 0) {
      throw new Error('Unsufficient Credit');
    }

    const tempFilePath = userId + Date.now();
    const uploadTempFileResult = await temporaryImagesBucket.upload(
      tempFilePath,
      file,
    );

    if (!uploadTempFileResult.data || uploadTempFileResult.error) {
      console.error(uploadTempFileResult.error);
      throw new Error('Failed to upload to temporary bucjet');
    }

    const signedUrlTempFileResult = await temporaryImagesBucket.createSignedUrl(
      tempFilePath,
      60 * 5,
    );
    if (!signedUrlTempFileResult.data || signedUrlTempFileResult.error) {
      console.error(signedUrlTempFileResult.error);
      throw new Error('Failed to create signed url');
    }

    const imageProcess = await removeBgReplicate(
      signedUrlTempFileResult.data.signedUrl,
    );
    if (!imageProcess.data || imageProcess.error) {
      console.error(imageProcess.error);
      throw new Error('Process Service Responded with Null');
    }

    const imageBlob = await fetch(imageProcess.data.url).then((r) => r.blob());
    const imagePath = `user_${userId}/${Date.now()}.png`;
    const uploadResult = await imagesBucket.upload(imagePath, imageBlob);
    if (!uploadResult.data || uploadResult.error) {
      console.error(uploadResult.error);
      throw new Error("Couldn't Upload Result File");
    }

    const signedUrlResult = await imagesBucket.createSignedUrl(
      imagePath,
      60 * 5,
    );
    if (!signedUrlResult.data || signedUrlResult.error) {
      console.error(signedUrlResult.error);
      throw new Error("Couldn't Get Signed URL");
    }

    revalidatePath('/app');

    return {
      data: { url: signedUrlResult.data.signedUrl },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: { url: null },
      error: "Sorry We Couldn't Process your Request",
    };
  }
};
