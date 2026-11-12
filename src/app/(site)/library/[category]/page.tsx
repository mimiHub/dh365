import { LibraryPage } from '@/views/library/LibraryPage';

// 검색어·페이지(?q= &page=)를 서버 렌더에서도 읽도록 요청마다 렌더
export const dynamic = 'force-dynamic';

export default function Page() {
  return <LibraryPage />;
}
