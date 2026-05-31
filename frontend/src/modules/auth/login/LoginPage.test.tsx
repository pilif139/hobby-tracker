import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import LoginPage from './LoginPage';

// Mocks we need to observe and control
const mockNavigate = vi.fn();
const mockSetCurrentUser = vi.fn();

vi.mock('@tanstack/react-router', () => {
  const React = require('react');
  return {
    Link: ({ to, ...props }: any) =>
      React.createElement('a', { href: to, ...props }),
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../current-user/CurrentUserContext', () => ({
  useCurrentUser: () => ({ setCurrentUser: mockSetCurrentUser }),
}));

vi.mock('@/api', () => ({
  authApiClient: {
    postAuthLogin: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

function renderWithQuery(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

describe('LoginPage (unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Renders email, password and submit button (basic accessibility)', async () => {
    renderWithQuery(<LoginPage />);

    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);
    const btn = screen.getByRole('button', { name: /sign in/i });

    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(btn).toBeInTheDocument();
    expect(btn).toBeEnabled();
  });

  it('Shows Sign up link', async () => {
    renderWithQuery(<LoginPage />);

    const link = screen.getByRole('link', { name: /sign up/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent(/sign up/i);
  });

  it('Renders logo image with alt text', async () => {
    renderWithQuery(<LoginPage />);

    const logo = screen.getByAltText(/logo/i);
    expect(logo).toBeInTheDocument();
  });

  it('Given valid credentials, submits and navigates (success path)', async () => {
    const { authApiClient } = await import('@/api');
    (authApiClient.postAuthLogin as any).mockResolvedValue({
      data: { id: '1', email: 'a@b.com', name: 'Alice' },
    });

    renderWithQuery(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(authApiClient.postAuthLogin).toHaveBeenCalled());

    expect(authApiClient.postAuthLogin).toHaveBeenCalledWith(
      { postAuthLoginRequest: { email: 'a@b.com', password: 'password123' } },
      expect.any(Object),
    );

    await waitFor(() => expect(mockSetCurrentUser).toHaveBeenCalled());
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith({ to: '/' }));

    const { toast } = await import('sonner');
    expect(toast.success).toHaveBeenCalledWith('Signed in');
  });

  it('Shows API error message and calls toast.error on failure', async () => {
    const { authApiClient } = await import('@/api');
    (authApiClient.postAuthLogin as any).mockRejectedValue(
      new Error('Bad credentials'),
    );

    renderWithQuery(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    const { toast } = await import('sonner');
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Bad credentials'),
    );

    // The error message should be visible in the UI
    expect(screen.getByText(/Bad credentials/)).toBeInTheDocument();
  });

  it('Disables the submit button while request is pending', async () => {
    // create a controllable promise so we can assert loading state
    let resolvePromise: (v?: any) => void = () => {};
    const pending = new Promise((res) => {
      resolvePromise = res;
    });

    const { authApiClient } = await import('@/api');
    (authApiClient.postAuthLogin as any).mockReturnValue(pending as any);

    renderWithQuery(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Button should be disabled and show busy text
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent(/Signing in/);

    // finish the request
    resolvePromise({ data: { id: '1', email: 'a@b.com' } });

    await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
  });
});
