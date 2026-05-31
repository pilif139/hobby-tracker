import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi  } from 'vitest';

import Header from './header';

vi.mock('@tanstack/react-router', () => {
  const React = require('react');
  return { Link: (props: any) => React.createElement('a', props) };
});

vi.mock('@/components/user-nav', () => ({
  default: () => <div data-testid="mock-user-nav">UserNav</div>,
}));

describe('Header', () => {
  it('renders brand and subtitle and includes UserNav', () => {
    render(<Header />);

    expect(screen.getByText(/Hobby Tracker/)).toBeInTheDocument();
    expect(
      screen.getByText(/Track your hobbies and sessions/),
    ).toBeInTheDocument();
    expect(screen.getByTestId('mock-user-nav')).toBeInTheDocument();
  });
});
