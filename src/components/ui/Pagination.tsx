import { cx } from './cx';
import s from './Pagination.module.css';

interface Props {
  page: number; // 1부터
  pages: number;
  onGo: (n: number) => void;
  /** 한 번에 보여 줄 번호 개수 — 페이지가 많으면 현재 페이지 주변만 (1 2 3 4 5 → 6 7 8 9 10) */
  windowSize?: number;
  className?: string;
}

/** 페이지 번호 — 시공사례·견적문의 공용. [« ‹ 1 2 3 › »] (처음·끝 버튼은 번호가 다 안 보일 때만) */
export function Pagination({ page, pages, onGo, windowSize = 5, className }: Props) {
  if (pages <= 1) return null;
  // 현재 페이지가 속한 묶음: 1~5, 6~10 … (게시판에서 익숙한 방식 — 번호가 한 칸씩 밀리지 않아 덜 헷갈림)
  const start = Math.floor((page - 1) / windowSize) * windowSize + 1;
  const end = Math.min(start + windowSize - 1, pages);
  const nums = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const showEnds = pages > windowSize;

  return (
    <nav className={cx(s.pager, className)} aria-label="페이지">
      {showEnds && (
        <button type="button" className={s.round} onClick={() => onGo(1)} disabled={page === 1} aria-label="첫 페이지">
          <Icon d="M10 4.5 4.5 10l5.5 5.5M15.5 4.5 10 10l5.5 5.5" />
        </button>
      )}
      <button type="button" className={s.round} onClick={() => onGo(page - 1)} disabled={page === 1} aria-label="이전 페이지">
        <Icon d="M12.5 4.5 7 10l5.5 5.5" />
      </button>
      <ol className={s.pages}>
        {nums.map((n) => (
          <li key={n}>
            <button type="button" className={cx(s.no, n === page && s.on)} onClick={() => onGo(n)} aria-current={n === page ? 'page' : undefined}>
              <span className="sr-only">페이지 </span>
              {n}
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className={s.round} onClick={() => onGo(page + 1)} disabled={page === pages} aria-label="다음 페이지">
        <Icon d="M7.5 4.5 13 10l-5.5 5.5" />
      </button>
      {showEnds && (
        <button type="button" className={s.round} onClick={() => onGo(pages)} disabled={page === pages} aria-label="마지막 페이지">
          <Icon d="M4.5 4.5 10 10l-5.5 5.5M10 4.5l5.5 5.5-5.5 5.5" />
        </button>
      )}
    </nav>
  );
}

function Icon({ d }: { d: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
