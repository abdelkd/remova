'use client';

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Info,
  CreditCard
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { BuyCreditsDialog } from '@/components/buy-credits-dialog';
import { UploadImageDialog } from '../../../components/upload-image-dialog';

const MainApp = () => {
  const [images] = useState([]);

  const creditsLeft = 43;

  return (
    <div className="min-h-screen bg-zinc-50">
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

      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900">Background Removal</h1>

          <UploadImageDialog>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Image
            </Button>
          </UploadImageDialog>
        </div>

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
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainApp;
