import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getCachedUserCredits } from '@/lib/cache';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Your Workspace – Remove Backgrounds & Create Magic with Extract',
  description:
    'Edit images effortlessly with Extract. Upload, remove backgrounds, and download in seconds. Your creative workspace starts here!',
};

export default async function AppLayout({ children }: React.PropsWithChildren) {
  const supabase = createClient(await cookies());

  const { data, error } = await supabase.auth.getUser();
  if (!data.user || error) {
    redirect('/login');
  }

  getCachedUserCredits(data.user.id);

  return <>{children}</>;
}
