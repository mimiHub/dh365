import { useEffect, useRef, useState } from 'react';

interface Props {
  /** 최종 값 — '12,000'처럼 콤마가 있어도 됨. 숫자가 아니면 그대로 보여 줌 */
  value: string;
  /** 0에서 최종 값까지 걸리는 시간(ms) */
  duration?: number;
}

/**
 * 화면에 들어오면 0부터 숫자가 올라가는 효과.
 * - 스크린리더는 움직이는 숫자 대신 최종 값만 읽음 (움직이는 쪽은 aria-hidden)
 * - '동작 줄이기' 설정이면 바로 최종 값
 * - 한 번만 실행 (IntersectionObserver를 처음 보였을 때 끊음)
 */
export function CountUp({ value, duration = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const target = Number(value.replace(/,/g, ''));
  const valid = value.trim() !== '' && Number.isFinite(target);
  const [n, setN] = useState<number | null>(null); // null = 아직 시작 전

  useEffect(() => {
    const el = ref.current;
    if (!el || !valid) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3); // 처음엔 빠르게, 끝에서 천천히 (ease-out)
          setN(Math.round(target * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, valid, duration]);

  if (!valid) return <>{value}</>;
  return (
    <>
      {/* 자리 폭 고정: 최종 값과 같은 글자 수로 미리 너비를 잡아 숫자가 바뀔 때 옆 단위가 흔들리지 않게 */}
      <span ref={ref} aria-hidden="true" style={{ display: 'inline-block', minWidth: `${value.length}ch`, textAlign: 'inherit' }}>
        {n === null ? value : n.toLocaleString('ko-KR')}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
