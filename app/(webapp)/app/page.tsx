'use client';
import React, { useRef, useState, Fragment } from 'react';
import Image from 'next/image';
import {
  Upload,
  Image as ImageIcon,
  Plus,
  Info,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useUploadFile } from '@/hooks/use-upload-file';

const BuyCreditsDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Buy Credits
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buy Additional Credits</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 hover:border-primary/50 cursor-pointer">
              <div>
                <div className="font-medium">50 Credits</div>
                <div className="text-sm text-zinc-500">Perfect for small projects</div>
              </div>
              <Button>$10</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 hover:border-primary/50 cursor-pointer">
              <div>
                <div className="font-medium">200 Credits</div>
                <div className="text-sm text-zinc-500">Most popular</div>
              </div>
              <Button>$35</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 hover:border-primary/50 cursor-pointer">
              <div>
                <div className="font-medium">500 Credits</div>
                <div className="text-sm text-zinc-500">Best value</div>
              </div>
              <Button>$75</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const UploadImageDialog = ({ children }: { children: React.ReactNode }) => {
  const { file, uploadFile, inputElement, base64String } = useUploadFile();

  const isUploading = false;
  const dontSave = false;
  const setDontSave = () => false;
  const creditsLeft = 43;

  const onInteractOutside = (e) => {
    if (isUploading) {
      e.preventDefault();
      return;
    }
  }

  return (
    <div>
      {inputElement}
      <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md" onInteractOutside={onInteractOutside}>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6">
            <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-zinc-200 rounded-lg bg-zinc-50">
              {file ? (
                <Image src={base64String} alt="preview image" className="max-w-md w-full h-auto" width={550} height={550} />
              )
                  : (
                <>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-zinc-900">Click to upload or drag and drop</p>
                    <p className="text-sm text-zinc-500">Up to 15MB per image</p>
                  </div>
                  <Button variant="outline" onClick={uploadFile} disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Select File'}
                  </Button>
                </>
                  )
              }
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

            <Button disabled={isUploading || creditsLeft === 0}>
              {isUploading ? 'Processing...' : `Remove Background (1 Credit)`}
            </Button>
          </div>
        </DialogContent>
    </Dialog>
  </div>
  );
}

const MainApp = () => {
  const [images] = useState([]);

  // Simulated user credits
  const creditsLeft = 43;

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header with credits */}
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <span className="font-semibold text-zinc-900">My Images</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-full">
              <CreditCard className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-zinc-900">{creditsLeft} credits left</span>
            </div>

            <BuyCreditsDialog />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900">Background Removal</h1>

          {/* Upload Dialog */}
          <UploadImageDialog>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Image
            </Button>
          </UploadImageDialog>
        </div>

        {/* Image grid or empty state */}
        {images.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-200 p-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-zinc-400" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-zinc-900 mb-1">No images yet</h3>
                <p className="text-sm text-zinc-500 max-w-sm">
                  Upload your first image to remove its background. Each image processed uses 1 credit.
                </p>
              </div>
              <UploadImageDialog>
                <Button variant="outline" className="mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </UploadImageDialog>

            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Image grid would go here */}
          </div>
        )}
      </div>

      {/* Info banner */}
      {creditsLeft < 10 && (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 text-white p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span className="text-sm">Running low on credits? Buy more to continue removing backgrounds.</span>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-white border-white hover:text-zinc-900">
                  Buy Credits
                </Button>
              </DialogTrigger>
              {/* Credits purchase dialog content */}
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainApp;
