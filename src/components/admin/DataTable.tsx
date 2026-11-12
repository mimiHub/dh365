import { useEffect, useRef, type ReactNode } from 'react';
import { cx } from '../ui';
import s from './DataTable.module.css';

type Key = string | number;

export interface DataColumn<T> {
  key: string;
  header: string;
  /** 고정 폭(px). 생략하면 남는 폭을 나눠 가짐 */
  width?: number;
  align?: 'left' | 'center' | 'right';
  render: (row: T) => ReactNode;
}

interface Props<T> {
  columns: DataColumn<T>[];
  rows: T[];
  rowKey: (row: T) => Key;
  /** 표 설명 (스크린리더) */
  caption: string;
  /**
   * 줄 선택 체크박스 — selected(선택된 key 목록)와 onSelectChange를 같이 넘기면 켜짐.
   * 선택 상태는 부모가 가짐(제어 컴포넌트) → 일괄 삭제·노출 변경 버튼이 같은 상태를 봄
   */
  selected?: Key[];
  onSelectChange?: (keys: Key[]) => void;
  /** 줄을 누르면 (상세·수정으로 이동 등). 줄 안 버튼·체크박스 클릭은 제외 */
  onRowClick?: (row: T) => void;
  /** 비었을 때 문구 */
  empty?: ReactNode;
  /** 줄 높이 — md 56px / sm 44px */
  density?: 'md' | 'sm';
}

/**
 * 관리자 목록 표 — 열 정의만 바꿔 끼우면 배너·Q&A·문의 어떤 목록이든 같은 표로.
 * 사용자 화면의 BoardTable과 달리 모바일 카드 변환 대신 가로 스크롤(관리자는 정보 밀도가 우선)
 */
export function DataTable<T>({ columns, rows, rowKey, caption, selected, onSelectChange, onRowClick, empty = '데이터가 없습니다.', density = 'md' }: Props<T>) {
  const selectable = !!selected && !!onSelectChange;
  const keys = rows.map(rowKey);
  const picked = new Set(selected ?? []);
  const all = selectable && rows.length > 0 && keys.every((k) => picked.has(k));
  const some = selectable && keys.some((k) => picked.has(k)) && !all;

  // indeterminate(일부 선택 '−' 표시)는 HTML 속성이 없고 DOM 속성으로만 설정 가능 → ref로
  const allRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (allRef.current) allRef.current.indeterminate = some;
  }, [some]);

  const toggleAll = () => onSelectChange?.(all ? (selected ?? []).filter((k) => !keys.includes(k)) : [...new Set([...(selected ?? []), ...keys])]);
  const toggle = (k: Key) => onSelectChange?.(picked.has(k) ? (selected ?? []).filter((x) => x !== k) : [...(selected ?? []), k]);

  return (
    <div className={s.scroll}>
      <table className={cx(s.table, s[density], onRowClick && s.clickable)}>
        <caption className="sr-only">{caption}</caption>
        <colgroup>
          {selectable && <col style={{ width: 48 }} />}
          {columns.map((c) => (
            <col key={c.key} style={c.width ? { width: c.width } : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {selectable && (
              <th scope="col" className={s.check}>
                <input ref={allRef} type="checkbox" checked={all} onChange={toggleAll} aria-label="이 페이지 전체 선택" disabled={!rows.length} />
              </th>
            )}
            {columns.map((c) => (
              <th key={c.key} scope="col" className={s[c.align ?? 'left']}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className={s.empty}>{empty}</td>
            </tr>
          ) : (
            rows.map((row) => {
              const k = rowKey(row);
              const on = picked.has(k);
              return (
                <tr
                  key={k}
                  className={cx(on && s.selected)}
                  // 줄 클릭은 마우스 편의. 키보드 사용자를 위해 줄 안에 실제 링크·버튼(제목 등)을 같이 두는 것이 원칙
                  onClick={onRowClick ? (e) => !(e.target as HTMLElement).closest('a,button,input,label,select') && onRowClick(row) : undefined}
                >
                  {selectable && (
                    <td className={s.check}>
                      <input type="checkbox" checked={on} onChange={() => toggle(k)} aria-label={`${k}번 선택`} />
                    </td>
                  )}
                  {columns.map((c) => (
                    <td key={c.key} className={s[c.align ?? 'left']}>{c.render(row)}</td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
