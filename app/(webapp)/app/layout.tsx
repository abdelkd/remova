import { getCurrentSession } from '@/server/actions';
import { redirect } from 'next/navigation';

export default async function AppLayout({ children }: React.PropsWithChildren) {
  const user = await getCurrentSession();
  if (!user.user || user.session) return redirect('/login');

  return <>{children}</>;
}
