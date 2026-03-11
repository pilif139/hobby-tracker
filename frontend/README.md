# Frontend

## Uruchomienie

- Zainstaluj zależności:

```bash
bun install
```

- Uruchom aplikację:

```bash
bun dev
```

- Otwórz przeglądarkę i przejdź do `http://localhost:5173`

## Użyte technologie

- React
- TypeScript
- Tanstack Router
- Tanstack Query
- Tailwind CSS
- Vitest
- Shadcn UI
- Cloudflare jako hosting

## Architektura

- routes - folder z plikami odpowiadającymi poszczególnym stronom aplikacji
- components - folder z komponentami wielokrotnego użytku, zawiera także folder z komponentami UI (shadcn)
- hooks - folder z customowymi hookami, np. do obsługi zapytań
- utils - folder z funkcjami pomocniczymi, używanymi w różnych miejscach aplikacji
- modules - folder, który zawiera wszystkie rzeczy związane z danym 1 routem, np. jeśli mamy route feed to w modules/feed będzie folder components z komponentami specyficznymi dla tego route, folder hooks z hookami specyficznymi dla tego route i ewentualnie inne rzeczy, które są związane tylko z tym route, jeśli strona ma np. więcej podstron, to dzielimy wtedy ten moduł na podmoduły, np. modules/feed/posts i modules/feed/comments, w zależności od tego jak duża jest ta strona

## Komunikacja z backendem

[Link do docsów](https://hono.dev/docs/guides/rpc)

Backend napisany jest w Hono, który posiada feature RPC do komunikacji z clientami. Z backendu importujemy AppType i tworzymy klienta RPC:

```typescript
const client = hc<AppType>('http://localhost:8787/', {
  init: {
    credentials: 'include',
  },
});
```

Przykładowe użycie klienta:

```typescript
const res = await apiClient.user[':id'].$get({
  param: {
    id: 'a234-1234-1234-1234-1234',
  },
});
```
