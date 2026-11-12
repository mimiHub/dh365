import { useEffect, useState } from 'react';

/** 스크롤이 offset을 넘었는지 여부 (헤더 배경 전환용). passive 리스너로 스크롤 성능 유지. */
export function useScrolled(offset = 10) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > offset);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [offset]);
  return scrolled;
}
