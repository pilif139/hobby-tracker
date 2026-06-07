# Hobby Tracker Mobile

Aplikacja Hobby Tracker na Androida napisana w języku Java - zamysł aplikacji taki sam jak wersji webowej.

## Środowisko i Wymagania

- **Język:** Java 17
- **Minimum Android SDK:** 29
- **Zalecany Emulator:** Medium Phone API 36

## Architektura

Projekt wykorzystuje **Repository Pattern**, aby oddzielić warstwę interfejsu (Fragments) od źródła danych (wygenerowany klient API).

- **Modułowość:**
    - `com.filip.hobbytracker`: Komponenty interfejsu (Fragmenty, Adaptery, Aktywności).
    - `com.filip.hobbytracker.repository`: Warstwa danych, abstrahująca wywołania API i zarządzająca wątkami w tle przy użyciu `ExecutorService`.
    - `com.filip.hobbytracker.data`: Warstwa lokalnej bazy danych oraz menedżerów synchronizacji (WorkManager).
    - `com.filip.hobbytracker.api`: Moduły pomocnicze, m.in. dostawcy API i obsługa sesji.
    - `com.filip.hobbytracker.api.generated`: Kod wygenerowany na podstawie specyfikacji OpenAPI backendu.
    - `com.filip.hobbytracker.lib`: Klasy pomocnicze.
- **UI:** XML Layouts i Material Components.
- **Listy:** Implementacja `RecyclerView` dla wydajnego wyświetlania danych.

## Przepływ aplikacji

Aplikacja opiera się na nawigacji między fragmentami:
`OnboardFragment` -> `LoginFragment` lub `RegisterFragment` -> `FeedFragment` (główny ekran) <-> `DiscoveryFragment`.

### Opis fragmentów
- **OnboardFragment**: Ekran powitalny wprowadzający użytkownika w funkcje aplikacji.
- **LoginFragment**: Formularz logowania dla istniejących użytkowników.
- **RegisterFragment**: Formularz rejestracji dla nowych użytkowników.
- **FeedFragment**: Główny ekran wyświetlający listę sesji hobby.
- DiscoveryFragment: Ekran umożliwiający przeglądanie sugestii dotyczących ludzi oraz hobby, którymi użytkownik może się zainteresować.
- DashboardFragment: Główny panel użytkownika z podsumowaniem statystyk i aktywności.
- SettingsFragment: Ekran ustawień, na którym użytkownik może:
    - zmienić zdjęcie profilowe,
    - zmienić nazwę użytkownika,
    - włączyć/wyłączyć tryb ciemny,
    - wylogować się z aplikacji.

## Lokalna Baza Danych (Room)

Projekt wykorzystuje bibliotekę Room do lokalnego przechowywania danych (SQLite), co umożliwia pracę w trybie offline i synchronizację.

### Tabela `user_cache`
| Nazwa pola | Typ | Opis |
| :--- | :--- | :--- |
| `id` | UUID | Identyfikator użytkownika (Primary Key) |
| `name` | String | Nazwa użytkownika |
| `email` | String | Adres email |

### Tabela `hobby_sessions`
| Nazwa pola | Typ | Opis |
| :--- | :--- | :--- |
| `localId` | long | Lokalny identyfikator (Primary Key) |
| `remoteId` | String | Identyfikator z backendu |
| `hobbyId` | String | Powiązanie z hobby |
| `userId` | String | Powiązanie z użytkownikiem |
| `startTime` | String | Czas rozpoczęcia |
| `endTime` | String | Czas zakończenia |
| `notes` | String | Notatki |
| `imageUrlsJson`| String | Obrazy w formacie JSON |
| `syncStatus` | String | Status synchronizacji: `SYNCED` (zsynchronizowane), `PENDING_CREATE` (oczekuje na utworzenie), `PENDING_UPDATE` (oczekuje na aktualizację), `PENDING_DELETE` (oczekuje na usunięcie) |
| `createdAt` | String | Data utworzenia |
| `updatedAt` | String | Data aktualizacji |

## Generowanie klienta API

Projekt używa `openapi-generator`, aby zsynchronizować się z backendem. Upewnij się, że backend działa lokalnie pod adresem `http://localhost:8787` przed generowaniem.

```bash
openapi-generator generate -i http://localhost:8787/doc -g java --library okhttp-gson -o mobile/app/src/main/openapi-client --additional-properties invokerPackage=com.filip.hobbytracker.api.invoker,apiPackage=com.filip.hobbytracker.api.generated.api,modelPackage=com.filip.hobbytracker.api.generated.model,dateLibrary=java8,hideGenerationTimestamp=true,useRuntimeException=true --skip-validate-spec
```
