import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { redirect } from 'next/navigation';
import { getCachedUser, getCachedUserCredits } from '@/lib/cache';

const LowCreditsInfo = async () => {
  const {
    data: { user },
    error,
  } = await getCachedUser();
  if (!user || error) return redirect('/login');

  const creditsLeft = await getCachedUserCredits(user.id);

  return (
    <>
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
                  className="border-white text-foreground"
                >
                  Buy Credits
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
      )}
    </>
  );
};

export default LowCreditsInfo;
