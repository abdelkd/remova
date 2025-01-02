import { Image as ImageIcon, Plus } from 'lucide-react';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { UploadImageDialog } from '@/components/UploadImageDialog';
import { getCachedUser } from '@/lib/cache';

const UserImagesGrid = async ({}) => {
  const {
    data: { user },
    error,
  } = await getCachedUser();
  if (!user || error) return redirect('/login');

  const images = [];

  return (
    <>
      {images.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-200 p-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-zinc-400" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-zinc-900 mb-1">
                No images yet
              </h3>
              <p className="text-sm text-zinc-500 max-w-sm">
                Upload your first image to remove its background. Each image
                processed uses 1 credit.
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
          {images &&
            images.map((image) => (
              <p key={image.id ?? Symbol('pew')}>{JSON.stringify(image)}</p>
            ))}
        </div>
      )}
    </>
  );
};

export default UserImagesGrid;
