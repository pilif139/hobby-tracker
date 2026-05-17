package com.filip.hobbytracker;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.filip.hobbytracker.api.ApiProvider;
import com.filip.hobbytracker.repository.AuthRepository;
import com.filip.hobbytracker.repository.Resource;
import com.google.android.material.textfield.TextInputEditText;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends AppCompatActivity {

    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private AuthRepository authRepository;

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

        authRepository = new AuthRepository(this, executor);

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

        authRepository.login(email, password, result -> {
            runOnUiThread(() -> {
                if (result.status == Resource.Status.LOADING) {
                    setLoading(true);
                } else if (result.status == Resource.Status.SUCCESS) {
                    setLoading(false);
                    startActivity(new Intent(this, HomeActivity.class));
                    finish();
                } else if (result.status == Resource.Status.ERROR) {
                    setLoading(false);
                    showError(result.message != null ? result.message : getString(R.string.error_login_failed));
                }
            });
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