import { Image as ImageIcon, Plus } from 'lucide-react';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { BuyCreditsDialog } from '@/components/BuyCreditsDialog';
import { UploadImageDialog } from '@/components/upload-image-dialog';
import UserImagesGrid from '@/components/UserImagesGrid';
import CreditsIndicator, {
  CreditsIndicatorSkeleton,
} from '@/components/CreditsIndicator';
import LowCreditsInfo from '@/components/LowCreditsInfo';

const MainApp = () => {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <span className="font-semibold text-zinc-900">My Images</span>
          </div>
          <div className="flex items-center gap-4">
            <Suspense fallback={<CreditsIndicatorSkeleton />}>
              <CreditsIndicator />
            </Suspense>

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

      <Suspense>
        <LowCreditsInfo />
      </Suspense>
    </div>
  );
};

export default MainApp;
