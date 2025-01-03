import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getCachedUser,
  getCachedUserCredits,
  getCachedUserImages,
} from '@/lib/cache';

export const maxDuration = 60;

export const metadata: Metadata = {
  title: 'Your Workspace – Remove Backgrounds & Create Magic with Extract',
  description:
    'Edit images effortlessly with Extract. Upload, remove backgrounds, and download in seconds. Your creative workspace starts here!',
};

export default async function AppLayout({ children }: React.PropsWithChildren) {
  const { data, error } = await getCachedUser();
  if (!data.user || error) {
    redirect('/login');
  }

  getCachedUserImages(data.user.id);
  getCachedUserCredits(data.user.id);
  getCachedUser();

  return <>{children}</>;
}
