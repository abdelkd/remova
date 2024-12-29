import { Image as ImageIcon, Plus, Info, CreditCard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { BuyCreditsDialog } from '@/components/buy-credits-dialog';
import { UploadImageDialog } from '@/components/upload-image-dialog';
import UserImagesGrid from '@/components/UserImagesGrid';

const MainApp = () => {
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
              <span className="text-sm font-medium text-zinc-900">
                {creditsLeft} credits left
              </span>
            </div>

            <BuyCreditsDialog />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900">
            Background Removal
          </h1>

          <UploadImageDialog>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Image
            </Button>
          </UploadImageDialog>
        </div>

        <UserImagesGrid />
      </div>

      {creditsLeft < 10 && (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 text-white p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span className="text-sm">
                Running low on credits? Buy more to continue removing
                backgrounds.
              </span>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-white border-white hover:text-zinc-900"
                >
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
