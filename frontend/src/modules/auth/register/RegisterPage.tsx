import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentUser } from '../current-user/CurrentUserContext';
import RegisterSchema from './RegisterSchema';
import type { PostAuthRegisterRequest } from '@/api/generated/api';
import { authApiClient } from '@/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Item, ItemContent, ItemMedia } from '@/components/ui/item';
import { MeshGradientBackground } from '@/components/ui/mesh-gradient';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useCurrentUser();

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await registerMutation.mutateAsync(value);
    },
    validators: {
      onChangeAsync: RegisterSchema,
      onChangeAsyncDebounceMs: 500,
    },
  });

  const registerMutation = useMutation({
    mutationKey: ['register'],
    mutationFn: async (input: PostAuthRegisterRequest) => {
      const res = await authApiClient.postAuthRegister({
        postAuthRegisterRequest: input,
      });
      return res.data;
    },
    onSuccess: async (user) => {
      setCurrentUser(user);
      toast.success('Account created');
      await navigate({ to: '/' });
    },
    onError: (err: any) => {
      const message = err?.message ?? 'Registration failed';
      toast.error(String(message));
    },
  });

  return (
    <MeshGradientBackground className="dark">
      <div className="flex min-h-screen w-full lg:flex-row">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-primary/20 to-transparent p-8 text-white lg:flex lg:w-[60%] z-20 lg:p-12">
          <div className="relative z-20 max-w-md space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/80">
              Hobby Tracker
            </p>
            <h2 className="font-heading text-4xl font-semibold tracking-tight lg:text-5xl">
              Turn new habits into visible progress
            </h2>
            <p className="text-base text-white/80">
              Create an account to track sessions, stay organized, and keep your
              goals moving.
            </p>
          </div>
        </div>

        <div className="flex w-full lg:w-[40%] items-center justify-center p-6 sm:p-10 text-foreground z-20 bg-background/60 backdrop-blur-xl lg:border-l border-white/10">
          <div className="mx-auto w-full max-w-sm space-y-6">
            <div className="flex flex-col gap-y-2 text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Create your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your details below to start tracking your hobbies
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
                <form.Field name="name">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                        <Input
                          id={field.name}
                          type="text"
                          placeholder="John Doe"
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

                {registerMutation.error && (
                  <Item className="bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive rounded-md">
                    <ItemMedia variant="icon">
                      <TriangleAlert className="h-4 w-4" />
                    </ItemMedia>
                    <ItemContent>{registerMutation.error.message}</ItemContent>
                  </Item>
                )}

                <form.Subscribe selector={(state) => state.isSubmitting}>
                  {(isSubmitting) => (
                    <Button
                      type="submit"
                      className="w-full mt-2"
                      disabled={isSubmitting || registerMutation.isPending}
                    >
                      {isSubmitting || registerMutation.isPending
                        ? 'Creating account…'
                        : 'Sign up'}
                    </Button>
                  )}
                </form.Subscribe>
              </div>
            </form>

            <p className="text-muted-foreground text-center text-sm mt-6">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary underline-offset-4 hover:underline font-medium"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MeshGradientBackground>
  );
}
