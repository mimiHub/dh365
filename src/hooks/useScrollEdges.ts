import { useEffect, useState, type RefObject } from 'react';

export interface ScrollEdges {
  overflow: boolean; // 내용이 가로로 넘치는지
  start: boolean; // 맨 왼쪽에 닿아 있는지
  end: boolean; // 맨 오른쪽에 닿아 있는지
}

/**
 * 가로 스크롤 목록의 '넘침·양 끝' 상태 — 탭 줄 공통 규칙(끝 흐림·호버 화살표)에서 씀
 * - 크기 변화(화면 회전·창 크기·탭 개수)는 ResizeObserver, 위치 변화는 scroll 이벤트로 감시
 * - deps: 목록 내용이 바뀌는 값(탭 개수 등)을 넘기면 다시 측정
 */
export function useScrollEdges(ref: RefObject<HTMLElement | null>, deps: unknown[] = []): ScrollEdges {
  const [edges, setEdges] = useState<ScrollEdges>({ overflow: false, start: true, end: true });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      const max = el.scrollWidth - el.clientWidth;
      const next = { overflow: max > 1, start: el.scrollLeft <= 1, end: el.scrollLeft >= max - 1 };
      // 값이 같으면 이전 객체를 그대로 → 불필요한 다시 그리기 방지
      setEdges((prev) => (prev.overflow === next.overflow && prev.start === next.start && prev.end === next.end ? prev : next));
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    el.addEventListener('scroll', check, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', check);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...deps]);

  return edges;
}

/** 상태 → 전역 클래스 (global.css의 '가로 스크롤 공통 규칙') */
export const edgeClass = (e: ScrollEdges) => (e.overflow ? ['dh-fade', !e.start && 'dh-fade-l', !e.end && 'dh-fade-r'].filter(Boolean).join(' ') : '');
