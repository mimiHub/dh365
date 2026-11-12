import { createBrowserRouter, createMemoryRouter, type RouteObject } from 'react-router-dom';
import App from './App';
import { Home } from './pages/Home';
import { ProductPage } from './pages/ProductPage';
import { CasesPage } from './pages/CasesPage';
import { QuoteListPage } from './pages/quote/QuoteListPage';
import { QuoteWritePage } from './pages/quote/QuoteWritePage';
import { QuoteDetailPage } from './pages/quote/QuoteDetailPage';
import { BOARDS } from './pages/quote/boards';
import { FaqPage } from './pages/FaqPage';
import { LibraryPage } from './pages/library/LibraryPage';
import { LibraryDetailPage } from './pages/library/LibraryDetailPage';

const routes: RouteObject[] = [
  {
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      // :slug? — 선택 사항. 없으면 카테고리의 첫 제품을 보여줌 (/products/steel = 철재방화셔터)
      { path: '/products/:category/:slug?', element: <ProductPage /> },
      // :category? — 없으면 전체. 검색어·페이지는 ?q= &page= (주소에 담아 새로고침·공유해도 그대로)
      { path: '/cases/:category?', element: <CasesPage /> },
      // 견적문의·설계문의 = 같은 화면에 설정(board)만 다르게. key: 게시판을 옮겨 다닐 때 상태를 새로 시작
      { path: '/quote', element: <QuoteListPage key="quote" board={BOARDS.quote} /> },
      { path: '/quote/write', element: <QuoteWritePage key="quote" board={BOARDS.quote} /> },
      // /quote/write가 먼저 맞으므로 :id에 'write'가 들어오지 않음 (라우터는 고정 경로를 동적 경로보다 우선)
      { path: '/quote/:id', element: <QuoteDetailPage board={BOARDS.quote} /> },
      { path: '/design', element: <QuoteListPage key="design" board={BOARDS.design} /> },
      { path: '/design/write', element: <QuoteWritePage key="design" board={BOARDS.design} /> },
      { path: '/design/:id', element: <QuoteDetailPage board={BOARDS.design} /> },
      { path: '/faq', element: <FaqPage /> },
      { path: '/library/:category?', element: <LibraryPage /> },
      { path: '/library/:category/:id', element: <LibraryDetailPage /> },
      { path: '*', element: <Home /> },
    ],
  },
];

/**
 * 배포(Vercel) = BrowserRouter: 주소가 /products/steel 처럼 깔끔. 새로고침 대응은 vercel.json의 rewrite.
 * 시안 공유용 한 파일(build:preview) = MemoryRouter: file://로 열면 경로가 없으므로
 * 주소창 대신 메모리에서 페이지를 바꿈. (메인의 #contact 같은 앵커도 그대로 동작)
 */
export const router = import.meta.env.MODE === 'preview' ? createMemoryRouter(routes) : createBrowserRouter(routes);
