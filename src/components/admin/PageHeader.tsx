import type { ReactNode } from 'react';
import s from './PageHeader.module.css';

interface Props {
  title: string;
  desc?: ReactNode;
  /** 위치 표시 — ['게시판 관리', '배너'] */
  breadcrumb?: string[];
  /** 오른쪽 버튼 — 등록·내보내기 등 */
  actions?: ReactNode;
}

/** 관리자 화면 머리 — [위치 / 제목 / 설명] ……… [버튼] */
export function PageHeader({ title, desc, breadcrumb, actions }: Props) {
  return (
    <div className={s.head}>
      <div className={s.text}>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="현재 위치">
            <ol className={s.crumb}>
              {breadcrumb.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className={s.title}>{title}</h1>
        {desc && <p className={s.desc}>{desc}</p>}
      </div>
      {actions && <div className={s.actions}>{actions}</div>}
    </div>
  );
}
