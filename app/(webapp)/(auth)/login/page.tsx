'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormRootError,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authFormSchema } from '@/schemas';

import { loginUser } from '@/server/actions';
import type { AuthForm } from '@/types';
import LoadingSpinner from '@/components/loading-spinner';

const LoginPage = () => {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const form = useForm<AuthForm>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: AuthForm) => {
    const user = await loginUser(values);
    if (!user) {
      form.setError('root', { message: 'Invalid login credentials.' });
      return;
    }

    setIsSuccess(true);
    router.push('/app');
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <Card className="max-w-md w-10/12 mx-auto">
        <CardHeader>
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>Log in to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="example@mail.com" {...field} />
                      </FormControl>
                      <FormDescription>Enter your email</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="" type="password" {...field} />
                      </FormControl>
                      <FormDescription>Enter your password</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormRootError />
                {isSuccess ? (
                  <p className="text-sm text-green-500">
                    Logged in successfully
                  </p>
                ) : null}
              </div>

              <div>
                {' '}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <LoadingSpinner />
                      Loggin in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
                <p>
                  Do not have an account?{' '}
                  <Button variant="link" className="p-0" asChild>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
