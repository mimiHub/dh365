import { useSyncExternalStore } from 'react';

/** 모바일 구간 — 각 *.module.css의 @media (max-width: 767px)와 같은 값 */
export const MOBILE = '(max-width: 767px)';

/**
 * CSS 미디어쿼리를 JS에서도 같은 기준으로 읽음. useSyncExternalStore: 브라우저 상태(화면 폭)를 React에 구독시키는 표준 방법
 * — resize마다 state를 갱신하는 것보다 정확하고, 경계값을 넘을 때만 리렌더됨
 * 서버 렌더에서는 화면 폭을 모르므로 false(데스크톱 기준) → 브라우저에서 hydration 후 실제 값으로 다시 그림
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
