import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// 순서가 곧 우선순위: 폰트 → 토큰 → 디자인 시스템 컴포넌트 → 프로젝트 전역
import 'pretendard/dist/web/variable/pretendardvariable.css';
import './design-system/tokens.css';
import './design-system/components.css';
import './styles/global.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
