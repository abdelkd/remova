import { CreditCard } from 'lucide-react';
import { redirect } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentSession } from '@/lib/auth';
import { getCachedUserCredits } from '@/lib/cache';

export const CreditsIndicatorSkeleton = () => {
  return (
    <Skeleton className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-full w-8 h-4" />
  );
};

const CreditsIndicator = async () => {
  const { user } = await getCurrentSession();
  if (!user) return redirect('/login');

  const creditsLeft = await getCachedUserCredits(user.id);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-full">
      <CreditCard className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium text-zinc-900">
        {creditsLeft} credits left
      </span>
    </div>
  );
};

export default CreditsIndicator;
