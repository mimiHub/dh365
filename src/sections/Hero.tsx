import { useCallback, useEffect, useState } from 'react';
import { HERO_SLIDES } from '../data/site';
import { Button, cx } from '../components/ui';
import heroSlide1Img from '../assets/hero-slide-1.png';
import heroSlide3Img from '../assets/hero-slide-3.jpg';
import logoImg from '../assets/logo.png';
import s from './Hero.module.css';

const DURATION = 6000;
const pad = (n: number) => String(n).padStart(2, '0');

// 슬라이드별 배경 사진. 실제 이미지가 있는 슬라이드(인덱스 기준)만 채우고,
// 나머지는 기존 네이비 그라데이션 배경을 그대로 씁니다.
const HERO_IMAGES: Partial<Record<number, string>> = {
  0: heroSlide1Img,
  2: heroSlide3Img,
};

// 2번(대형 방화스크린셔터) 슬라이드는 사진 대신 '인정 사이즈 도면' 애니메이션
// 수치 출처: 기존 사이트 공지 '방화셔터(스크린) 대형화(12m x 8.5m) 인정서 발급 안내'
const SPEC_SLIDE = 1;

/**
 * 메인 비주얼 — 페이드 슬라이드 + 자동재생(일시정지 버튼 필수: WCAG 2.2.2).
 * 배경 사진/영상 자리는 .visual — 지금은 네이비 그라데이션 + 내려오는 셔터 그래픽.
 * 실사진 배경은 켄번즈 효과(천천히 확대)로 정적인 사진에도 생동감을 줌.
 */
export function Hero() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const total = HERO_SLIDES.length;

  const go = useCallback((n: number) => setIndex((n + total) % total), [total]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => go(index + 1), DURATION);
    return () => window.clearTimeout(id);
  }, [index, playing, go]);

  return (
    <section className={s.hero} id="top" aria-roledescription="carousel" aria-label="메인 비주얼">
      <div className={cx(s.visual, HERO_IMAGES[index] && s.hasPhoto)} aria-hidden="true">
        {HERO_IMAGES[index] ? (
          <img key={index} src={HERO_IMAGES[index]} alt="" className={s.bgImg} />
        ) : index === SPEC_SLIDE ? (
          // 개구부(점선) → 스크린이 내려옴 → 가로·세로 치수선이 그려지고 수치가 나타남
          <div key={index} className={s.specWrap}>
            {/* 배경: 천천히 떠다니는 블루 빛 (단색 배경이 허전하지 않게) */}
            <div className={s.aurora} />
            <div className={s.spec}>
              <div className={s.opening}>
                {/* 스크린 너머의 불빛 — 스크린이 내려오며 가려짐 = '화염 차단' */}
                <div className={s.glow} />
                <div className={s.screen}>
                  {/* 원단에 인쇄된 회사 로고 — 스크린과 함께 내려옴 (장식이라 alt 비움, 상위가 aria-hidden) */}
                  <img src={logoImg} alt="" className={s.screenLogo} />
                  <div className={s.screenRail} />
                </div>
              </div>
              <div className={s.dimW}>
                <span className={s.dimLabel}>12,000<small>mm</small></span>
              </div>
              <div className={s.dimH}>
                <span className={s.dimLabel}>8,500<small>mm</small></span>
              </div>
            </div>
          </div>
        ) : (
          // 사진이 없을 때만 장식용 셔터 하강 그래픽 — 실제 사진 위에 겹치면 이중으로 보여서 뺌
          // key가 바뀌면 다시 마운트 → 셔터 하강 애니메이션 재생
          <div key={index} className={s.shutter}>
            <div className={s.slats} />
            <div className={s.rail} />
          </div>
        )}
      </div>

      <div className={cx('container', s.inner)}>
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.eyebrow}
            className={cx(s.slide, i === index && s.active)}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${total}`}
            aria-hidden={i !== index}
          >
            <p className={s.eyebrow}>{slide.eyebrow}</p>
            <h2 className={s.title}>
              {slide.title.map((line) => (
                <span key={line} className={s.line}>{line}</span>
              ))}
            </h2>
            <p className={s.desc}>{slide.description}</p>
            <div className={s.actions}>
              <Button href="#products" variant="ghost" arrow tabIndex={i === index ? 0 : -1}>제품 보기</Button>
              <Button href="#contact" tabIndex={i === index ? 0 : -1}>견적문의</Button>
            </div>
          </div>
        ))}

        <div className={s.controls}>
          <span className={s.num}>{pad(index + 1)}</span>
          <span className={s.bar}>
            <span key={`${index}-${playing}`} className={cx(s.fill, playing && s.running)} style={{ animationDuration: `${DURATION}ms` }} />
          </span>
          <span className={s.num}>{pad(total)}</span>
          <button type="button" className={s.ctrl} onClick={() => go(index - 1)} aria-label="이전 슬라이드">‹</button>
          <button type="button" className={s.ctrl} onClick={() => setPlaying((p) => !p)} aria-label={playing ? '자동재생 정지' : '자동재생 시작'}>
            {playing ? '❚❚' : '▶'}
          </button>
          <button type="button" className={s.ctrl} onClick={() => go(index + 1)} aria-label="다음 슬라이드">›</button>
        </div>
      </div>

      <a href="#about" className={s.scroll}>SCROLL</a>
    </section>
  );
}
