import type { ElementType, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: ElementType;
  title: ReactNode;
  description: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center',
        className,
      )}
    >
      <Icon aria-hidden="true" className="mb-4 size-10 text-muted-foreground" />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
