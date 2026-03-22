# Hobby tracker backend

Głównym załoeniem aplikacji backendowej jest nauczenie się czegoś nowego, dlatego postanowiłem wykorzystać usługi Cloudflare tj. KV, D1 database, Workers itp..


## Technologie
- Hono framework
- Zod do walidacji danych
- Prisma jako ORM
- Cloudflare D1, KV, Workers, Images
- Własny system autentykacji i autoryzacji oparty na tokenie JWT oraz refresh tokenie przechowywanym w bardzo szybkiej bazie danych klucz-wartość Cloudflare KV
- hono-zod-openapi - służy do generowania dokumentacji OpenAPI na podstawie kodu aplikacji. Było wiele alternatyw dla tej biblioteki, którę są bardziej popularne, nawet oficjalne wsparcie dla OpenAPI w hono, ale ostatecznie padło na tę bibliotekę ze względu na jej prostotę i elastyczność, która w porównaniu do innych pozwala na szybki development.

## Architektura projektu

- src - folder z głównym kodem aplikacji
  - modules - folder z modułami aplikacji
    - kategoria_modułu - folder z modułem aplikacji
      - controllers - folder z kontrolerami modułu
      - services - folder z serwisami modułu
      - dto - folder z dto, typami danych modułu itp.
      - routes - folder z routerem danego modułu
      - repository - folder z repozytorium modułu, gdzie przeprowadzane są operacje na bazie danych
      - inne luźne pliki modułu potrzebne do jego działania
    - lib - folder z utilsami i helperami wykorzystywanymi w całej aplikacji
    - middleware - folder z middleware'ami aplikacji, duża większość z nich to po prostu wrappery na middleware z framework'a hono
    - index.ts - główny plik aplikacji, gdzie tworzona jest instancja aplikacji i dodawane są moduły
    - types.ts - plik z globalnymi typami aplikacji i typami potrzebnymi do integracji z cloudflarem
- tests - folder z testami jednostkowymi i integracyjnymi aplikacji, testy uruchamiane są przez natywny runner runtime'a bun
- prisma - folder z schemą prismy i migracjami prismy i bazy danych D1 - integracja z cloudflare D1: [link do docsów](https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1) - adapter prisma do D1 bierze bazę danych z folderu .wrangler/state/d1, w którym znajduje się lokalna baza sqlite. Ścieżka do tej bazy danych jest automatycznie ustawiania w pliku .env podczas uruchamiania aplikacji lokalnie
- wrangler.toml - plik konfiguracyjny cloudflare'a
- folder .wrangler - folder z lokalnymi danymi cloudflare'a np. lokalna baza danych D1 lub KV namespace
- worker-configuration.d.ts - plik automatycznie generowany za pomocą komendy `bunx wrangler types` (nie zmieniać go ręcznie), zawiera typy potrzebne do integracji z cloudflarem i nie trzeba go importować

## Uruchamianie aplikacji lokalnie

1. Utwórz plik .env z następującą zawartością:

```env
ACCESS_TOKEN_SECRET=sekretny_klucz_1
REFRESH_TOKEN_SECRET=sekretny_klucz_2
FRONTEND_DOMAIN=http://localhost:5173
```

Gdzie `sekretny_klucz_1` i `sekretny_klucz_2` to losowe ciągi znaków używane do generowania tokenów JWT.

Sekrety można wygenerować za pomocą komendy `openssl rand -base64 32`

2. Zainstaluj zależności:

```bash
bun install
```

3. Uruchom migracje i wygeneruj klienta prismy

```bash
bunx wrangler d1 migrations apply hobby-tracker-db --local
bunx prisma generate
```

4. Uruchom aplikację lokalnie:

```bash
bun dev
```

Aplikacja będzie dostępna pod adresem http://localhost:8787