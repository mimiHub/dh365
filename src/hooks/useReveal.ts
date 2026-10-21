import { useEffect, useRef } from 'react';

/**
 * 요소가 화면에 들어오면 data-revealed 속성을 붙여 등장 모션을 실행합니다 (한 번만).
 *
 * 왜 classList가 아니라 data 속성인가:
 * className은 React가 관리합니다. 상태가 바뀌어 리렌더되면 React가 className을
 * JSX에 적힌 값으로 통째로 다시 써서, 우리가 DOM에 직접 넣은 클래스가 지워집니다.
 * (About의 강점 목록처럼 hover로 className이 바뀌는 요소가 다시 투명해지던 원인)
 * React가 모르는 data-* 속성은 리렌더에도 그대로 남습니다.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = root.matches('.reveal') ? [root] : Array.from(root.querySelectorAll<HTMLElement>('.reveal'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.revealed = '';
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
  return ref;
}
