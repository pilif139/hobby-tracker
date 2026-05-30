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
<<<<<<< HEAD
      name: '',
      email: '',
=======
      email: '',
      name: '',
>>>>>>> caeb8d5 ([feature/user-dropdown] feat(frontend): add registration flow with guest route and auth handoff)
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
<<<<<<< HEAD
      const res = await authApiClient.postAuthRegister({
        postAuthRegisterRequest: input,
      });
=======
      const res = await authApiClient.postAuthRegister(
        { postAuthRegisterRequest: input },
        { headers: { 'x-toast-suppressed': '1' } },
      );
>>>>>>> caeb8d5 ([feature/user-dropdown] feat(frontend): add registration flow with guest route and auth handoff)
      return res.data;
    },
    onSuccess: async (user) => {
      setCurrentUser(user);
<<<<<<< HEAD
      await navigate({ to: '/feed' });
=======
      toast.success('Account created');
      await navigate({ to: '/' });
    },
    onError: (err: any) => {
      const message = err?.message ?? 'Registration failed';
      toast.error(String(message));
>>>>>>> caeb8d5 ([feature/user-dropdown] feat(frontend): add registration flow with guest route and auth handoff)
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
                Create your account
              </h1>
              <p className="text-sm text-muted-foreground">
<<<<<<< HEAD
                Enter your details below to start tracking your hobbies
=======
                Fill in your details below to create a new account
>>>>>>> caeb8d5 ([feature/user-dropdown] feat(frontend): add registration flow with guest route and auth handoff)
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
<<<<<<< HEAD
                <form.Field name="name">
=======
                <form.Field name="email">
>>>>>>> caeb8d5 ([feature/user-dropdown] feat(frontend): add registration flow with guest route and auth handoff)
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="grid gap-2">
<<<<<<< HEAD
                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                        <Input
                          id={field.name}
                          type="text"
                          placeholder="John Doe"
=======
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          type="email"
                          placeholder="you@example.com"
>>>>>>> caeb8d5 ([feature/user-dropdown] feat(frontend): add registration flow with guest route and auth handoff)
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

<<<<<<< HEAD
                <form.Field name="email">
=======
                <form.Field name="name">
>>>>>>> caeb8d5 ([feature/user-dropdown] feat(frontend): add registration flow with guest route and auth handoff)
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="grid gap-2">
<<<<<<< HEAD
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          type="email"
                          placeholder="you@example.com"
=======
                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          placeholder="Filip Demo"
>>>>>>> caeb8d5 ([feature/user-dropdown] feat(frontend): add registration flow with guest route and auth handoff)
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
<<<<<<< HEAD
                Log in
=======
                Sign in
>>>>>>> caeb8d5 ([feature/user-dropdown] feat(frontend): add registration flow with guest route and auth handoff)
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MeshGradientBackground>
  );
}
