# Aplikacja Mobilna Hobby Tracker

Aplikacja Hobby Tracker na Androida napisana w języku Java - zamysł aplikacji taki sam jak wersji webowej.

## Środowisko i Wymagania

- **Język:** Java 26 (Oracle JDK)
- **Minimum Android SDK:** 29
- **Zalecany Emulator:** Medium Phone API 36

## Architektura

Projekt wykorzystuje **Repository Pattern**, aby oddzielić warstwę interfejsu (Fragments) od źródła danych (wygenerowany klient API).

- **Modułowość:**
    - `com.filip.hobbytracker`: Komponenty interfejsu (Fragmenty, Adaptery, Aktywności).
    - `com.filip.hobbytracker.repository`: Warstwa danych, abstrakcjonująca wywołania API i zarządzająca wątkami w tle przy użyciu `ExecutorService`.
    - `com.filip.hobbytracker.api`: Moduły pomocnicze, m.in. dostawcy API i obsługa sesji.
    - `com.filip.hobbytracker.api.generated`: Kod wygenerowany na podstawie specyfikacji OpenAPI backendu.
- **UI:** XML Layouts, ConstraintLayout, Material Components.
- **Listy:** Implementacja `RecyclerView` dla wydajnego wyświetlania danych chcociażby na głównym feedzie.

## Przepływ aplikacji

Aplikacja opiera się na nawigacji między fragmentami:
`OnboardFragment` -> `LoginFragment` lub `RegisterFragment` -> `FeedFragment` (główny ekran).

## Generowanie klienta API

Projekt używa `openapi-generator`, aby zsynchronizować się z backendem. Upewnij się, że backend działa lokalnie pod adresem `http://localhost:8787` przed generowaniem.

```bash
openapi-generator generate -i http://localhost:8787/doc -g java --library okhttp-gson -o mobile/app/src/main/openapi-client --additional-properties invokerPackage=com.filip.hobbytracker.api.invoker,apiPackage=com.filip.hobbytracker.api.generated.api,modelPackage=com.filip.hobbytracker.api.generated.model,dateLibrary=java8,hideGenerationTimestamp=true,useRuntimeException=true --skip-validate-spec
```
