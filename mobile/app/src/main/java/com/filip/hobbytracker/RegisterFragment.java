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
import com.filip.hobbytracker.repository.Resource;
import com.google.android.material.textfield.TextInputEditText;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class RegisterFragment extends Fragment {

    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private AuthRepository authRepository;

    private TextInputEditText nameInput;
    private TextInputEditText emailInput;
    private TextInputEditText passwordInput;
    private TextView errorText;
    private ProgressBar registerProgress;
    private Button registerButton;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_register, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        nameInput = view.findViewById(R.id.nameInput);
        emailInput = view.findViewById(R.id.emailInput);
        passwordInput = view.findViewById(R.id.passwordInput);
        errorText = view.findViewById(R.id.errorText);
        registerProgress = view.findViewById(R.id.registerProgress);
        registerButton = view.findViewById(R.id.registerButton);

        authRepository = new AuthRepository(requireContext(), executor);

        registerButton.setOnClickListener(v -> register());
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        executor.shutdownNow();
    }

    private void register() {
        String name = String.valueOf(nameInput.getText()).trim();
        String email = String.valueOf(emailInput.getText()).trim();
        String password = String.valueOf(passwordInput.getText());

        if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
            showError(getString(R.string.error_missing_credentials));
            return;
        }

        setLoading(true);
        errorText.setText("");

        authRepository.register(name, email, password, result -> {
            if (getActivity() == null) return;

            getActivity().runOnUiThread(() -> {
                if (result.status == Resource.Status.LOADING) {
                    setLoading(true);
                } else if (result.status == Resource.Status.SUCCESS) {
                    setLoading(false);
                    ((MainActivity) requireActivity()).navigateHome(new FeedFragment());
                } else if (result.status == Resource.Status.ERROR) {
                    setLoading(false);
                    showError(result.message != null ? result.message : getString(R.string.error_registration_failed));
                }
            });
        });
    }

    private void setLoading(boolean loading) {
        registerButton.setEnabled(!loading);
        registerProgress.setVisibility(loading ? View.VISIBLE : View.GONE);
    }

    private void showError(String message) {
        errorText.setText(message);
    }
}
