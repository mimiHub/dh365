'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { readState } from '@/lib/router';
import { Header } from './Header';
import { Footer } from './Footer';
import { QuickMenu } from './QuickMenu';

/**
 * 모든 페이지 공통 틀 — 페이지 내용은 children(app/(site)/의 각 page.tsx) 자리에 들어옵니다.
 *
 * Next의 자동 스크롤은 끄고(lib/router의 Link·navigate가 scroll: false) 직접 처리합니다.
 * - '/#cases' 처럼 해시가 있으면 그 섹션으로
 * - 같은 카테고리 안에서 제품만 바꾼 경우(state.keepScroll)는 그대로
 * - 그 외 페이지 이동은 맨 위로 (html의 smooth 스크롤을 무시하고 즉시)
 * 검색어·페이지(?q= &page=)만 바뀌는 이동은 모두 keepScroll이라 pathname만 지켜봄
 */
export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const { hash } = window.location;
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
      return;
    }
    if ((readState(pathname) as { keepScroll?: boolean } | null)?.keepScroll) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <>
      <a href="#main" className="skip-link">본문 바로가기</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <QuickMenu />
    </>
  );
}
