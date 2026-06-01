# Hobby tracker

Projekt z programowania aplikacji webowych i mobilnych

## Dla całego projektu

- pnpm jako package manager
- typescript
- prettier
- eslint

## Frontend

- runtime: node
- react
- testy: vitest, react-testing-library
- tanstack router
- tanstack query
- tailwindcss
- [Szczegóły techniczne i architektura](./FRONTEND.md)

## Backend

- framework: hono
- testy: vitest
- baza danych: cloudflare D1 z prismaORM
- deployment i runtime: cloudflare workers
- nauka integracji z serwisami cloudflare'a: D1, KV, Workers itp. co bedzie potrzebne do dalszego rozwoju projektu i zdobycia doświadczenia w pracy z tymi technologiami
- [Szczegóły techniczne i architektura](./BACKEND.MD)

## Mobilki

- java (zamiast kotlina, żeby poćwiczyć na egzamin zawodowy)
- [Szczegóły techniczne i architektura](./MOBILE.MD)

## Pomysł

- Aplikacja, gdzie można dzielić się swoimi hobby i przeżyciami
- Coś podobnego do twittera
- Każdy użytkownik może tworzyć hobby i dodawać hobby stworzone przez innych do swojego profilu
- Każdy może naliczać sobie tzw. sesje hobby, po prostu mierzenie czasu ile się spędziło na danym hobby
- Do każdej sesji hobby, użytkownik dodaje czas, jakieś opcjonalne notatki, myśli lub zdjęcia jeśli chce
- Można dodawać się do znajomych, przez co później widzi się co zrobili twoi znajomi na głównymi feedzie aplikacji (jak na twitterze lub facebooku)
