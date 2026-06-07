import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { GetFeed200ResponseSessionsInner } from '@/api/generated';
import { FeedSessionCard } from '@/modules/feed/components/FeedSessionCard';

vi.mock('@/modules/auth/current-user/CurrentUserContext', () => ({
  useCurrentUser: () => ({
    currentUser: { id: 'u1', name: 'Alice', email: 'alice@example.com' },
    isAuthenticated: true,
  }),
}));

// mock useNavigate from @tanstack/react-router since it might be used by components within FeedSessionCard
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

describe('FeedSessionCard', () => {
  const baseSession: GetFeed200ResponseSessionsInner = {
    id: 'sess1',
    user: { id: 'u1', name: 'Alice', avatarUrl: '' },
    hobby: { id: 'h1', name: 'Chess' },
    startTime: '2026-06-07T10:00:00Z',
    endTime: '2026-06-07T11:00:00Z',
    notes: '',
    imageUrls: [],
    createdAt: '2026-06-07T12:00:00Z',
  };

  it('renders basic info', () => {
    renderWithProviders(<FeedSessionCard session={baseSession} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Chess')).toBeInTheDocument();
  });

  it('renders notes and images when provided', () => {
    const session = {
      ...baseSession,
      notes: 'Nice',
      imageUrls: ['https://example.com/1.png', 'https://example.com/2.png'],
    };

    renderWithProviders(<FeedSessionCard session={session} />);
    expect(screen.getByText('Nice')).toBeInTheDocument();
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(2);

    expect(
      images.some(
        (img) => img.getAttribute('src') === 'https://example.com/1.png',
      ),
    ).toBe(true);
    expect(
      images.some(
        (img) => img.getAttribute('src') === 'https://example.com/2.png',
      ),
    ).toBe(true);
  });
});
