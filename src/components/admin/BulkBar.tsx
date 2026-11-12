import type { ReactNode } from 'react';
import s from './BulkBar.module.css';

interface Props {
  /** 선택한 개수 — 0이면 막대가 숨음 */
  count: number;
  /** 선택한 것에 할 일 — <Button size="sm"> 들 */
  children: ReactNode;
  onClear: () => void;
}

/** 일괄 작업 막대 — 표에서 줄을 고르면 나타남: [3개 선택 · 선택 해제] ……… [노출] [숨김] [삭제] */
export function BulkBar({ count, children, onClear }: Props) {
  if (!count) return null;
  return (
    <div className={s.bar} role="region" aria-label="선택한 항목 일괄 작업">
      <p className={s.count} aria-live="polite">
        <strong>{count}</strong>개 선택
        <button type="button" className={s.clear} onClick={onClear}>선택 해제</button>
      </p>
      <div className={s.actions}>{children}</div>
    </div>
  );
}
