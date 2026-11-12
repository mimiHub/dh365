import { useState, type ReactNode } from 'react';
import logo from '../../assets/logo.png';
import { Icon, SmartLink, cx, type IconName } from '../ui';
import s from './AdminShell.module.css';

export interface AdminMenuItem {
  key: string;
  label: string;
  icon: IconName;
  /** 이동할 주소. 없으면 onSelect만 호출 (카탈로그 데모처럼 화면 안에서 바꿀 때) */
  href?: string;
  /** 오른쪽 숫자 배지 — 새 문의 수 등 */
  badge?: number;
}

interface Props {
  menu: AdminMenuItem[];
  /** 지금 화면의 메뉴 key */
  current: string;
  onSelect?: (key: string) => void;
  /** 위쪽 막대 오른쪽 — 로그인 사용자 이름 */
  user?: string;
  onLogout?: () => void;
  children: ReactNode;
  /**
   * - page  : 화면 전체 (실제 관리자 사이트)
   * - embed : 다른 페이지 안에 넣어 보여 줄 때 (카탈로그 미리보기) — 높이 고정·고정 위치 해제
   */
  mode?: 'page' | 'embed';
}

/**
 * 관리자 화면 틀 — 왼쪽 메뉴 + 위쪽 막대 + 본문.
 * 1024px 이하에서는 메뉴가 서랍(drawer)으로 숨고 ☰ 버튼으로 엶
 */
export function AdminShell({ menu, current, onSelect, user, onLogout, children, mode = 'page' }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cx(s.shell, s[mode], open && s.open)}>
      <aside className={s.side} aria-label="관리자 메뉴">
        <div className={s.brand}>
          <img src={logo} alt="대한방화" className={s.logo} />
          <span className={s.brandTag}>ADMIN</span>
        </div>
        <nav>
          <ul className={s.menu}>
            {menu.map((m) => {
              const on = m.key === current;
              const inner = (
                <>
                  <Icon name={m.icon} size={18} />
                  <span className={s.menuLabel}>{m.label}</span>
                  {!!m.badge && (
                    <span className={s.badge}>
                      {m.badge}
                      <span className="sr-only">건 새로 들어옴</span>
                    </span>
                  )}
                </>
              );
              const pick = () => {
                onSelect?.(m.key);
                setOpen(false);
              };
              return (
                <li key={m.key}>
                  {m.href ? (
                    <SmartLink href={m.href} className={cx(s.menuItem, on && s.on)} aria-current={on ? 'page' : undefined} onClick={pick}>
                      {inner}
                    </SmartLink>
                  ) : (
                    <button type="button" className={cx(s.menuItem, on && s.on)} aria-current={on ? 'page' : undefined} onClick={pick}>
                      {inner}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      {/* 서랍이 열렸을 때 뒤를 덮는 막 — 누르면 닫힘 */}
      <div className={s.scrim} aria-hidden="true" onClick={() => setOpen(false)} />

      <div className={s.main}>
        <header className={s.top}>
          <button type="button" className={s.menuBtn} aria-label={open ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            <Icon name={open ? 'close' : 'menu'} size={20} />
          </button>
          <div className={s.topRight}>
            {user && <span className={s.user}>{user}</span>}
            {onLogout && (
              <button type="button" className={s.logout} onClick={onLogout}>
                <Icon name="logout" size={16} />
                로그아웃
              </button>
            )}
          </div>
        </header>
        <main className={s.content}>{children}</main>
      </div>
    </div>
  );
}
