import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
// 순서가 곧 우선순위: 폰트 → 토큰 → 디자인 시스템 컴포넌트 → 프로젝트 전역
import 'pretendard/dist/web/variable/pretendardvariable.css';
import '@/design-system/tokens.css';
import '@/design-system/components.css';
import '@/styles/global.css';

export const metadata: Metadata = {
  title: '(주)대한방화 | 방화셔터 인정제품 설치 전문',
  description: '철재방화셔터, 방화스크린셔터, 제연스크린, 망입유리, 내풍압셔터, 방범셔터 설계·시공 전문 (주)대한방화',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
