# Frontend

## Uruchomienie

- Zainstaluj zależności:

```bash
pnpm install
```

- Uruchom aplikację:

```bash
pnpm dev
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

Komunikacja z backendem odbywa się za pomocą wygenerowanego klienta OpenAPI, który znajduje się w `src/api/generated`. W `src/api/index.ts` tworzymy instancję tego klienta i eksportujemy ją, aby można było jej używać w całej aplikacji. Aby wygenerować klienta, należy mieć zainstalowaną javę i uruchomić komendę:

```bash
pnpm run generate:api
```

Zimportowany klient API powinien mieć wszystkie potrzebne metody, które są w danym kontrolerze na backendzie.
