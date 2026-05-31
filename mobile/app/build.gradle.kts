import java.io.ByteArrayOutputStream

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    id("com.google.devtools.ksp") version "2.1.0-1.0.29"
}

android {
    namespace = "com.filip.hobbytracker"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.filip.hobbytracker"
        minSdk = 29
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }

    sourceSets {
        getByName("main") {
            java.setSrcDirs(
                listOf(
                    "src/main/java",
                    "src/main/openapi-client/src/main/java"
                )
            )
        }
    }

    packaging {        resources {
        excludes += "/META-INF/NOTICE.md"

        excludes += "/META-INF/LICENSE.md"
    }
    }
}

dependencies {

    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.activity)
    implementation(libs.constraintlayout)
    implementation(libs.recyclerview)
    implementation(libs.okhttp)
    implementation(libs.okhttp.logging)
    implementation(libs.gson)
    implementation(libs.gsonfire)
    implementation(libs.commons.lang3)
    implementation(libs.jsr305)
    implementation(libs.jakarta.ws.rs)
    implementation(libs.jakarta.annotation)
    implementation(libs.jackson.databind.nullable)
    implementation(libs.glide)
    implementation(libs.security.crypto)
    implementation(libs.room.runtime)
    implementation(libs.room.ktx)
    implementation(libs.work.runtime)
    ksp(libs.room.compiler)
    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
}

tasks.register("generateOpenApiClient") {
    group = "openapi"
    description = "Generate Java OpenAPI client for Android from backend /doc endpoint"

    doLast {
        val output = ByteArrayOutputStream()
        exec {
            commandLine("openapi-generator", "version")
            standardOutput = output
        }

        val version = output.toString().trim()
        if (version.isBlank()) {
            throw GradleException("openapi-generator is required but not available in PATH")
        }

        exec {
            workingDir = rootDir.parentFile
            commandLine(
                "openapi-generator",
                "generate",
                "-i",
                "http://localhost:8787/doc",
                "-g",
                "java",
                "--library",
                "okhttp-gson",
                "-o",
                "mobile/app/src/main/openapi-client",
                "--additional-properties",
                "invokerPackage=com.filip.hobbytracker.api.invoker,apiPackage=com.filip.hobbytracker.api.generated.api,modelPackage=com.filip.hobbytracker.api.generated.model,dateLibrary=java8,hideGenerationTimestamp=true,useRuntimeException=true",
                "--skip-validate-spec"
            )
        }
    }
}
