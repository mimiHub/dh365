import { useId, type ReactNode } from 'react';
import { cx } from '../ui';
import s from './Panel.module.css';

interface Props {
  title?: string;
  desc?: ReactNode;
  /** 머리 오른쪽 — 작은 버튼·링크 */
  actions?: ReactNode;
  children: ReactNode;
  /**
   * 안쪽 여백
   * - md   : 기본 (폼·글)
   * - none : 표처럼 가장자리까지 채울 때 (DataTable)
   */
  padding?: 'md' | 'none';
  className?: string;
}

/** 흰 상자 — 관리자 본문은 이 상자를 쌓아서 구성 (목록, 폼 묶음, 통계 등) */
export function Panel({ title, desc, actions, children, padding = 'md', className }: Props) {
  const id = useId();
  return (
    <section className={cx(s.panel, className)} aria-labelledby={title ? id : undefined}>
      {(title || actions) && (
        <div className={s.head}>
          <div>
            {title && <h2 id={id} className={s.title}>{title}</h2>}
            {desc && <p className={s.desc}>{desc}</p>}
          </div>
          {actions && <div className={s.actions}>{actions}</div>}
        </div>
      )}
      <div className={cx(padding === 'md' && s.body)}>{children}</div>
    </section>
  );
}
