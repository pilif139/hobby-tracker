import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentUser } from '../current-user/CurrentUserContext';
import LoginSchema from './LoginSchema';
import type { PostAuthLoginRequest } from '@/api/generated/api';
import { authApiClient } from '@/api';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemMedia } from '@/components/ui/item';
import { MeshGradientBackground } from '@/components/ui/mesh-gradient';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useCurrentUser();

  const isFieldInvalid = (isTouched: boolean, isValid: boolean) =>
    isTouched && !isValid;

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await loginMutation.mutateAsync(value);
      } catch {
        // Error is handled in useMutation onError callback
      }
    },
    validators: {
      onChangeAsync: LoginSchema,
      onChangeAsyncDebounceMs: 500,
    },
  });

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async (input: PostAuthLoginRequest) => {
      // suppress global API error toast here — this action will show its own toast
      const res = await authApiClient.postAuthLogin(
        { postAuthLoginRequest: input },
        { headers: { 'x-toast-suppressed': '1' } },
      );
      return res.data;
    },
    onSuccess: async (user) => {
      setCurrentUser(user);
      toast.success('Signed in');
      await navigate({ to: '/' });
    },
    onError: (err: any) => {
      const message = err?.message ?? 'Sign in failed';
      toast.error(String(message));
    },
  });

  const loginErrorMessage =
    loginMutation.error instanceof Error ? loginMutation.error.message : null;

  return (
    <MeshGradientBackground className="dark">
      <div className="grid min-h-screen w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-[60%_40%]">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary/20 to-transparent p-8 text-white sm:flex z-20 lg:p-12">
          <div className="relative z-20 flex">
            <img src="/logo-2.png" alt="Logo" className="h-16 w-auto lg:h-20" />
          </div>

          <div className="relative z-20 max-w-md space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/80">
              Hobby Tracker
            </p>
            <h2 className="font-heading text-4xl font-semibold tracking-tight lg:text-5xl">
              Keep your hobby streak visible
            </h2>
            <p className="text-base text-white/80">
              Log every session, stay consistent, and review your progress at a
              glance.
            </p>
          </div>
        </div>

        <div className="flex w-full items-center justify-center px-4 py-6 text-foreground z-20 bg-background/60 backdrop-blur-xl sm:px-6 sm:py-10 lg:border-l border-white/10">
          <div className="mx-auto w-full max-w-sm space-y-6">
            <div className="flex flex-col gap-y-2 text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
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
                    const isInvalid = isFieldInvalid(
                      field.state.meta.isTouched,
                      field.state.meta.isValid,
                    );
                    return (
                      <Field data-invalid={isInvalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
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
                    const isInvalid = isFieldInvalid(
                      field.state.meta.isTouched,
                      field.state.meta.isValid,
                    );
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

                {loginErrorMessage && (
                  <Item className="bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive rounded-md">
                    <ItemMedia variant="icon">
                      <TriangleAlert className="h-4 w-4" />
                    </ItemMedia>
                    <ItemContent>{loginErrorMessage}</ItemContent>
                  </Item>
                )}

                <form.Subscribe selector={(state) => state.isSubmitting}>
                  {(isFormSubmitting) => {
                    const isBusy = isFormSubmitting || loginMutation.isPending;

                    return (
                      <Button
                        type="submit"
                        className="w-full mt-2"
                        disabled={isBusy}
                      >
                        {isBusy ? 'Signing in…' : 'Sign in'}
                      </Button>
                    );
                  }}
                </form.Subscribe>
              </div>
            </form>

            <p className="text-muted-foreground text-center text-sm mt-6">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
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
