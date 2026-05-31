export const feedQueryKeys = {
  all: ['feed'] as const,
  timeline: () => [...feedQueryKeys.all, 'timeline'] as const,
  mySessions: (userId: string) =>
    [...feedQueryKeys.all, 'my-sessions', userId] as const,
  suggestions: () => [...feedQueryKeys.all, 'suggestions'] as const,
  myHobbies: (userId: string) =>
    [...feedQueryKeys.all, 'my-hobbies', userId] as const,
};
