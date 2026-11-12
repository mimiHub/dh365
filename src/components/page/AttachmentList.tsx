import { Icon, type IconName } from '../ui';
import s from './AttachmentList.module.css';

export interface Attachment {
  name: string;
  size?: string; // '2.4MB'
  kind?: 'file' | 'video';
  href?: string; // 실제 파일 주소 (목업은 없음)
}

const ICON: Record<NonNullable<Attachment['kind']>, IconName> = { file: 'clip', video: 'video' };

/**
 * 첨부파일 목록 — 파일명·크기 + 내려받기. 자료실·문의 상세 공용.
 * href가 없으면(목업) 버튼은 보이되 눌리지 않게 — 링크가 아닌 것을 링크처럼 만들지 않음
 */
export function AttachmentList({ items, label = '첨부파일' }: { items: Attachment[]; label?: string }) {
  if (!items.length) return null;
  return (
    <ul className={s.list} aria-label={label}>
      {items.map((f) => (
        <li key={f.name} className={s.item}>
          <span className={s.icon}>
            <Icon name={ICON[f.kind ?? 'file']} size={18} />
          </span>
          <span className={s.name}>{f.name}</span>
          {f.size && <span className={s.size}>{f.size}</span>}
          {f.href ? (
            <a href={f.href} download className={s.down} aria-label={`${f.name} 내려받기`}>
              <Icon name="download" size={18} />
            </a>
          ) : (
            <span className={s.down} aria-hidden="true" title="목업: 실제 파일 연결 전">
              <Icon name="download" size={18} />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
