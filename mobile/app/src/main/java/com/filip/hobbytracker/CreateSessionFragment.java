package com.filip.hobbytracker;

import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.filip.hobbytracker.api.generated.model.GetHobby200ResponseInner;
import com.filip.hobbytracker.repository.HobbyRepository;
import com.filip.hobbytracker.repository.HobbySessionRepository;
import com.filip.hobbytracker.repository.Resource;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.Executors;

public class CreateSessionFragment extends Fragment {

    public static final String RESULT_KEY = "session_created";

    private HobbyRepository hobbyRepository;
    private HobbySessionRepository sessionRepository;

    private AutoCompleteTextView actvHobby;
    private EditText etStartTime;
    private EditText etEndTime;
    private EditText etNotes;
    private Button btnPickImages;
    private TextView tvSelectedImages;
    private TextView tvCreateSessionError;
    private Button btnCreateSession;

    private String selectedHobbyId = null;
    private Calendar startCal = Calendar.getInstance();
    private Calendar endCal = Calendar.getInstance();
    private final List<Uri> selectedImageUris = new ArrayList<>();
    private List<GetHobby200ResponseInner> hobbySearchResults = new ArrayList<>();
    private ArrayAdapter<String> hobbyDropdownAdapter;
    private final Handler debounceHandler = new Handler(Looper.getMainLooper());
    private Runnable debounceRunnable;

