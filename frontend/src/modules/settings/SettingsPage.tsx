import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { Camera, Loader2, LogOut, Settings } from 'lucide-react';
import { toast } from 'sonner';
import type { PostUserAvatar200Response } from '@/api';
import { useCurrentUser } from '@/modules/auth/current-user/CurrentUserContext';
import { apiHttpClient, authApiClient, userApiClient } from '@/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { FadeIn } from '@/components/animations';

export default function SettingsPage() {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const updateProfileMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await userApiClient.patchUserMe({
        patchUserMeRequest: { name },
      });
      return res.data;
    },
    onSuccess: (data) => {
      setCurrentUser((prev) =>
        prev ? { ...prev, name: data.name, avatarUrl: data.avatarUrl } : null,
      );
      toast.success('Profile updated successfully');
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiHttpClient.post<PostUserAvatar200Response>(
        '/user/avatar',
        formData,
      );
      return res.data;
    },
    onSuccess: (data: any) => {
      setCurrentUser((prev) =>
        prev ? { ...prev, avatarUrl: data.url } : null,
      );
      toast.success('Avatar uploaded successfully');
      setAvatarFile(null);
    },
  });

  const logoutOtherDevicesMutation = useMutation({
    mutationFn: async () => {
      const res = await authApiClient.postAuthLogoutOtherDevices();
      return res.data;
    },
    onSuccess: () => {
      toast.success('Logged out from other devices');
    },
  });

  const form = useForm({
    defaultValues: {
      name: currentUser?.name ?? '',
    },
    onSubmit: async ({ value }) => {
      await updateProfileMutation.mutateAsync(value.name);
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleAvatarUpload = async () => {
    if (avatarFile) {
      await uploadAvatarMutation.mutateAsync(avatarFile);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 sm:py-12">
        <FadeIn>
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2">
                <Settings className="size-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Manage your account preferences and profile information.
            </p>
          </section>
        </FadeIn>

        <div className="grid gap-8">
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your display name and profile picture.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="relative group">
                    <Avatar className="size-24 border-4 border-background shadow-xl">
                      <AvatarImage
                        src={currentUser?.avatarUrl ?? undefined}
                        alt={currentUser?.name}
                      />
                      <AvatarFallback className="text-2xl">
                        {currentUser?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="size-6" />
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                    <div className="space-y-1">
                      <h3 className="font-medium">Profile Picture</h3>
                      <p className="text-sm text-muted-foreground">
                        JPG, GIF or PNG. Max size 5MB.
                      </p>
                    </div>
                    {avatarFile && (
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">
                          Selected: {avatarFile.name}
                        </p>
                        <Button
                          size="sm"
                          onClick={handleAvatarUpload}
                          disabled={uploadAvatarMutation.isPending}
                        >
                          {uploadAvatarMutation.isPending ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                          ) : (
                            <Camera className="mr-2 size-4" />
                          )}
                          Upload
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setAvatarFile(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <form
                  className="space-y-4 max-w-md"
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                >
                  <form.Field name="name">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          Display Name
                        </FieldLabel>
                        <Input
                          id={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Your name"
                        />
                        {field.state.meta.errors.length > 0 && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )}
                  </form.Field>
                  <Button
                    type="submit"
                    disabled={
                      updateProfileMutation.isPending || !form.state.canSubmit
                    }
                  >
                    {updateProfileMutation.isPending && (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your account security and active sessions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">Logout from other devices</h3>
                    <p className="text-sm text-muted-foreground">
                      This will invalidate all other active sessions except for
                      this one.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => logoutOtherDevicesMutation.mutate()}
                    disabled={logoutOtherDevicesMutation.isPending}
                  >
                    {logoutOtherDevicesMutation.isPending ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <LogOut className="mr-2 size-4" />
                    )}
                    Logout Other Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </main>
    </div>
  );
}
