import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { GetFeed200ResponseSessionsInner } from '@/api/generated';
import { FeedSessionCard } from '@/modules/feed/components/FeedSessionCard';

describe('FeedSessionCard', () => {
  const baseSession: GetFeed200ResponseSessionsInner = {
    id: 'sess1',
    user: { id: 'u1', name: 'Alice', avatarUrl: '' },
    hobby: { id: 'h1', name: 'Chess' },
    startTime: null,
    endTime: null,
    notes: '',
    imageUrls: [],
    createdAt: null,
  };

  it('renders basic info', () => {
    render(<FeedSessionCard session={baseSession} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Chess')).toBeInTheDocument();
  });

  it('renders notes and images when provided', () => {
    const session = {
      ...baseSession,
      notes: 'Nice',
      imageUrls: ['https://example.com/1.png', 'https://example.com/2.png'],
    };

    render(<FeedSessionCard session={session} />);
    expect(screen.getByText('Nice')).toBeInTheDocument();
    const images = screen.getAllByRole('img');
    expect(images.length).toBe(2);
    expect(images[0]).toHaveAttribute('src', 'https://example.com/1.png');
    expect(images[1]).toHaveAttribute('src', 'https://example.com/2.png');
  });
});
