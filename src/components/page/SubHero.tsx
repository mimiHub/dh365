import type { ReactNode } from 'react';
const defaultImg = '/images/hero-slide-3.jpg';
import { cx } from '../ui';
import s from './SubHero.module.css';

interface Props {
  en: string;
  title: string;
  desc?: string;
  /** 스크린리더에만 붙는 부제 (예: 목록·글쓰기) — 같은 제목의 화면을 구분 */
  sub?: string;
  /** 배경 사진 (기본: 상담 사진). 사진 대신 직접 그린 배경을 쓰려면 bg */
  image?: string;
  bg?: ReactNode;
  /** 사진에서 남길 부분 (object-position) — 기본 '50% 40%'. 건물처럼 아래쪽이 주인공이면 '50% 75%' */
  position?: string;
  /** 아래에 분류 패널(CategoryNav)이 걸칠 때 — 높이를 늘리고 글자를 위로 올림 */
  withNav?: boolean;
}

/** 하위 페이지 공통 히어로 — 시공사례·자료실·견적문의·설계문의·FAQ */
export function SubHero({ en, title, desc, sub, image = defaultImg, bg, position, withNav }: Props) {
  return (
    <section className={cx(s.hero, withNav && s.withNav)} aria-labelledby="sub-hero-title">
      <div className={s.bg} aria-hidden="true">
        {bg ?? <img className={s.photo} src={image} alt="" style={position ? { objectPosition: position } : undefined} />}
      </div>
      <div className={s.text}>
        <p className={s.en}>{en}</p>
        <h1 id="sub-hero-title" className={s.title}>
          {title}
          {sub && <span className="sr-only"> — {sub}</span>}
        </h1>
        {desc && <p className={s.desc}>{desc}</p>}
      </div>
    </section>
  );
}
