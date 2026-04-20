package com.filip.hobbytracker;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.filip.hobbytracker.api.ApiProvider;
import com.filip.hobbytracker.api.generated.model.PostAuthLoginRequest;
import com.filip.hobbytracker.api.invoker.ApiException;
import com.google.android.material.textfield.TextInputEditText;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends AppCompatActivity {

    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    private TextInputEditText emailInput;
    private TextInputEditText passwordInput;
    private TextView errorText;
    private ProgressBar loginProgress;
    private Button loginButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        emailInput = findViewById(R.id.emailInput);
        passwordInput = findViewById(R.id.passwordInput);
        errorText = findViewById(R.id.errorText);
        loginProgress = findViewById(R.id.loginProgress);
        loginButton = findViewById(R.id.loginButton);

        loginButton.setOnClickListener(v -> login());
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        executor.shutdownNow();
    }

    private void login() {
        String email = String.valueOf(emailInput.getText()).trim();
        String password = String.valueOf(passwordInput.getText());

        if (email.isEmpty() || password.isEmpty()) {
            showError(getString(R.string.error_missing_credentials));
            return;
        }

        setLoading(true);
        errorText.setText("");

        executor.execute(() -> {
            try {
                PostAuthLoginRequest request = new PostAuthLoginRequest()
                        .email(email)
                        .password(password);

                ApiProvider.authenticationApi().postAuthLogin(request);

                runOnUiThread(() -> {
                    setLoading(false);
                    startActivity(new Intent(this, HomeActivity.class));
                    finish();
                });
            } catch (ApiException e) {
                String errorMessage = getString(R.string.error_login_failed);
                if (e.getResponseBody() != null && !e.getResponseBody().isBlank()) {
                    errorMessage = e.getResponseBody();
                }

                String finalErrorMessage = errorMessage;
                runOnUiThread(() -> {
                    setLoading(false);
                    showError(finalErrorMessage);
                });
            } catch (Exception e) {
                runOnUiThread(() -> {
                    setLoading(false);
                    showError(getString(R.string.error_network));
                });
            }
        });
    }

    private void setLoading(boolean loading) {
        loginButton.setEnabled(!loading);
        loginProgress.setVisibility(loading ? View.VISIBLE : View.GONE);
    }

    private void showError(String message) {
        errorText.setText(message);
    }
}