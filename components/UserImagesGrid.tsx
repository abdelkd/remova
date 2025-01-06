import { Suspense } from 'react';
import { Image as ImageIcon, Plus } from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { UploadImageDialog } from '@/components/UploadImageDialog';
import {
  getCachedUser,
  getCachedUserCredits,
  getCachedUserImages,
} from '@/lib/cache';
import { SupabaseFileObject } from '@/types';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

type ImageCardProps = {
  imageInfo: NonNullable<SupabaseFileObject>[number];
};

export const ImageCardSkeleton = () => {
  return <Skeleton />;
};

export const ImageCard = async ({ imageInfo }: ImageCardProps) => {
  const supabase = createClient(await cookies());
  const userId = (await getCachedUser()).data.user!.id;
  const imagePath = `user_${userId!}/${imageInfo.name}`;
  const { data } = await supabase.storage
    .from('images')
    .createSignedUrl(imagePath, 60 * 30);

  await new Promise((res) => setTimeout(res, 4000));

  return (
    <Image
      src={data!.signedUrl}
      alt={'An image'}
      height={512}
      width={512}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgdmlld0JveD0iMCAwIDEwIDEwIj4KICA8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9ImhzbCgyNDAsIDQuOCUsIDk1LjklKSIvPgo8L3N2Zz4="
    />
  );
};

const UserImagesGrid = async ({}) => {
  const {
    data: { user },
    error,
  } = await getCachedUser();
  if (!user || error) return redirect('/login');

  const credits = await getCachedUserCredits(user.id);
  const { data: images } = await getCachedUserImages(user.id);

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
            <UploadImageDialog credits={credits}>
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
              <Suspense key={image.id} fallback={<ImageCardSkeleton />}>
                <ImageCard imageInfo={image} />
              </Suspense>
            ))}
        </div>
      )}
    </>
  );
};

export default UserImagesGrid;
