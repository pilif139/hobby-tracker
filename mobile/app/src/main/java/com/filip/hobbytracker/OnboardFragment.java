package com.filip.hobbytracker;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class OnboardFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_onboard, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        view.findViewById(R.id.btnExistingUser).setOnClickListener(v -> {
            ((MainActivity) requireActivity()).switchFragment(new LoginFragment(), true);
        });

        view.findViewById(R.id.btnNewUser).setOnClickListener(v -> {
            ((MainActivity) requireActivity()).switchFragment(new RegisterFragment(), true);
        });
    }
}