import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

type Variant = 'primary' | 'secondary' | 'solid' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface Common {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
}
// href가 있으면 <a>, 없으면 <button> — 이동은 링크, 동작은 버튼 (판별 유니온 타입)
type Props =
  | (Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common>)
  | (Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Common>);

export function Arrow() {
  return (
    <svg className="dh-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Button({ variant = 'primary', size = 'md', arrow, children, className, ...rest }: Props) {
  const cls = cx('dh-btn', `dh-btn-${variant}`, size !== 'md' && `dh-btn-${size}`, className);
  const inner = (
    <>
      {children}
      {arrow && <Arrow />}
    </>
  );
  if ('href' in rest && rest.href !== undefined) {
    return <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>{inner}</a>;
  }
  return (
    <button type="button" className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  );
}
