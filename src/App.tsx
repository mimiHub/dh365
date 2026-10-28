import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { QuickMenu } from './components/layout/QuickMenu';

/**
 * 모든 페이지 공통 틀 — 페이지 내용은 <Outlet />(router.tsx의 자식 라우트) 자리에 들어옵니다.
 *
 * SPA는 페이지를 바꿔도 브라우저가 스크롤을 맨 위로 돌려주지 않으므로 직접 처리합니다.
 * - '/#cases' 처럼 해시가 있으면 그 섹션으로
 * - 같은 카테고리 안에서 제품만 바꾼 경우(state.keepScroll)는 그대로
 * - 그 외 페이지 이동은 맨 위로 (html의 smooth 스크롤을 무시하고 즉시)
 */
export default function App() {
  const { pathname, hash, state } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
      return;
    }
    if ((state as { keepScroll?: boolean } | null)?.keepScroll) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash, state]);

  return (
    <>
      <a href="#main" className="skip-link">본문 바로가기</a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <QuickMenu />
    </>
  );
}
