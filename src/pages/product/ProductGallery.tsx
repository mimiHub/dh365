import { useEffect, useId, useRef, useState } from 'react';
import { Media, SliderNav, cx } from '../../components/ui';
import type { GalleryImage } from './galleryImages';
import s from './ProductGallery.module.css';

/**
 * 제품 갤러리 — [대표 사진(4:3)] / [썸네일 줄 | 장수 ‹ ›]
 * 컨트롤은 랜딩 제품 슬라이더와 같은 SliderNav 컴포넌트
 * 규격: 모든 사진이 같은 4:3 칸에 cover로 들어감 → 원본 비율과 무관하게 크기 동일.
 * 사진 장수와 상관없이 항상 같은 구성(대표 칸 + 썸네일 줄 + 장수 ‹ ›) — 페이지마다 높이·모양이 달라지지 않게.
 * 1장이면 01 / 01에 화살표 비활성, 0장이면 슬랫 플레이스홀더 1장을 사진처럼 보여 줌.
 * 상태(현재 장)는 컴포넌트 안에만 둠 — 제품이 바뀌면 부모의 key로 새로 그려져 첫 장부터
 */
export function ProductGallery({ images, name, placeholder }: { images: GalleryImage[]; name: string; placeholder: string }) {
  const [index, setIndex] = useState(0);
  const thumbs = useRef<HTMLUListElement>(null);
  // 사진이 없으면 플레이스홀더 한 장(src 없음)으로 채워 같은 구성을 유지
  const slides: (GalleryImage | null)[] = images.length ? images : [null];
  const stageId = useId(); // aria-controls 연결용 (같은 페이지에 갤러리가 여러 개여도 겹치지 않게)

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

  // 랜딩 슬라이더와 같게: 끝에 닿으면 버튼 비활성 (순환하지 않음)
  const go = (d: number) => setIndex((i) => Math.min(slides.length - 1, Math.max(0, i + d)));
  const cur = slides[index];

  return (
    <div className={s.gallery} role="group" aria-roledescription="갤러리" aria-label={`${name} 사진`}>
      <div className={s.stage} id={stageId}>
        {cur ? (
          // key: 사진이 바뀔 때마다 새로 그려 페이드인
          <img key={cur.src} src={cur.src} alt={cur.alt} className={s.photo} />
        ) : (
          <Media className={s.photo} label={placeholder} />
        )}
      </div>

      {/* 한 줄: [썸네일 (넘치면 가로 스크롤)] [01 / 05 ‹ ›] — 썸네일 높이 = 화살표 높이라 가로선이 맞음 */}
      <div className={s.bar}>
        <ul ref={thumbs} className={s.thumbs}>
          {slides.map((img, i) => (
            <li key={img?.src ?? 'placeholder'}>
              <button
                type="button"
                className={s.thumb}
                onClick={() => setIndex(i)}
                aria-label={`${i + 1}번째 사진 보기${img ? `: ${img.alt}` : ' (사진 준비 중)'}`}
                aria-current={i === index ? 'true' : undefined}
              >
                {img ? <img src={img.src} alt="" loading="lazy" /> : <span className={cx('dh-media', s.thumbEmpty)} />}
              </button>
            </li>
          ))}
        </ul>
        <SliderNav
          current={index}
          total={slides.length}
          onPrev={() => go(-1)}
          onNext={() => go(1)}
          prevDisabled={index === 0}
          nextDisabled={index === slides.length - 1}
          controls={stageId}
          itemLabel="사진"
        />
      </div>
    </div>
  );
}
