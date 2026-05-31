import { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Camera, Loader2, Settings, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import type { ChangeEvent, FormEvent } from 'react';
import type { PatchUserMeRequest } from '@/api/generated/api';
import { apiHttpClient, userApiClient } from '@/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCurrentUser } from '@/modules/auth/current-user/CurrentUserContext';
import { requireAuth } from '@/modules/auth/route-guards';

export const Route = createFileRoute('/settings/')({
  beforeLoad: requireAuth,
  component: SettingsPage,
});

function SettingsPage() {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const [name, setName] = useState(currentUser?.name ?? '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

  useEffect(() => {
    setName(currentUser?.name ?? '');
  }, [currentUser?.name]);

  useEffect(() => {
    if (!selectedAvatar) {
      setAvatarPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedAvatar);
    setAvatarPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedAvatar]);

  const displayInitials = useMemo(() => {
    const source = name.trim() || currentUser?.email || 'User';
    const parts = source.split(/\s+/).filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase();
    }

    return source.slice(0, 2).toUpperCase();
  }, [currentUser?.email, name]);

  const updateProfileMutation = useMutation({
    mutationKey: ['settings', 'profile'],
    mutationFn: async (payload: PatchUserMeRequest) => {
      const response = await userApiClient.patchUserMe({
        patchUserMeRequest: payload,
      });
      return response.data;
    },
    onSuccess: (updatedUser) => {
      setCurrentUser(updatedUser);
      setName(updatedUser.name);
      toast.success('Profile updated');
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationKey: ['settings', 'avatar'],
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiHttpClient.post<{
        message: string;
        url: string;
      }>('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    },
    onSuccess: (result) => {
      setSelectedAvatar(null);
      if (result.url) {
        setAvatarPreview(result.url);
      }
      toast.success(result.message || 'Avatar updated');
    },
  });

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName === currentUser?.name) {
      return;
    }

    void updateProfileMutation.mutateAsync({ name: trimmedName });
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = '';

    if (!file) {
      return;
    }

    setSelectedAvatar(file);
    await uploadAvatarMutation.mutateAsync(file);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:py-8">
        <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <Settings className="size-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              User settings
            </h1>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Update your display name and avatar.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Profile details</CardTitle>
              <CardDescription>
                Change the name shown across the app.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleProfileSubmit}>
                <Field className="grid gap-2">
                  <FieldLabel htmlFor="display-name">Username</FieldLabel>
                  <Input
                    id="display-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your display name"
                    maxLength={120}
                    autoComplete="nickname"
                  />
                  <FieldDescription>
                    This is the name other people will see in the feed.
                  </FieldDescription>
                  {updateProfileMutation.error && (
                    <FieldError
                      errors={[
                        {
                          message:
                            updateProfileMutation.error.message ||
                            'Failed to update profile',
                        },
                      ]}
                    />
                  )}
                </Field>

                <Separator />

                <div className="flex items-center justify-end gap-3">
                  <Button
                    type="submit"
                    disabled={
                      updateProfileMutation.isPending ||
                      !name.trim() ||
                      name.trim() === currentUser?.name
                    }
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <UserRound className="size-4" />
                        Save username
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avatar</CardTitle>
              <CardDescription>
                Upload a square image to personalize your profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed p-6 text-center">
                <Avatar className="size-20">
                  <AvatarImage
                    src={avatarPreview ?? undefined}
                    alt={currentUser?.name ?? 'User avatar'}
                  />
                  <AvatarFallback className="text-lg font-semibold">
                    {displayInitials}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="text-sm font-medium">
                    {currentUser?.name ?? 'Account'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {currentUser?.email ?? 'Signed in'}
                  </div>
                </div>

                <div className="w-full">
                  <label htmlFor="avatar-upload" className="sr-only">
                    Upload avatar
                  </label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      void handleAvatarChange(event);
                    }}
                    disabled={uploadAvatarMutation.isPending}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  JPG, PNG, or WEBP up to 5 MB.
                </p>

                {uploadAvatarMutation.isPending && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Uploading avatar…
                  </div>
                )}

                {uploadAvatarMutation.error && (
                  <FieldError
                    errors={[
                      {
                        message:
                          uploadAvatarMutation.error.message ||
                          'Failed to upload avatar',
                      },
                    ]}
                  />
                )}

                <Button
                  type="button"
                  variant="outline"
                  disabled={uploadAvatarMutation.isPending}
                  onClick={() => {
                    document.getElementById('avatar-upload')?.click();
                  }}
                >
                  <Camera className="size-4" />
                  Choose image
                </Button>
              </div>

              <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
                <div className="font-medium text-foreground">Tip</div>
                Use a centered square crop for the cleanest result in the feed.
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
