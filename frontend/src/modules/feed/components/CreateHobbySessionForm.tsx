import { useMemo } from 'react';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TriangleAlert } from 'lucide-react';
import { feedQueryKeys } from '../model/query-keys';
import CreateHobbySessionFormSchema from './CreateHobbySessionFormSchema';
import type { GetHobbySessionById200Response } from '@/api';
import { apiHttpClient, hobbyApiClient } from '@/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemMedia } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentUser } from '@/modules/auth/current-user/CurrentUserContext';
import { formatDateTimeLocal } from '@/lib/formatDateTimeLocal';

const getDefaultValues = () => {
  const start = new Date();
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  return {
    hobbyId: '',
    startTime: formatDateTimeLocal(start),
    endTime: formatDateTimeLocal(end),
    notes: '',
    images: [] as File[],
  };
};

type CreateHobbySessionFormValues = ReturnType<typeof getDefaultValues>;

export default function CreateHobbySessionForm() {
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();

  const myHobbiesQuery = useQuery({
    queryKey: feedQueryKeys.myHobbies(currentUser?.id ?? 'unknown'),
    enabled: !!currentUser?.id,
    queryFn: async () => {
      const response = await hobbyApiClient.getHobbyUserByUserId({
        userId: currentUser?.id ?? null,
      });

      return response.data;
    },
  });

  const createSessionMutation = useMutation({
    mutationKey: ['create-hobby-session'],
    mutationFn: async (value: CreateHobbySessionFormValues) => {
      const response =
        await apiHttpClient.postForm<GetHobbySessionById200Response>(
          '/hobby-session',
          value,
        );

      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: feedQueryKeys.all }),
      ]);
    },
  });

  const defaultValues = useMemo(() => getDefaultValues(), []);

  const form = useForm({
    defaultValues,
    validators: {
      onChangeAsync: CreateHobbySessionFormSchema,
      onChangeAsyncDebounceMs: 300,
    },
    onSubmit: async ({ value }) => {
      await createSessionMutation.mutateAsync(value);
      form.reset(getDefaultValues());
    },
  });

  const hobbies = myHobbiesQuery.data ?? [];
  const hasHobbies = hobbies.length > 0;
  const isSubmitting = createSessionMutation.isPending;

  return (
    <Card className="border-border/70 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 dark:bg-background/60">
      <CardHeader>
        <CardTitle>Create hobby session</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <form.Field name="hobbyId">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Hobby</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value ?? '')}
                      disabled={myHobbiesQuery.isLoading || !hasHobbies}
                    >
                      <SelectTrigger id={field.name} className="w-full">
                        <SelectValue
                          placeholder={
                            myHobbiesQuery.isLoading
                              ? 'Loading hobbies...'
                              : hasHobbies
                                ? 'Select a hobby'
                                : 'No hobbies in profile'
                          }
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {hobbies.map((hobby) => (
                          <SelectItem
                            key={hobby.id ?? ''}
                            value={hobby.id ?? ''}
                          >
                            {hobby.name ?? 'Unnamed hobby'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="startTime">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Start time</FieldLabel>
                    <Input
                      id={field.name}
                      type="datetime-local"
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
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

            <form.Field name="endTime">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>End time</FieldLabel>
                    <Input
                      id={field.name}
                      type="datetime-local"
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
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
          </div>

          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <form.Field name="notes">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Notes</FieldLabel>
                    <Textarea
                      id={field.name}
                      placeholder="How did your session go?"
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                      className="max-h-60"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="images">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid} className="gap-2">
                    <FieldLabel htmlFor={field.name}>Images</FieldLabel>
                    <Input
                      id={field.name}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => {
                        const files = Array.from(event.target.files ?? []);
                        field.handleChange(files);
                      }}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                    <Label className="text-xs text-muted-foreground font-normal">
                      Up to 4 images
                    </Label>
                    {field.state.value.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Selected:{' '}
                        {field.state.value.map((file) => file.name).join(', ')}
                      </p>
                    )}
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>

          {!hasHobbies && !myHobbiesQuery.isLoading && (
            <Item className="bg-muted/60 border border-border/60 px-4 py-3 text-sm text-muted-foreground rounded-md dark:bg-muted/20">
              <ItemContent>
                Add at least one hobby to your profile before creating a
                session.
              </ItemContent>
            </Item>
          )}

          {createSessionMutation.error && (
            <Item className="bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-foreground rounded-md dark:bg-destructive/5 dark:border-destructive/20">
              <ItemMedia variant="icon">
                <TriangleAlert className="h-4 w-4" />
              </ItemMedia>
              <ItemContent>{createSessionMutation.error.stack}</ItemContent>
            </Item>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || myHobbiesQuery.isLoading || !hasHobbies}
            >
              {isSubmitting ? 'Creating session…' : 'Create session'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
