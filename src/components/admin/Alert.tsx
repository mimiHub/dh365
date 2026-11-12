import type { ReactNode } from 'react';
import { Icon, cx, type IconName } from '../ui';
import s from './Alert.module.css';

type Tone = 'info' | 'success' | 'warning' | 'danger';
const ICON: Record<Tone, IconName> = { info: 'info', success: 'check', warning: 'alert', danger: 'alert' };

interface Props {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  /** 닫기 버튼 — 넘기면 나타남 */
  onClose?: () => void;
}

/**
 * 안내 상자 — 저장 완료, 입력 오류 요약, 주의사항.
 * danger·warning은 role="alert"(바로 읽어 줌), 나머지는 role="status"(하던 말 끝나고 읽어 줌)
 */
export function Alert({ tone = 'info', title, children, onClose }: Props) {
  return (
    <div className={cx(s.alert, s[tone])} role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}>
      <span className={s.icon}>
        <Icon name={ICON[tone]} size={18} strokeWidth={2} />
      </span>
      <div className={s.text}>
        {title && <p className={s.title}>{title}</p>}
        <div className={s.body}>{children}</div>
      </div>
      {onClose && (
        <button type="button" className={s.close} aria-label="안내 닫기" onClick={onClose}>
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  );
}
