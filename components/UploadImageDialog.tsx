'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useUploadFile } from '@/hooks/use-upload-file';
import type { OnInteractionOutside } from '@/components/ui/types';
import { createClient } from '@/lib/supabase/client';
import { processImage } from '@/server/actions';

type Props = {
  creditsLeft: number;
  bucketName: string;
  children: React.ReactNode;
};

type UploadImagePlaceholderProps = {
  uploadFile: ReturnType<typeof useUploadFile>['uploadFile'];
  isUploading: boolean;
};

const UploadImagePlaceholder = ({
  uploadFile,
  isUploading,
}: UploadImagePlaceholderProps) => {
  return (
    <>
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Upload className="w-6 h-6 text-primary" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-zinc-900">
          Click to upload or drag and drop
        </p>
        <p className="text-sm text-zinc-500">Up to 15MB per image</p>
      </div>
      <Button variant="outline" onClick={uploadFile} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Select File'}
      </Button>
    </>
  );
};

const PreviewImage = ({
  previewProcessedImage,
  previewOriginalImage,
}: {
  previewProcessedImage: string;
  previewOriginalImage: string;
}) => {
  return previewProcessedImage === '' ? (
    <Image
      src={previewOriginalImage!}
      alt="preview image"
      className="max-w-md max-h-md w-full h-auto"
      width={550}
      height={550}
    />
  ) : (
    <Image
      src={previewProcessedImage!}
      alt="preview image"
      className="max-w-md max-h-md w-full h-auto"
      width={550}
      height={550}
    />
  );
};

export const UploadImageDialog = ({ children }: Props) => {
  const [supabase] = useState(() => createClient());
  const [dontSave, setDontSave] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewProcessedImage, setPreviewProcessedImage] = useState('');

  const { file, uploadFile, inputElement, base64String } = useUploadFile();

  const onInteractOutside: OnInteractionOutside = (event) => {
    if (isUploading) {
      event.preventDefault();
      return;
    }
  };

  const onUpload = async () => {
    if (!file?.name) return;
    setIsUploading(true);

    const filepath = Date.now() + file.name;

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (!session || !session?.user || error) {
        throw new Error('Failed to get session');
      }

      const bucketName = `user_${session?.user.id}`;
      const bucket = supabase.storage.from(bucketName);
      const { data, error: uploadError } = await bucket.upload(filepath, file);
      if (!data || uploadError) {
        console.log({ data, uploadError });
        throw new Error('Failed to upload file');
      }

      // Get presigned url
      const { data: originalSignedUrl, error: signedUrlError } =
        await bucket.createSignedUrl(filepath, 1000 * 600);
      if (!originalSignedUrl || signedUrlError) {
        console.log(signedUrlError);
        throw new Error('Failed to get presigned Url');
      }

      const processedImage = Date.now() + file.name + '.png';
      const { data: signedUploadData, error: signedUploadError } =
        await bucket.createSignedUploadUrl(processedImage);
      if (signedUploadError) {
        throw new Error('Failed to create upload Url');
      }

      // send it to action
      const { error: processError } = await processImage({
        filename: processedImage,
        path: signedUploadData.path,
        token: signedUploadData.token,
        bucketName,
        originalImageUrl: originalSignedUrl.signedUrl,
      });

      if (processError !== null) {
        console.log(processError);
        throw new Error(processError);
      }

      const processedImageUrl = await bucket.createSignedUrl(
        processedImage,
        60 * 10,
      );
      if (processedImageUrl.error) {
        throw new Error('Failed to get processed image');
      }

      setPreviewProcessedImage(processedImageUrl.data.signedUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      {inputElement}
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={onInteractOutside}
        >
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6">
            <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-zinc-200 rounded-lg bg-zinc-50">
              {file ? (
                <PreviewImage
                  previewProcessedImage={previewProcessedImage}
                  previewOriginalImage={base64String!}
                />
              ) : (
                <UploadImagePlaceholder
                  uploadFile={uploadFile}
                  isUploading={isUploading}
                />
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="dontSave"
                checked={dontSave}
                onChange={() => setDontSave((prev) => !prev)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="dontSave"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Don&apos;t save to my account
                </label>
                <p className="text-sm text-zinc-500">
                  Image will be deleted after processing
                </p>
              </div>
            </div>

            <Button disabled={isUploading} onClick={onUpload}>
              {isUploading ? 'Processing...' : `Remove Background (1 Credit)`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
