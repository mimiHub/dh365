import type { ReactNode } from 'react';
import { cx } from './cx';
import { SmartLink } from './SmartLink';

export function MoreLink({ href = '#', children = 'VIEW MORE', className }: { href?: string; children?: ReactNode; className?: string }) {
  return (
    <SmartLink href={href} className={cx('dh-more', className)}>
      {children}
      <span className="dh-more-line" aria-hidden="true" />
    </SmartLink>
  );
}
