import * as React from 'react';

import { cn } from '@repo/ui/lib/utils';

const SimpleScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative h-full w-full overflow-auto rounded-[inherit]', className)}
      {...props}
    >
      {children}
    </div>
  ),
);
SimpleScrollArea.displayName = 'SimpleScrollArea';

export { SimpleScrollArea };
