# Hobby tracker backend

## Architektura projektu

- Prisma - folder z schemą prismy i migracjami prismy i bazy danych D1 - integracja z cloudflare D1: [link do docsów](https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1) - adapter prisma do D1 bierze bazę danych z folderu .wrangler/state/d1, w którym znajduje się lokalna baza sqlite. Ścieżka do tej bazy danych musi być ustawiana w pliku .env w zmiennej DATABASE_URL