    private final SimpleDateFormat dtFormat =
            new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault());
    private final SimpleDateFormat isoFormat =
            new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);

    private ActivityResultLauncher<Intent> imagePickerLauncher;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        imagePickerLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == android.app.Activity.RESULT_OK && result.getData() != null) {
                        selectedImageUris.clear();
                        if (result.getData().getClipData() != null) {
                            int count = Math.min(result.getData().getClipData().getItemCount(), 4);
                            for (int i = 0; i < count; i++) {
                                selectedImageUris.add(result.getData().getClipData().getItemAt(i).getUri());
                            }
                        } else if (result.getData().getData() != null) {
                            selectedImageUris.add(result.getData().getData());
                        }
                        updateSelectedImagesLabel();
                    }
                }
        );
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_create_session, container, false);

        var executor = Executors.newSingleThreadExecutor();
        hobbyRepository = new HobbyRepository(requireContext(), executor);
        sessionRepository = new HobbySessionRepository(requireContext(), executor);

        actvHobby = view.findViewById(R.id.actvHobby);
        etStartTime = view.findViewById(R.id.etStartTime);
        etEndTime = view.findViewById(R.id.etEndTime);
        etNotes = view.findViewById(R.id.etNotes);
        btnPickImages = view.findViewById(R.id.btnPickImages);
        tvSelectedImages = view.findViewById(R.id.tvSelectedImages);
        tvCreateSessionError = view.findViewById(R.id.tvCreateSessionError);
        btnCreateSession = view.findViewById(R.id.btnCreateSession);

        setupForm();

        return view;
    }

    private void setupForm() {
        endCal.add(Calendar.HOUR_OF_DAY, 1);
        etStartTime.setText(dtFormat.format(startCal.getTime()));
        etEndTime.setText(dtFormat.format(endCal.getTime()));

        hobbyDropdownAdapter = new ArrayAdapter<>(requireContext(),
                android.R.layout.simple_dropdown_item_1line, new ArrayList<>());
        actvHobby.setAdapter(hobbyDropdownAdapter);

        actvHobby.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {
                selectedHobbyId = null;
            }
            @Override public void afterTextChanged(Editable s) {
                if (debounceRunnable != null) debounceHandler.removeCallbacks(debounceRunnable);
                String query = s.toString().trim();
                if (query.isEmpty()) {
                    hobbySearchResults.clear();
                    hobbyDropdownAdapter.clear();
                    return;
                }
                debounceRunnable = () -> searchHobbies(query);
                debounceHandler.postDelayed(debounceRunnable, 400);
            }
        });

        actvHobby.setOnItemClickListener((parent, v, position, id) -> {
            if (position < hobbySearchResults.size()) {
                selectedHobbyId = hobbySearchResults.get(position).getId();
            }
        });

        etStartTime.setOnClickListener(v -> showDateTimePicker(startCal, etStartTime));
        etEndTime.setOnClickListener(v -> showDateTimePicker(endCal, etEndTime));

        btnPickImages.setOnClickListener(v -> {
            Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
            intent.setType("image/*");
            intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
            imagePickerLauncher.launch(Intent.createChooser(intent, "Select images"));
        });

        btnCreateSession.setOnClickListener(v -> submitForm());
    }

    private void searchHobbies(String query) {
        hobbyRepository.searchHobbies(query, resource -> requireActivity().runOnUiThread(() -> {
            if (resource.status == Resource.Status.SUCCESS && resource.data != null) {
                hobbySearchResults = resource.data;
                hobbyDropdownAdapter.clear();
                for (GetHobby200ResponseInner h : resource.data) {
                    hobbyDropdownAdapter.add(h.getName());
                }
                hobbyDropdownAdapter.notifyDataSetChanged();
                actvHobby.showDropDown();
            }
        }));
    }

    private void showDateTimePicker(Calendar cal, EditText target) {
        new DatePickerDialog(requireContext(), (dpView, year, month, day) -> {
            cal.set(Calendar.YEAR, year);
            cal.set(Calendar.MONTH, month);
            cal.set(Calendar.DAY_OF_MONTH, day);
            new TimePickerDialog(requireContext(), (tpView, hour, minute) -> {
                cal.set(Calendar.HOUR_OF_DAY, hour);
                cal.set(Calendar.MINUTE, minute);
                cal.set(Calendar.SECOND, 0);
                cal.set(Calendar.MILLISECOND, 0);
                target.setText(dtFormat.format(cal.getTime()));
            }, cal.get(Calendar.HOUR_OF_DAY), cal.get(Calendar.MINUTE), true).show();
        }, cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal.get(Calendar.DAY_OF_MONTH)).show();
    }

    private void updateSelectedImagesLabel() {
        if (selectedImageUris.isEmpty()) {
            tvSelectedImages.setVisibility(View.GONE);
        } else {
            tvSelectedImages.setVisibility(View.VISIBLE);
            tvSelectedImages.setText(selectedImageUris.size() + " image(s) selected");
        }
    }

    private void submitForm() {
        tvCreateSessionError.setVisibility(View.GONE);

        String hobbyInput = actvHobby.getText().toString().trim();

        if (hobbyInput.isEmpty()) {
            showFormError(getString(R.string.error_select_hobby));
            return;
        }
        if (etStartTime.getText().toString().isEmpty()) {
            showFormError(getString(R.string.error_select_start));
            return;
        }
        if (etEndTime.getText().toString().isEmpty()) {
            showFormError(getString(R.string.error_select_end));
            return;
        }

        String startIso = isoFormat.format(startCal.getTime());
        String endIso = isoFormat.format(endCal.getTime());
        String notes = etNotes.getText().toString().trim();

        btnCreateSession.setEnabled(false);

        if (selectedHobbyId != null) {
            createSession(selectedHobbyId, startIso, endIso, notes);
        } else {
            GetHobby200ResponseInner match = null;
            for (GetHobby200ResponseInner h : hobbySearchResults) {
                if (hobbyInput.equalsIgnoreCase(h.getName())) {
                    match = h;
                    break;
                }
            }
            if (match != null) {
                createSession(match.getId(), startIso, endIso, notes);
            } else {
                hobbyRepository.createHobby(hobbyInput, resource -> requireActivity().runOnUiThread(() -> {
                    if (resource.status == Resource.Status.SUCCESS && resource.data != null) {
                        createSession(resource.data.getId(), startIso, endIso, notes);
                    } else {
                        btnCreateSession.setEnabled(true);
                        showFormError(resource.message != null ? resource.message : getString(R.string.error_network));
                    }
                }));
            }
        }
    }

    private void createSession(String hobbyId, String startIso, String endIso, String notes) {
        sessionRepository.createSession(hobbyId, startIso, endIso,
                notes.isEmpty() ? null : notes, null,
                resource -> requireActivity().runOnUiThread(() -> {
                    btnCreateSession.setEnabled(true);
                    if (resource.status == Resource.Status.SUCCESS) {
                        Toast.makeText(getContext(), R.string.session_created, Toast.LENGTH_SHORT).show();
                        resetForm();
                        getParentFragmentManager().setFragmentResult(RESULT_KEY, new Bundle());
                    } else {
                        showFormError(resource.message != null ? resource.message : getString(R.string.error_network));
                    }
                }));
    }

    private void showFormError(String msg) {
        tvCreateSessionError.setText(msg);
        tvCreateSessionError.setVisibility(View.VISIBLE);
    }

    private void resetForm() {
        actvHobby.setText("");
        selectedHobbyId = null;
        hobbySearchResults.clear();
        startCal = Calendar.getInstance();
        endCal = Calendar.getInstance();
        endCal.add(Calendar.HOUR_OF_DAY, 1);
        etStartTime.setText(dtFormat.format(startCal.getTime()));
        etEndTime.setText(dtFormat.format(endCal.getTime()));
        etNotes.setText("");
        selectedImageUris.clear();
        tvSelectedImages.setVisibility(View.GONE);
        tvCreateSessionError.setVisibility(View.GONE);
    }
}
