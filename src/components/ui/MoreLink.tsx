import type { ReactNode } from 'react';
import { cx } from './cx';

export function MoreLink({ href = '#', children = 'VIEW MORE', className }: { href?: string; children?: ReactNode; className?: string }) {
  return (
    <a href={href} className={cx('dh-more', className)}>
      {children}
      <span className="dh-more-line" aria-hidden="true" />
    </a>
  );
}
