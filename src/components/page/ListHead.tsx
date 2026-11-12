import type { ReactNode, Ref } from 'react';
import s from './ListHead.module.css';

interface Props {
  /** 제목 — 강조할 부분은 <em>으로 (예: <em>철재방화셔터</em> 시공사례) */
  title: ReactNode;
  total: number;
  q?: string;
  /** 페이지 표시 (게시판형) */
  page?: number;
  pages?: number;
  /** 오른쪽: 검색창·버튼 */
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>; // React 19: ref를 일반 prop으로 받음 (forwardRef 불필요)
}

/** 목록 머리 — 제목 + '검색 결과 · 총 N건' + 오른쪽 도구. 시공사례·견적문의·설계문의·자료실 공용 */
export function ListHead({ title, total, q, page, pages, children, ref }: Props) {
  return (
    <div className={s.head} ref={ref}>
      <h2 className={s.title} aria-live="polite">
        <span>{title}</span>
        <span className={s.total}>
          {q && <>‘{q}’ 검색 결과 </>}총 <strong>{total}</strong>건
          {page !== undefined && pages !== undefined && <> · {page} / {pages} 페이지</>}
        </span>
      </h2>
      {children && <div className={s.tools}>{children}</div>}
    </div>
  );
}
