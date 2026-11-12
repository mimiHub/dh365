import { Icon, cx, type IconName } from '../ui';
import s from './StatCard.module.css';

interface Props {
  label: string;
  value: number | string;
  unit?: string;
  icon?: IconName;
  /** 지난 기간 대비 — '+3', '-12%' */
  delta?: string;
  /**
   * 변화가 좋은 쪽인지 (색) — 숫자 부호만으로는 모름: 새 문의 +3은 좋은 일, 미답변 +3은 나쁜 일
   * - good : 블루 / bad : 레드 / neutral : 회색
   */
  tone?: 'good' | 'bad' | 'neutral';
}

/** 대시보드 숫자 카드 — [아이콘 · 이름] / 큰 숫자 / 변화량 */
export function StatCard({ label, value, unit, icon, delta, tone = 'neutral' }: Props) {
  return (
    <div className={s.card}>
      <p className={s.label}>
        {icon && (
          <span className={s.icon}>
            <Icon name={icon} size={16} />
          </span>
        )}
        {label}
      </p>
      <p className={s.value}>
        {typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
        {unit && <span className={s.unit}>{unit}</span>}
      </p>
      {delta && <p className={cx(s.delta, s[tone])}>{delta} <span className={s.since}>지난주 대비</span></p>}
    </div>
  );
}
