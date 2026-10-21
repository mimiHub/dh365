import type { ReactNode } from 'react';
import { cx } from './cx';

export function StatItem({ value, unit, label, className }: { value: ReactNode; unit?: string; label: ReactNode; className?: string }) {
  return (
    <div className={cx('dh-stat', className)}>
      <p className="dh-stat-value">
        {value}
        {unit && <span className="dh-stat-unit">{unit}</span>}
      </p>
      <p className="dh-stat-label">{label}</p>
    </div>
  );
}
