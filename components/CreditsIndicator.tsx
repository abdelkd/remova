import { CreditCard } from 'lucide-react';
import { redirect } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';
import { getCachedUser, getCachedUserCredits } from '@/lib/cache';

export const CreditsIndicatorSkeleton = () => {
  return (
    <Skeleton className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-full w-8 h-4" />
  );
};

const CreditsIndicator = async () => {
  const {
    data: { user },
    error,
  } = await getCachedUser();
  if (!user || error) return redirect('/login');

  const credits = await getCachedUserCredits(user.id);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-full">
      <CreditCard className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium text-zinc-900">
        {credits} credits left
      </span>
    </div>
  );
};

export default CreditsIndicator;
