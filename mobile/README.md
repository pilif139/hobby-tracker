# Hobby Tracker Mobile

This is the mobile application for the Hobby Tracker project. It is built using Java and Android Studio. The application allows users to track their hobbies, set goals, and view statistics.

## Generating API client

```bash
openapi-generator generate -i http://localhost:8787/doc -g java --library okhttp-gson -o mobile/app/src/main/openapi-client --additional-properties=invokerPackage=com.filip.hobbytracker.api.invoker,apiPackage=com.filip.hobbytracker.api.generated.api,modelPackage=com.filip.hobbytracker.api.generated.model,dateLibrary=java8,hideGenerationTimestamp=true,useRuntimeException=true --skip-validate-spec
```
