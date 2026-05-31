import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, TriangleAlert } from 'lucide-react';
import { feedQueryKeys } from '../model/query-keys';
import CreateHobbySessionFormSchema from './CreateHobbySessionFormSchema';
import type {
  CreateHobbyRequest,
  HobbyItem,
  HobbySearchResult,
  HobbySession,
} from '../model/feed.types';
import { apiHttpClient, hobbyApiClient } from '@/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemMedia } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatDateTimeLocal } from '@/lib/formatDateTimeLocal';

const getDefaultValues = () => {
  const start = new Date();
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  return {
    hobbyId: '',
    startTime: formatDateTimeLocal(start),
    endTime: formatDateTimeLocal(end),
    notes: '',
    images: [] as Array<File>,
  };
};

type CreateHobbySessionFormValues = ReturnType<typeof getDefaultValues>;

export default function CreateHobbySessionForm() {
  const queryClient = useQueryClient();

  const [hobbyInput, setHobbyInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedHobbyName, setSelectedHobbyName] = useState('');
  const hobbySearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(hobbyInput), 400);
    return () => clearTimeout(timer);
  }, [hobbyInput]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        hobbySearchRef.current &&
        !hobbySearchRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [searchResults, setSearchResults] = useState<Array<HobbySearchResult>>(
    [],
  );
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    hobbyApiClient
      .getHobby({ search: debouncedSearch })
      .then((res) => {
        setSearchResults(res.data);
      })
      .catch(() => setSearchResults([]))
      .finally(() => setIsSearching(false));
  }, [debouncedSearch]);

  const createHobbyMutation = useMutation({
    mutationKey: ['create-hobby'],
    mutationFn: async (req: CreateHobbyRequest) => {
      const res = await hobbyApiClient.postHobby({ postHobbyRequest: req });
      await hobbyApiClient.postHobbyAddToProfileByHobbyId({
        hobbyId: res.data.id,
      });
      return res.data;
    },
  });

  const createSessionMutation = useMutation({
    mutationKey: ['create-hobby-session'],
    mutationFn: async (value: CreateHobbySessionFormValues) => {
      const formData = new FormData();
      formData.append('hobbyId', value.hobbyId);
      formData.append('startTime', value.startTime);
      formData.append('endTime', value.endTime);
      if (value.notes.trim()) formData.append('notes', value.notes);
      value.images.forEach((file) => formData.append('images', file));

      const response = await apiHttpClient.post<HobbySession>(
        '/hobby-session',
        formData,
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

                const handleSelect = (hobby: HobbySearchResult | HobbyItem) => {
                  field.handleChange(hobby.id ?? '');
                  setSelectedHobbyName(hobby.name ?? '');
                  setHobbyInput(hobby.name ?? '');
                  setSearchOpen(false);
                };

                const handleCreate = async () => {
                  const name = hobbyInput.trim();
                  if (!name) return;
                  const newHobby = await createHobbyMutation.mutateAsync({
                    name,
                  });
                  handleSelect(newHobby);
                };

                const showDropdown = searchOpen && hobbyInput.trim().length > 0;
                const normalizedInput = hobbyInput.trim().toLowerCase();
                const hasExactMatch = searchResults.some(
                  (h) =>
                    (h.name ?? '').trim().toLowerCase() === normalizedInput,
                );

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Hobby</FieldLabel>
                    <div ref={hobbySearchRef} className="relative">
                      <Input
                        id={field.name}
                        autoComplete="off"
                        placeholder="Search or create a hobby…"
                        value={hobbyInput}
                        onFocus={() => setSearchOpen(true)}
                        onChange={(e) => {
                          setHobbyInput(e.target.value);
                          setSearchOpen(true);
                          if (
                            selectedHobbyName &&
                            e.target.value !== selectedHobbyName
                          ) {
                            field.handleChange('');
                            setSelectedHobbyName('');
                          }
                        }}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                      />
                      {showDropdown && (
                        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md">
                          {isSearching && (
                            <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Searching…
                            </div>
                          )}
                          {!isSearching &&
                            searchResults.map((hobby) => (
                              <button
                                key={hobby.id}
                                type="button"
                                className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleSelect(hobby)}
                              >
                                {hobby.name}
                              </button>
                            ))}
                          {hobbyInput.trim() && !hasExactMatch && (
                            <button
                              type="button"
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={handleCreate}
                              disabled={createHobbyMutation.isPending}
                            >
                              {createHobbyMutation.isPending ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Plus className="h-3 w-3" />
                              )}
                              Create &ldquo;{hobbyInput.trim()}&rdquo;
                            </button>
                          )}
                        </div>
                      )}
                    </div>
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

          {createSessionMutation.error && (
            <Item className="bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-foreground rounded-md dark:bg-destructive/5 dark:border-destructive/20">
              <ItemMedia variant="icon">
                <TriangleAlert className="h-4 w-4" />
              </ItemMedia>
              <ItemContent>
                <strong>Error:</strong> {createSessionMutation.error.message}
              </ItemContent>
            </Item>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating session…' : 'Create session'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
