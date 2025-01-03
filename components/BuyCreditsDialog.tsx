import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const BuyCreditsDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Buy Credits
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buy Additional Credits</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 hover:border-primary/50 cursor-pointer">
              <div>
                <div className="font-medium">50 Credits</div>
                <div className="text-sm text-zinc-500">
                  Perfect for small projects
                </div>
              </div>
              <Button>$10</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 hover:border-primary/50 cursor-pointer">
              <div>
                <div className="font-medium">200 Credits</div>
                <div className="text-sm text-zinc-500">Most popular</div>
              </div>
              <Button>$35</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 hover:border-primary/50 cursor-pointer">
              <div>
                <div className="font-medium">500 Credits</div>
                <div className="text-sm text-zinc-500">Best value</div>
              </div>
              <Button>$75</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
