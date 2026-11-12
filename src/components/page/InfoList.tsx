import type { ReactNode } from 'react';
import { cx } from '../ui';
import s from './InfoList.module.css';

export interface InfoRow {
  label: string;
  value: ReactNode;
}

interface Props {
  rows: InfoRow[];
  /**
   * - table : 라벨 | 값 한 줄씩, 위아래 선 (회사 개요·상세 정보)
   * - card  : 연회색 카드 안에 촘촘히 (옆 칸에 붙는 요약)
   */
  variant?: 'table' | 'card';
  /** PC에서 2열로 (항목이 많을 때) */
  cols?: 1 | 2;
  className?: string;
}

/** 라벨·값 목록 — <dl>: 스크린리더가 '대표이사, 신동원'처럼 짝지어 읽음. 회사 개요·문의 상세 등 공용 */
export function InfoList({ rows, variant = 'table', cols = 1, className }: Props) {
  return (
    <dl className={cx(s.list, s[variant], cols === 2 && s.cols2, className)}>
      {rows.map((r) => (
        <div key={r.label} className={s.row}>
          <dt>{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
