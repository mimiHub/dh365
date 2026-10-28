import { useEffect, useRef, useState } from 'react';
import { Media, cx } from '../../components/ui';
import type { GalleryImage } from './galleryImages';
import s from './ProductGallery.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * 제품 갤러리 — [대표 사진(4:3) + ‹ › + 장수] / [썸네일 줄]
 * 규격: 모든 사진이 같은 4:3 칸에 cover로 들어감 → 원본 비율과 무관하게 크기 동일.
 * 사진이 1장이면 화살표·썸네일 없이 대표 사진만, 0장이면 슬랫 플레이스홀더.
 * 상태(현재 장)는 컴포넌트 안에만 둠 — 제품이 바뀌면 부모의 key로 새로 그려져 첫 장부터
 */
export function ProductGallery({ images, name, placeholder }: { images: GalleryImage[]; name: string; placeholder: string }) {
  const [index, setIndex] = useState(0);
  const thumbs = useRef<HTMLUListElement>(null);
  const many = images.length > 1;

  // 선택한 썸네일이 썸네일 줄 밖이면 보이게 (scrollIntoView는 페이지 세로 스크롤까지 움직여서 줄만 직접 스크롤)
  useEffect(() => {
    const list = thumbs.current;
    const item = list?.children[index] as HTMLElement | undefined;
    if (!list || !item) return;
    const left = item.offsetLeft - list.offsetLeft;
    if (left < list.scrollLeft) list.scrollTo({ left, behavior: 'smooth' });
    else if (left + item.offsetWidth > list.scrollLeft + list.clientWidth)
      list.scrollTo({ left: left + item.offsetWidth - list.clientWidth, behavior: 'smooth' });
  }, [index]);

  if (images.length === 0) {
    return <Media className={s.stage} label={placeholder} />;
  }

  // 끝에서 처음으로 이어짐(순환) — 몇 장 안 되는 갤러리에서 비활성 버튼보다 자연스러움
  const go = (d: number) => setIndex((i) => (i + d + images.length) % images.length);
  const cur = images[index];

  return (
    <div className={s.gallery} role="group" aria-roledescription="갤러리" aria-label={`${name} 사진`}>
      <div className={s.stage}>
        {/* key: 사진이 바뀔 때마다 새로 그려 페이드인 */}
        <img key={cur.src} src={cur.src} alt={cur.alt} className={s.photo} />
        {many && (
          <>
            <button type="button" className={cx(s.arrow, s.prev)} onClick={() => go(-1)} aria-label="이전 사진">
              <Chevron dir="left" />
            </button>
            <button type="button" className={cx(s.arrow, s.next)} onClick={() => go(1)} aria-label="다음 사진">
              <Chevron dir="right" />
            </button>
            {/* 화면 낭독기에는 사진 alt가 바뀌는 걸로 충분 — 숫자 변화는 숨김 */}
            <p className={s.count} aria-hidden="true">
              <strong>{pad(index + 1)}</strong> / {pad(images.length)}
            </p>
          </>
        )}
      </div>

      {many && (
        <ul ref={thumbs} className={s.thumbs}>
          {images.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                className={s.thumb}
                onClick={() => setIndex(i)}
                aria-label={`${i + 1}번째 사진 보기: ${img.alt}`}
                aria-current={i === index ? 'true' : undefined}
              >
                <img src={img.src} alt="" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d={dir === 'left' ? 'M12.5 4.5 7 10l5.5 5.5' : 'M7.5 4.5 13 10l-5.5 5.5'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
