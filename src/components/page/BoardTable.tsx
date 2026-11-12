import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon, cx } from '../ui';
import s from './BoardTable.module.css';

export interface BoardColumn<T> {
  key: string;
  header: string;
  /** PC 칸 폭 (제목 칸은 비워 두면 남는 폭을 다 씀) */
  width?: number;
  cell: (row: T) => ReactNode;
  /** 모바일 카드에서: meta = 제목 아래 한 줄에 '이름 값'으로, hide = 숨김, badge = 제목 위에 */
  mobile?: 'meta' | 'hide' | 'badge';
}

interface Props<T> {
  caption: string; // 스크린리더용 표 설명
  rows: T[];
  rowKey: (row: T) => string | number;
  /** 제목 칸 — 링크 주소와 글자. 자물쇠(비밀글)·아이콘은 선택 */
  title: (row: T) => { to: string; text: string; state?: unknown; secret?: boolean; icon?: ReactNode };
  columns: BoardColumn<T>[]; // 제목 칸 앞뒤 칸들 — 'title'이라는 key 자리에 제목이 들어감
  /** 바뀌면 tbody를 새로 그려 등장 모션 재생 (검색·페이지) */
  motionKey?: string;
}

/**
 * 게시판 표 — 견적문의·설계문의·자료실 공용.
 * 진짜 <table>: 열 머리(th)가 있어 스크린리더가 '번호 215, 제목 …'처럼 칸 이름과 함께 읽어 줌.
 * 모바일에서는 같은 표를 CSS만으로 카드형 줄로 바꿈(제목이 위, 나머지는 아래 한 줄).
 */
export function BoardTable<T>({ caption, rows, rowKey, title, columns, motionKey }: Props<T>) {
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
          <tr key={rowKey(row)} style={{ animationDelay: `${i * 30}ms` }}>
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
                    </Link>
                  </td>
                );
              }
              return (
                <td key={c.key} className={cx(c.mobile === 'hide' && s.mHide, c.mobile === 'badge' && s.mBadge, c.mobile === 'meta' && s.mMeta)}>
                  {c.mobile === 'meta' && <span className={s.metaLabel}>{c.header} </span>}
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

/** 상태 칩 (답변완료/접수 등) — 표·상세에서 같이 씀 */
export function StatusChip({ done, children }: { done?: boolean; children: ReactNode }) {
  return <span className={cx(s.chip, done && s.chipDone)}>{children}</span>;
}
