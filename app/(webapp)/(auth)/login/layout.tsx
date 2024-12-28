import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome Back to Extract – Log In to Continue',
  description:
    'Log in to Extract for quick and easy background removal. Access your projects and edit images seamlessly. Start creating now!',
};

const LoginLayout = async ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export default LoginLayout;
