import type { ReactNode } from 'react';
import { cx } from '../ui';
import s from './CtaBand.module.css';

interface Props {
  title: string;
  desc?: ReactNode;
  /** 오른쪽 버튼들 — <Button>을 넣음 (네이비 위라 secondary는 흰 테두리로 자동 변환) */
  actions: ReactNode;
  className?: string;
}

/** 페이지 끝 행동 유도 띠 — 네이비 박스 [제목·설명 ……… 버튼]. 회사소개·FAQ 등 페이지 마무리 공용 */
export function CtaBand({ title, desc, actions, className }: Props) {
  return (
    <section className={cx(s.band, className)} aria-label={title}>
      <div>
        <h2 className={s.title}>{title}</h2>
        {desc && <p className={s.desc}>{desc}</p>}
      </div>
      <div className={s.actions}>{actions}</div>
    </section>
  );
}
