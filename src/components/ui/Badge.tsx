import type { ReactNode } from 'react';
import { cx } from './cx';

export function Badge({ tone = 'neutral', children, className }: { tone?: 'neutral' | 'accent' | 'fire' | 'solid' | 'outline'; children: ReactNode; className?: string }) {
  return <span className={cx('dh-badge', `dh-badge-${tone}`, className)}>{children}</span>;
}
