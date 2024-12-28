import { PropsWithChildren } from 'react';
import { getCurrentSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

const AuthLayout = async ({ children }: PropsWithChildren) => {
  const { user } = await getCurrentSession();
  if (user) return redirect('/app');

  return <>{children}</>;
};

export default AuthLayout;
