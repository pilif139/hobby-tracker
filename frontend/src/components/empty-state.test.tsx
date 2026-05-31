import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EmptyState from './empty-state';

const TestIcon = () => <svg data-testid="test-icon" />;

describe('EmptyState component', () => {
  it('renders title, description and icon', () => {
    render(
      <EmptyState
        icon={TestIcon as any}
        title="No items"
        description="There are no items to show"
      />,
    );

    expect(screen.getByText(/No items/)).toBeInTheDocument();
    expect(screen.getByText(/There are no items to show/)).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('accepts additional className', () => {
    const { container } = render(
      <EmptyState
        icon={TestIcon as any}
        title="T"
        description="D"
        className="my-extra"
      />,
    );

    expect(container.firstChild).toHaveClass('my-extra');
  });
});
