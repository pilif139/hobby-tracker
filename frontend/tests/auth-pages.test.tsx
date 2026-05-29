import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AnchorHTMLAttributes, ReactElement, ReactNode } from 'react';
import { authApiClient } from '@/api';
import LoginPage from '@/modules/auth/login/LoginPage';
import RegisterPage from '@/modules/auth/register/RegisterPage';

const mockNavigate = vi.fn();
const mockSetCurrentUser = vi.fn();

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({
      children,
      to,
      ...props
    }: {
      children: ReactNode;
      to: string;
    } & AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

vi.mock('@/modules/auth/current-user/CurrentUserContext', () => ({
  useCurrentUser: () => ({
    currentUser: null,
    isAuthenticated: false,
    setCurrentUser: mockSetCurrentUser,
  }),
}));

const renderWithQueryClient = (ui: ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

describe('Auth pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login page fields and register link', () => {
    renderWithQueryClient(<LoginPage />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute(
      'href',
      '/register',
    );
  });

  it('submits login form to backend', async () => {
    const user = userEvent.setup();
    const loggedInUser = {
      id: 'user-1',
      email: 'jane@example.com',
      name: 'Jane',
    };

    const loginSpy = vi
      .spyOn(authApiClient, 'postAuthLogin')
      .mockResolvedValue({ data: loggedInUser } as never);

    renderWithQueryClient(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(loginSpy).toHaveBeenCalledWith({
        postAuthLoginRequest: {
          email: 'jane@example.com',
          password: 'password123',
        },
      });
    });

    await waitFor(() => {
      expect(mockSetCurrentUser).toHaveBeenCalledWith(loggedInUser);
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/feed' });
    });
  });

  it('renders register page fields and login link', () => {
    renderWithQueryClient(<RegisterPage />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute(
      'href',
      '/login',
    );
  });

  it('submits register form to backend', async () => {
    const user = userEvent.setup();
    const registeredUser = {
      id: 'user-2',
      email: 'john@example.com',
      name: 'John Doe',
    };

    const registerSpy = vi
      .spyOn(authApiClient, 'postAuthRegister')
      .mockResolvedValue({ data: registeredUser } as never);

    renderWithQueryClient(<RegisterPage />);

    await user.type(screen.getByLabelText('Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign up' }));

    await waitFor(() => {
      expect(registerSpy).toHaveBeenCalledWith({
        postAuthRegisterRequest: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        },
      });
    });

    await waitFor(() => {
      expect(mockSetCurrentUser).toHaveBeenCalledWith(registeredUser);
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/feed' });
    });
  });
});
