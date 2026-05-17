package com.filip.hobbytracker;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.filip.hobbytracker.repository.AuthRepository;
import com.filip.hobbytracker.repository.BaseRepository;
import com.filip.hobbytracker.repository.Resource;
import com.google.android.material.textfield.TextInputEditText;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class LoginFragment extends Fragment {

    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private AuthRepository authRepository;

    private TextInputEditText emailInput;
    private TextInputEditText passwordInput;
    private TextView errorText;
    private ProgressBar loginProgress;
    private Button loginButton;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_login, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        emailInput = view.findViewById(R.id.emailInput);
        passwordInput = view.findViewById(R.id.passwordInput);
        errorText = view.findViewById(R.id.errorText);
        loginProgress = view.findViewById(R.id.loginProgress);
        loginButton = view.findViewById(R.id.loginButton);

        authRepository = new AuthRepository(requireContext(), executor);

        loginButton.setOnClickListener(v -> login());
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
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
            if (getActivity() == null) return;
            
            getActivity().runOnUiThread(() -> {
                if (result.status == Resource.Status.LOADING) {
                    setLoading(true);
                } else if (result.status == Resource.Status.SUCCESS) {
                    setLoading(false);
                    // Navigate to HomeFragment
                    requireActivity().getSupportFragmentManager().beginTransaction()
                            .replace(R.id.fragment_container, new HomeFragment())
                            .commit();
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