'use client';

import { MouseEventHandler, useState } from 'react';
import Image from 'next/image';
import { Upload, X, Download } from 'lucide-react';
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
import { processImage } from '@/server/actions';
import { useToast } from '@/hooks/use-toast';

type Props = {
  credits: number;
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
      className="max-w-md max-h-80 w-full h-auto object-cover"
      width={550}
      height={550}
    />
  ) : (
    <Image
      src={previewProcessedImage!}
      alt="preview image"
      className="max-w-md max-h-80 w-full h-auto object-cover"
      width={550}
      height={550}
    />
  );
};

export const UploadImageDialog = ({ children, credits }: Props) => {
  const { toast } = useToast();

  // const [supabase] = useState(() => createClient());
  const [dontSave, setDontSave] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewProcessedImage, setPreviewProcessedImage] = useState('');

  const { file, uploadFile, inputElement, base64String, clearFiles } =
    useUploadFile();

  const onInteractOutside: OnInteractionOutside = (event) => {
    if (isUploading) {
      event.preventDefault();
      return;
    }
  };

  const onUpload = async () => {
    if (!file?.name) return;
    setIsUploading(true);

    try {
      const processResult = await processImage({ file });

      if (!processResult.data?.url || processResult.error) {
        toast({
          title: 'Uh! oh, Something Went Wrong',
          content: "We Couldn't Process your request",
        });
        throw new Error(processResult.error!);
      }

      setPreviewProcessedImage(processResult.data.url!);
    } catch (err) {
      console.error(err);
      toast({
        description: 'Oh! Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadFile: MouseEventHandler<HTMLButtonElement> = async (e) => {
    if (e === undefined) return;

    const a = document.createElement('a');

    const response = await fetch(previewProcessedImage);
    if (!response.ok) return;

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    a.href = url;
    a.download = 'file.png';
    document.body.appendChild(a);
    a.click();
  };

  const cleanup = () => {
    setDontSave(false);
    setIsUploading(false);
    setPreviewProcessedImage('');
    clearFiles();
  };

  return (
    <div>
      {inputElement}
      <Dialog onOpenChange={(state) => (!state ? cleanup() : null)}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={onInteractOutside}
        >
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6">
            <div className="relative flex flex-col items-center gap-4 p-6 border-2 border-dashed border-zinc-200 rounded-lg bg-zinc-50 max-h-md">
              <div className="absolute -top-2 -right-2">
                {base64String && previewProcessedImage === '' ? (
                  <Button
                    className="rounded-md p-0.5 h-fit"
                    variant="secondary"
                    onClick={clearFiles}
                    disabled={isUploading}
                  >
                    <X size={4} />
                  </Button>
                ) : null}
              </div>
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

            {previewProcessedImage === '' ? (
              <Button
                disabled={isUploading || credits === 0 || !file}
                onClick={onUpload}
              >
                {isUploading ? 'Processing...' : `Remove Background (1 Credit)`}
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <Button onClick={downloadFile}>
                  <Download size={4} />
                  Download
                </Button>
                <Button variant="secondary" onClick={cleanup}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
