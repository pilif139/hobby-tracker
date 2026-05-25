# Feed Route Plan

## 0) Branch

- Working branch: `frontend/feed`

## 1) Backend research findings (what feed should include)

### Feed + Suggestions

- `GET /feed?limit&cursor`
  - Returns paginated sessions from **users I follow**.
  - Response: `{ sessions: FeedSession[], nextCursor }`
- `GET /feed/follow-suggestions/hobby?limit`
  - Users suggested based on shared hobbies.
- `GET /feed/follow-suggestions/social?limit`
  - Users suggested from mutual social graph.
- `GET /feed/hobby-suggestions?limit&period=week|month`
  - Trending hobbies the current user has not joined.

### Hobby sessions (for "create new session" + "my sessions")

- `POST /hobby-session` (multipart/form-data)
  - fields: `hobbyId`, `startTime`, `endTime`, `notes?`, `images?[]` (max 4)
- `GET /hobby-session/user/:userId?limit&offset&from&to`
  - Returns current user sessions + stats bundle.

### Hobby data

- `GET /hobby/user/:userId`
  - Needed for hobby picker in create-session form.
- `POST /hobby/add-to-profile/:hobbyId`
  - Needed for "Suggested hobbies" action.

### Follow actions

- `POST /follow` and `DELETE /follow`
  - Used for follow/unfollow actions from suggestion cards.

### Important integration status

- Backend follow route is mounted and frontend generated client includes
  `/feed`, `/hobby-session`, and `/follow` endpoints.
- Feed foundation and API regeneration are completed in Phase 1.

---

## 2) Feed architecture (main task)

## Route strategy

- Add: `frontend/src/routes/feed/index.tsx` (protected with `requireAuth`).
- Keep `/` for now, then optionally redirect `/` -> `/feed` in a follow-up cleanup.

## Module structure

```text
frontend/src/modules/feed/
  page/FeedPage.tsx
  api/
    feed.queries.ts
    hobby-session.mutations.ts
    suggestions.queries.ts
  components/
    FeedList.tsx
    FeedSessionCard.tsx
    SuggestionsSidebar.tsx
    CreateHobbySessionForm.tsx
    EmptyStates.tsx
  hooks/
    useFeedInfinite.ts
    useSuggestions.ts
  model/
    feed.types.ts
    query-keys.ts
```

## Data architecture (TanStack Query)

- `useInfiniteQuery` for main feed (`/feed`, cursor pagination).
- `useQuery` for:
  - hobby-follow suggestions
  - social-follow suggestions
  - hobby suggestions
  - my hobbies (for sticky create form)
- `useMutation` for:
  - create hobby session (multipart FormData)
  - add hobby to profile (suggested hobbies CTA)
  - follow/unfollow
- Query invalidation policy:
  - On create session success: invalidate `feed` keys.
  - On hobby add success: invalidate `hobbySuggestions`, `myHobbies`.

## UI architecture

- Responsive 2-column feed shell:
  - **Main column**: sticky create-session form + feed list.
  - **Sidebar**: suggestions (users + hobbies).
- Clear empty states:
  - feed empty (e.g., follow users prompt)
  - no hobbies yet (prompt to add hobby)
  - no sessions yet (prompt to create first session)

---

## 3) Shadcn components to add

Current UI set is minimal. For feed UX, add:

- `avatar` (user suggestions/feed cards)
- `textarea` (session notes)
- `tabs` (switch suggestion sections or my sessions filters)
- `scroll-area` (sidebar lists)
- `skeleton` (loading states)
- `badge` (hobby/session metadata)
- `select` (hobby picker)
- `popover` + `calendar` (date filters for my sessions)
- `toast` or `sonner` integration (success/error feedback)

---

## 4) Delivery phases

### Phase 1 — Foundation (main architecture, owned by me) ✅

1. Regenerated frontend API client to include feed/session/follow routes.
2. Added missing shadcn components.
3. Created `/feed` route and `FeedPage` shell layout.
4. Added scaffold components in layout (`FeedList`, `SuggestionsSidebar`, `CreateHobbySessionForm`).
5. Defined shared query keys + feed types.

### Phase 2 — Subagent A (Create Session)

- Build `CreateHobbySessionForm` (sticky header form):
  - form validation
  - hobby selector from `/hobby/user/:userId`
  - image upload (max 4)
  - submit multipart session creation
  - mutation success/error UX

### Phase 3 — Subagent B (Suggestions)

- Build `SuggestionsSidebar`:
  - hobby-based follow suggestions
  - social-based follow suggestions
  - hobby suggestions with add-to-profile action
  - fallback behavior if follow endpoint is still unavailable

### Phase 4 — Subagent C (Feed)

- Build `FeedList` with infinite scroll + session cards.
- `MySessionsPanel` is moved to user profile scope (separate profile workstream).

### Phase 5 — Testing + polish

- Unit tests:
  - feed page renders sections
  - create-session mutation wiring
  - suggestions queries and action handlers
  - feed infinite query behavior (basic)
- Accessibility + loading/error state pass.

---

## 5) Risks / blockers

- **Multipart upload tests:** will need targeted mocking for `FormData` and file inputs.

---

## 6) Definition of done (for full feature)

- `/feed` route implemented and protected.
- User can create a hobby session from feed.
- Sticky create-session form works from feed main column.
- User can view follow + hobby suggestions.
- User can act on hobby suggestions (add to profile).
- Follow action enabled if backend `/follow` route is exposed.
- Unit tests added and passing for feed core flows.
