import { useEffect, useRef, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, TriangleAlert, X } from 'lucide-react';
import { feedQueryKeys } from '../model/query-keys';
import CreateHobbySessionFormSchema from './CreateHobbySessionFormSchema';
import type {
  HobbyItem,
  HobbySearchResult,
  HobbySession,
} from '../model/feed.types';
import { apiHttpClient, hobbyApiClient } from '@/api';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemMedia } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatDateTimeLocal } from '@/lib/formatDateTimeLocal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EditHobbySessionDialogProps {
  session: {
    id: string;
    hobbyId: string;
    hobbyName: string;
    startTime: string;
    endTime: string;
    notes: string | null;
    imageUrls: Array<string>;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditHobbySessionDialog({
  session,
  open,
  onOpenChange,
}: EditHobbySessionDialogProps) {
  const queryClient = useQueryClient();

  const [hobbyInput, setHobbyInput] = useState(session.hobbyName);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedHobbyName, setSelectedHobbyName] = useState(session.hobbyName);
  const hobbySearchRef = useRef<HTMLDivElement>(null);

  const [deletedImageKeys, setDeletedImageKeys] = useState<Array<string>>([]);

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
    if (!debouncedSearch.trim() || debouncedSearch === selectedHobbyName) {
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
  }, [debouncedSearch, selectedHobbyName]);

  const createHobbyMutation = useMutation({
    mutationKey: ['create-hobby'],
    mutationFn: async (req: { name: string }) => {
      const res = await hobbyApiClient.postHobby({ postHobbyRequest: req });
      await hobbyApiClient.postHobbyAddToProfileByHobbyId({
        hobbyId: res.data.id,
      });
      return res.data;
    },
  });

  const updateSessionMutation = useMutation({
    mutationKey: ['update-hobby-session', session.id],
    mutationFn: async (value: any) => {
      const formData = new FormData();
      formData.append('hobbyId', value.hobbyId);
      formData.append('startTime', value.startTime);
      formData.append('endTime', value.endTime);
      formData.append('notes', value.notes);

      value.images.forEach((file: File) => formData.append('images', file));
      deletedImageKeys.forEach((key) =>
        formData.append('deletedImageKeys', key),
      );

      const response = await apiHttpClient.patch<HobbySession>(
        `/hobby-session/${session.id}`,
        formData,
      );

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: feedQueryKeys.all });
      onOpenChange(false);
    },
  });

  const form = useForm({
    defaultValues: {
      hobbyId: session.hobbyId,
      startTime: formatDateTimeLocal(new Date(session.startTime)),
      endTime: formatDateTimeLocal(new Date(session.endTime)),
      notes: session.notes ?? '',
      images: [] as Array<File>,
    },
    validators: {
      onChangeAsync: CreateHobbySessionFormSchema,
      onChangeAsyncDebounceMs: 300,
    },
    onSubmit: async ({ value }) => {
      await updateSessionMutation.mutateAsync(value);
    },
  });

  const isSubmitting = updateSessionMutation.isPending;

  const toggleDeleteImage = (url: string) => {
    // Extract key from URL
    const key = url.split('/').pop()?.split('?')[0];
    if (!key) return;

    setDeletedImageKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit hobby session</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4 pt-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
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
                  <Field data-invalid={isInvalid} className="sm:col-span-2">
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
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Start time</FieldLabel>
                  <Input
                    id={field.name}
                    type="datetime-local"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="endTime">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>End time</FieldLabel>
                  <Input
                    id={field.name}
                    type="datetime-local"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            </form.Field>
          </div>

          <form.Field name="notes">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Notes</FieldLabel>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="max-h-32"
                />
              </Field>
            )}
          </form.Field>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Existing Images</Label>
            <div className="flex flex-wrap gap-2">
              {session.imageUrls.map((url) => {
                const key = url.split('/').pop()?.split('?')[0];
                const isDeleted = key && deletedImageKeys.includes(key);
                return (
                  <div key={url} className="relative size-20 group">
                    <img
                      src={url}
                      alt="Session"
                      className={`size-full object-cover rounded-md transition-opacity ${isDeleted ? 'opacity-30' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => toggleDeleteImage(url)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {isDeleted ? (
                        <Plus className="size-3" />
                      ) : (
                        <X className="size-3" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <form.Field name="images">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Add new images</FieldLabel>
                <Input
                  id={field.name}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    field.handleChange(files);
                  }}
                />
              </Field>
            )}
          </form.Field>

          {updateSessionMutation.error && (
            <Item className="bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-foreground rounded-md">
              <ItemMedia variant="icon">
                <TriangleAlert className="h-4 w-4" />
              </ItemMedia>
              <ItemContent>
                <strong>Error:</strong> {updateSessionMutation.error.message}
              </ItemContent>
            </Item>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
