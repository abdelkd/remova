import { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

const AuthLayout = async ({ children }: PropsWithChildren) => {
  const supabase = createClient(await cookies());
  const { data } = await supabase.auth.getUser();
  if (data?.user) {
    redirect('/app');
  }

  return <>{children}</>;
};

export default AuthLayout;
