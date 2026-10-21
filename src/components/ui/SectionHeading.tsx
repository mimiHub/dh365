import type { ReactNode } from 'react';
import { cx } from './cx';

interface Props {
  eyebrow?: string;
  title: ReactNode; // <em>으로 감싼 한 단어는 accent-text 강조
  description?: ReactNode;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, align = 'left', as: Tag = 'h2', id, className }: Props) {
  return (
    <div className={cx('dh-heading', align === 'center' && 'dh-heading-center', className)}>
      {eyebrow && <p className="dh-eyebrow">{eyebrow}</p>}
      <Tag className="dh-heading-title" id={id}>
        {title}
      </Tag>
      {description && <p className="dh-heading-desc">{description}</p>}
    </div>
  );
}
