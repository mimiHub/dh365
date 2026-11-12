import type { Metadata } from 'next';
import { ComponentsPage } from '@/views/catalog/ComponentsPage';

// 개발자용 문서 — 메뉴에 없고 검색엔진 수집 막음
export const metadata: Metadata = {
  title: '컴포넌트 카탈로그 — 대한방화',
  robots: { index: false, follow: false },
};
// 검색어·페이지(?q= &page=)를 서버 렌더에서도 읽도록 요청마다 렌더
export const dynamic = 'force-dynamic';

export default function Page() {
  return <ComponentsPage />;
}
