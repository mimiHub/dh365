import type { ReactNode } from 'react';
import { Link } from '@/lib/router';
import { Icon, cx } from '../ui';
import s from './BoardTable.module.css';

export interface BoardColumn<T> {
  key: string;
  header: string;
  /** PC 칸 폭 (제목 칸은 비워 두면 남는 폭을 다 씀) */
  width?: number;
  cell: (row: T) => ReactNode;
  /**
   * 모바일 카드에서: meta = 제목 아래 한 줄에 '이름 값'으로, hide = 숨김, badge = 이름 없이 칩만.
   * 줄마다 다르게 하려면 함수로 (예: 고정 공지는 번호 대신 '공지' 칩 → (row) => row.pinned ? 'badge' : 'meta')
   */
  mobile?: MobileMode | ((row: T) => MobileMode);
}

type MobileMode = 'meta' | 'hide' | 'badge';

interface Props<T> {
  caption: string; // 스크린리더용 표 설명
  rows: T[];
  rowKey: (row: T) => string | number;
  /** 제목 칸 — 링크 주소와 글자. 자물쇠(비밀글)·아이콘은 선택 */
  title: (row: T) => { to: string; text: string; state?: unknown; secret?: boolean; icon?: ReactNode; after?: ReactNode };
  /** 강조할 줄 (예: 상단 고정 공지) — 연한 블루 바탕 */
  highlight?: (row: T) => boolean;
  columns: BoardColumn<T>[]; // 제목 칸 앞뒤 칸들 — 'title'이라는 key 자리에 제목이 들어감
  /** 바뀌면 tbody를 새로 그려 등장 모션 재생 (검색·페이지) */
  motionKey?: string;
}

/**
 * 게시판 표 — 견적문의·설계문의·자료실 공용.
 * 진짜 <table>: 열 머리(th)가 있어 스크린리더가 '번호 215, 제목 …'처럼 칸 이름과 함께 읽어 줌.
 * 모바일에서는 같은 표를 CSS만으로 카드형 줄로 바꿈(제목이 위, 나머지는 아래 한 줄).
 */
export function BoardTable<T>({ caption, rows, rowKey, title, columns, motionKey, highlight }: Props<T>) {
  return (
    <table className={s.table}>
      <caption className="sr-only">{caption}</caption>
      <colgroup>
        {columns.map((c) => (
          <col key={c.key} style={c.width ? { width: c.width } : undefined} />
        ))}
      </colgroup>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} scope="col">{c.header}</th>
          ))}
        </tr>
      </thead>
      <tbody key={motionKey}>
        {rows.map((row, i) => (
          <tr key={rowKey(row)} className={cx(highlight?.(row) && s.highlight)} style={{ animationDelay: `${i * 30}ms` }}>
            {columns.map((c) => {
              if (c.key === 'title') {
                const t = title(row);
                return (
                  <td key="title" className={s.titleCell}>
                    <Link to={t.to} state={t.state} className={s.title}>
                      {t.secret && (
                        <span className={s.icon}>
                          <Icon name="lock" size={16} strokeWidth={2} />
                          <span className="sr-only">비밀글</span>
                        </span>
                      )}
                      {t.icon && <span className={s.icon}>{t.icon}</span>}
                      <span className={s.titleText}>{t.text}</span>
                      {t.after}
                    </Link>
                  </td>
                );
              }
              const m = typeof c.mobile === 'function' ? c.mobile(row) : c.mobile;
              return (
                <td key={c.key} className={cx(m === 'hide' && s.mHide, m === 'badge' && s.mBadge, m === 'meta' && s.mMeta)}>
                  {m === 'meta' && <span className={s.metaLabel}>{c.header} </span>}
                  {c.cell(row)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** 제목 뒤 댓글 수 — 💬 2 */
export function CommentCount({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className={s.comments}>
      <Icon name="chat" size={14} />
      {count}
      <span className="sr-only">개 댓글</span>
    </span>
  );
}

/**
 * 상태 칩 — 표·상세에서 같이 씀
 * - 기본: 회색 (접수)
 * - done: 연한 블루 (답변완료·분류명)
 * - solid: 네이비 채움 (공지 — 연한 블루로 강조된 줄 위에서도 묻히지 않게)
 */
export function StatusChip({ done, solid, children }: { done?: boolean; solid?: boolean; children: ReactNode }) {
  return <span className={cx(s.chip, done && s.chipDone, solid && s.chipSolid)}>{children}</span>;
}
