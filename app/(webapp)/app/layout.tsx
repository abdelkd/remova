import { getCurrentSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getCachedUserCredits } from '@/lib/cache';

export const metadata: Metadata = {
  title: 'Your Workspace – Remove Backgrounds & Create Magic with Extract',
  description:
    'Edit images effortlessly with Extract. Upload, remove backgrounds, and download in seconds. Your creative workspace starts here!',
};

export default async function AppLayout({ children }: React.PropsWithChildren) {
  const { user } = await getCurrentSession();
  if (!user) return redirect('/login');

  getCachedUserCredits(user.id);

  return <>{children}</>;
}
