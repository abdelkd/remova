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
// import { getSignedURL } from '@/server/actions';
import { createClient } from '@/lib/supabase/client';

type Props = {
  creditsLeft: number;
  bucketName: string;
  children: React.ReactNode;
};

export const UploadImageDialog = ({ creditsLeft, children }: Props) => {
  const [] = useState(() => createClient());
  const [dontSave, setDontSave] = useState(false);
  const [isUploading] = useState(false);

  const { file, uploadFile, inputElement, base64String } = useUploadFile();

  const onInteractOutside: OnInteractionOutside = (event) => {
    if (isUploading) {
      event.preventDefault();
      return;
    }
  };

  const onUpload = async () => {
    if (!file?.name) return;
    // setIsUploading(true);
    //
    // const filepath = Date.now() + file.name;
    //
    // try {
    //   const data = await getSignedURL(filepath);
    //   if (!data) throw new Error('No Signed URL');
    //
    //   const { path, token } = data;
    //   const result = await supabaseClient.storage
    //     .from(bucketName)
    //     .uploadToSignedUrl(path, token, file);
    //
    //   if (!result.data || result.error) throw new Error('Failed to upload');
    // } catch (err) {
    //   console.error(err);
    // } finally {
    //   setIsUploading(false);
    // }
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
                <Image
                  src={base64String!}
                  alt="preview image"
                  className="max-w-md w-full h-auto"
                  width={550}
                  height={550}
                />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-zinc-900">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-zinc-500">
                      Up to 15MB per image
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={uploadFile}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Select File'}
                  </Button>
                </>
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

            <Button
              disabled={isUploading || creditsLeft === 0 || file === undefined}
              onClick={onUpload}
            >
              {isUploading ? 'Processing...' : `Remove Background (1 Credit)`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
