import { useEffect, useState } from 'react';

/**
 * position: fixed 도크가 푸터 위로 겹치지 않도록, 푸터가 화면에 들어온 만큼
 * 들어 올릴 px 값을 계산합니다. (스크롤이 끝까지 내려가면 푸터 콘텐츠를 가리는 문제)
 * 실제로 position을 absolute로 바꾸는 대신, 겹치는 만큼만 bottom 여백으로 밀어 올립니다 —
 * 레이아웃 전환 없이 항상 같은 fixed 도크라 깜빡임이 없습니다.
 */
export function useStopAtFooter(footerSelector = 'footer') {
  const [lift, setLift] = useState(0);

  useEffect(() => {
    const footer = document.querySelector<HTMLElement>(footerSelector);
    if (!footer) return;

    const update = () => {
      const rect = footer.getBoundingClientRect();
      const overlap = window.innerHeight - rect.top;
      setLift(overlap > 0 ? overlap : 0);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const ro = new ResizeObserver(update);
    ro.observe(footer);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      ro.disconnect();
    };
  }, [footerSelector]);

  return lift;
}
