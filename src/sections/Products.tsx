import { useCallback, useEffect, useRef, useState } from 'react';
import { PRODUCTS } from '../data/site';
import { Badge, Media, cx } from '../components/ui';
import { useReveal } from '../hooks/useReveal';
import steelShutterImg from '../assets/product-steel-shutter.png';
import screenShutterImg from '../assets/product-screen-shutter.png';
import smokeScreenImg from '../assets/product-smoke-screen.png';
import wiredGlassImg from '../assets/product-wired-glass.png';
import windShutterImg from '../assets/product-wind-shutter.png';
import securityShutterImg from '../assets/product-security-shutter.png';
import s from './Products.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

// 제품별 사진. 실제 이미지가 있는 제품만 채우고, 나머지는 Media가 슬랫 패턴 플레이스홀더로 표시합니다.
const PRODUCT_IMAGES: Partial<Record<string, string>> = {
  steel: steelShutterImg, // 쿠팡 물류센터 철재방화셔터 시공 현장
  screen: screenShutterImg, // 방화스크린셔터 시공 현장
  smoke: smokeScreenImg, // 구내식당 제연스크린 시공 현장
  wired: wiredGlassImg, // 상가 망입유리 시공 현장
  wind: windShutterImg, // 내풍압셔터
  security: securityShutterImg, // 방범셔터 시공 현장
};

/**
 * 제품 슬라이더 — 라이브러리 없이 CSS scroll-snap + 좌우 버튼.
 * 스와이프(터치 스크롤)와 버튼이 같은 스크롤 위치를 공유하므로,
 * 현재 위치는 state로 따로 들고 있지 않고 scroll 이벤트에서 읽어 옵니다.
 */
export function Products() {
  const ref = useReveal<HTMLElement>();
  const track = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);
  const [edge, setEdge] = useState({ start: true, end: false });

  // 카드 한 장 + 간격 = 한 칸. gap은 CSS에서 읽어 와 반응형 값과 어긋나지 않게 함
  const stepOf = (el: HTMLUListElement) => {
    const card = el.querySelector('li');
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    return card ? card.getBoundingClientRect().width + gap : el.clientWidth;
  };

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const atEnd = el.scrollLeft >= max - 2;
    // PC처럼 여러 장이 한 화면에 보이면 끝에서도 첫 카드 번호가 4쯤에 머묾 → 끝이면 마지막 번호로
    setCurrent(atEnd ? PRODUCTS.length - 1 : Math.round(el.scrollLeft / stepOf(el)));
    setEdge({ start: el.scrollLeft <= 2, end: atEnd });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      el.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  const move = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * stepOf(el), behavior: 'smooth' });
  };

  return (
    <section id="products" className={cx('section', s.products)} ref={ref} aria-labelledby="products-title">
      <div className="container">
        <div className={cx(s.top, 'reveal')}>
          <div className="dh-heading">
            <p className="dh-eyebrow">PRODUCT</p>
            <h2 id="products-title" className="dh-heading-title">
              현장에 맞는 <em>방화·방범 셔터</em>
            </h2>
            <p className="dh-heading-desc">철재방화셔터부터 방화스크린셔터, 제연스크린, 방범셔터까지 대한방화가 함께합니다.</p>
          </div>
          <div className={s.nav}>
            {/* 스크린리더에는 숫자 변화를 굳이 읽히지 않음 — 카드 자체가 목록으로 탐색됨 */}
            <p className={s.count} aria-hidden="true">
              <strong>{pad(current + 1)}</strong> / {pad(PRODUCTS.length)}
            </p>
            <button type="button" className={s.arrow} onClick={() => move(-1)} disabled={edge.start} aria-label="이전 제품" aria-controls="products-track">
              <Chevron dir="left" />
            </button>
            <button type="button" className={s.arrow} onClick={() => move(1)} disabled={edge.end} aria-label="다음 제품" aria-controls="products-track">
              <Chevron dir="right" />
            </button>
          </div>
        </div>
      </div>

      <ul id="products-track" ref={track} className={cx(s.track, !edge.start && s.scrolled, edge.end && s.atEnd, 'reveal')} aria-label="제품 목록">
        {PRODUCTS.map((p, i) => (
          <li key={p.key} className={s.slide}>
            <a href="#products" className={s.card}>
              <Media className={s.media} src={PRODUCT_IMAGES[p.key]} alt={PRODUCT_IMAGES[p.key] ? p.name : undefined} label={`IMAGE — ${p.nameEn}`} />
              <div className={s.body}>
                <p className={s.no}>{pad(i + 1)} · {p.nameEn}</p>
                <h3 className={s.name}>{p.name}</h3>
                <p className={s.desc}>{p.description}</p>
                <div className={s.tags}>
                  {p.tags.map((t) => (
                    <Badge key={t} tone={t === '인정제품' ? 'accent' : 'neutral'}>{t}</Badge>
                  ))}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d={dir === 'left' ? 'M12.5 4.5 7 10l5.5 5.5' : 'M7.5 4.5 13 10l-5.5 5.5'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
