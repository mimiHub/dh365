import type { ReactNode } from 'react';
import s from './PostHeader.module.css';

/** 글 상세 머리 — 칩(분류·상태) + 번호 / 제목 / 글쓴이·조회 등. 견적·설계문의·자료실 상세 공용 */
export function PostHeader({ badges, no, title, meta, titleId = 'post-title' }: { badges?: ReactNode; no?: number; title: string; meta: ReactNode[]; titleId?: string }) {
  return (
    <header className={s.head}>
      <div className={s.top}>
        {badges}
        {no !== undefined && <span className={s.no}>No. {no}</span>}
      </div>
      <h2 id={titleId} className={s.title}>{title}</h2>
      <p className={s.meta}>
        {meta.map((m, i) => (
          <span key={i}>{m}</span>
        ))}
      </p>
    </header>
  );
}
