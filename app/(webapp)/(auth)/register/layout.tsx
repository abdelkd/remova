import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join Extract – Sign Up for Instant Background Removal',
  description:
    'Sign up for Extract and remove image backgrounds instantly. Join now for fast, professional edits. Free and easy to use!',
};

const SignupLayout = async ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export default SignupLayout;
