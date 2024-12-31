'use client';

import { useState } from 'react';
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
import LoadingSpinner from '@/components/loading-spinner';
import { authFormSchema } from '@/schemas';

import { signUpUser } from '@/server/actions';
import type { AuthForm } from '@/types';

const SignupPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const form = useForm<AuthForm>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: AuthForm) => {
    const { data, error } = await signUpUser(values);
    if (!data || error) {
      form.setError('root', {
        message: 'User already exists, please sign in.',
      });
      return;
    }

    setIsSuccess(true);
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <Card className="max-w-md w-10/12 mx-auto">
        <CardHeader>
          <CardTitle>Create Account!</CardTitle>
          <CardDescription>Sign up to get started.</CardDescription>
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
                      <FormDescription>Provide your email</FormDescription>
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
                      <FormDescription>Create password</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormRootError />
                {isSuccess ? (
                  <p className="text-sm text-green-500">
                    Successfully registered, logging in...
                  </p>
                ) : null}
              </div>

              <div>
                <Button
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <LoadingSpinner />
                      Creating account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </Button>
                <p>
                  Already have an account?{' '}
                  <Button variant="link" className="p-0" asChild>
                    <Link href="/login">Sign In</Link>
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

export default SignupPage;
