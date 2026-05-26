import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { TriangleAlert } from 'lucide-react';
import { useCurrentUser } from '../current-user/CurrentUserContext';
import LoginSchema from './LoginSchema';
import type { PostAuthLoginRequest } from '@/api/generated/api';
import { authApiClient } from '@/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Item, ItemContent, ItemMedia } from '@/components/ui/item';
import { MeshGradientBackground } from '@/components/ui/mesh-gradient';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useCurrentUser();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync(value);
    },
    validators: {
      onChangeAsync: LoginSchema,
      onChangeAsyncDebounceMs: 500,
    },
  });

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async (input: PostAuthLoginRequest) => {
      const res = await authApiClient.postAuthLogin({
        postAuthLoginRequest: input,
      });
      return res.data;
    },
    onSuccess: async (user) => {
      setCurrentUser(user);
      await navigate({ to: '/feed' });
    },
  });

  return (
    <MeshGradientBackground className="dark">
      <div className="flex min-h-screen w-full lg:flex-row">
        <div className="relative hidden flex-col text-white lg:flex lg:w-[60%] z-20">
          <div className="relative z-20 flex">
            <img src="/logo-2.png" alt="Logo" className="h-full w-auto" />
          </div>
        </div>

        <div className="flex w-full lg:w-[40%] items-center justify-center p-6 sm:p-10 text-foreground z-20 bg-background/60 backdrop-blur-xl lg:border-l border-white/10">
          <div className="mx-auto w-full max-w-sm space-y-6">
            <div className="flex flex-col gap-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Login to your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>

            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <div className="grid gap-4">
                <form.Field name="email">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          type="email"
                          placeholder="you@example.com"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="password">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="password"
                          placeholder="••••••••"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                {loginMutation.error && (
                  <Item className="bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive rounded-md">
                    <ItemMedia variant="icon">
                      <TriangleAlert className="h-4 w-4" />
                    </ItemMedia>
                    <ItemContent>{loginMutation.error.message}</ItemContent>
                  </Item>
                )}

                <form.Subscribe selector={(state) => state.isSubmitting}>
                  {(isSubmitting) => (
                    <Button
                      type="submit"
                      className="w-full mt-2"
                      disabled={isSubmitting || loginMutation.isPending}
                    >
                      {isSubmitting || loginMutation.isPending
                        ? 'Signing in…'
                        : 'Sign in'}
                    </Button>
                  )}
                </form.Subscribe>
              </div>
            </form>

            <p className="text-muted-foreground text-center text-sm mt-6">
              Don&apos;t have an account?{' '}
              <Link
<<<<<<< HEAD
                to="/register"
=======
                to="/feed"
>>>>>>> 9bd1ab5 ([frontend/feed] add backend communication to the feed; change some)
                className="text-primary underline-offset-4 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MeshGradientBackground>
  );
}
