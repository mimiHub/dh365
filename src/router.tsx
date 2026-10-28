import { createBrowserRouter, createMemoryRouter, type RouteObject } from 'react-router-dom';
import App from './App';
import { Home } from './pages/Home';
import { ProductPage } from './pages/ProductPage';

const routes: RouteObject[] = [
  {
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      // :slug? — 선택 사항. 없으면 카테고리의 첫 제품을 보여줌 (/products/steel = 철재방화셔터)
      { path: '/products/:category/:slug?', element: <ProductPage /> },
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
