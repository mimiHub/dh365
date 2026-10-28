import logo from '../../assets/logo.png';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NAV, COMPANY } from '../../data/site';
import { Button, SmartLink, cx } from '../ui';
import { useScrolled } from '../../hooks/useScrolled';
import s from './Header.module.css';

/**
 * GNB — 히어로 위에서는 투명+흰 글자, 스크롤하거나 메뉴에 마우스를 올리면 흰 배경.
 * PC: 1뎁스 hover 시 전체 2뎁스를 한 번에 펼치는 '전체형 드롭다운'(코아드 방식)
 * 모바일(≤1024): 햄버거 → 전체화면 메뉴 + 아코디언
 */
export function Header() {
  const scrolled = useScrolled(40);
  // 투명 헤더는 메인 히어로 위에서만. 하위 페이지는 상단에 흰 카테고리 탭이 붙으므로 처음부터 흰 배경
  const isHome = useLocation().pathname === '/';
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  // 모바일 메뉴가 열리면 헤더는 투명 + 흰 글자(네이비 오버레이 위에 떠 있음)
  const solid = (scrolled || megaOpen || !isHome) && !mobileOpen;

  // 모바일 메뉴가 열려 있으면 배경 스크롤 잠금 + ESC로 닫기
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    // 다른 플로팅 요소(채팅상담 버튼)가 메뉴 위에 뜨지 않도록 body에 상태 표시
    document.body.toggleAttribute('data-menu-open', mobileOpen);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  return (
    <header
      className={cx(s.header, solid && s.solid, scrolled && !mobileOpen && s.compact, mobileOpen && s.menuOpen)}
      onMouseLeave={() => setMegaOpen(false)}
    >
      <div className={cx('container', s.bar)}>
        <SmartLink href="/" className={s.logo} aria-label={`${COMPANY.name} 홈`}>
          <img src={logo} alt={COMPANY.name} />
        </SmartLink>

        <nav className={s.gnb} aria-label="주 메뉴" onMouseEnter={() => setMegaOpen(true)} onFocus={() => setMegaOpen(true)}>
          <ul className={s.depth1}>
            {NAV.map((item) => (
              <li key={item.label}>
                <SmartLink href={item.href} className={s.d1link}>
                  {item.label}
                </SmartLink>
                {item.children && (
                  <ul className={cx(s.depth2, megaOpen && s.depth2Open)}>
                    {item.children.map((c) => (
                      <li key={c.label}>
                        <SmartLink href={c.href} onClick={() => setMegaOpen(false)}>{c.label}</SmartLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.util}>
          <Button href="#contact" size="sm" className={s.cta}>견적문의</Button>
          <button
            type="button"
            className={s.burger}
            aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {/* SVG 한 장으로 그림: span 3개 + gap 방식은 브라우저 확대(90%, 110%…)에서
                줄마다 픽셀 반올림이 달라 한 줄만 두꺼워 보임 */}
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <rect className={s.l1} x="3" y="5" width="18" height="2" rx="1" />
              <rect className={s.l2} x="3" y="11" width="18" height="2" rx="1" />
              <rect className={s.l3} x="3" y="17" width="18" height="2" rx="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* 메가 드롭다운 배경판 — 2뎁스 목록은 각 1뎁스 아래에 세로로 놓이고, 이 판이 그 뒤를 받쳐줍니다 */}
      <div className={cx(s.megaBg, megaOpen && s.megaBgOpen)} aria-hidden="true" />

      {/* hidden 속성 대신 inert: hidden은 display:none이라 닫힐 때 애니메이션이 안 보임.
          inert는 화면엔 남겨두되 포커스·클릭·스크린리더에서 빼 줌 */}
      <div id="mobile-menu" className={cx(s.mobile, mobileOpen && s.mobileOpen)} inert={!mobileOpen}>
        <ul>
          {NAV.map((item, i) => (
            <li key={item.label} className={s.mItem} style={{ ['--i' as string]: i }}>
              <button
                type="button"
                className={s.mHead}
                aria-expanded={openIdx === i}
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                {item.label}
              </button>
              {openIdx === i && item.children && (
                <ul className={s.mSub}>
                  {item.children.map((c) => (
                    <li key={c.label}>
                      <SmartLink href={c.href} onClick={() => setMobileOpen(false)}>{c.label}</SmartLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <a href={`tel:${COMPANY.tel}`} className={s.mTel} style={{ ['--i' as string]: NAV.length }}>
          <span>견적상담</span>
          {COMPANY.tel}
        </a>
      </div>
    </header>
  );
}
