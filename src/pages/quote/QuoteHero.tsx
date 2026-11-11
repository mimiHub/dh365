import heroImg from '../../assets/hero-slide-3.jpg';
import type { Board } from './boards';
import s from './QuoteHero.module.css';

/** 고객센터 계열 공용 히어로 — 견적문의·설계문의(목록·글쓰기·상세)·FAQ. 필요한 건 영문·제목·설명 셋뿐이라 Board 전체가 아니라 그 셋만 받음 */
export function QuoteHero({ board, sub }: { board: Pick<Board, 'en' | 'title' | 'desc'>; sub?: string }) {
  return (
    <section className={s.hero} aria-labelledby="quote-hero-title">
      <div className={s.bg} aria-hidden="true">
        <img src={heroImg} alt="" />
      </div>
      <div className={s.text}>
        <p className={s.en}>{board.en}</p>
        <h1 id="quote-hero-title" className={s.title}>
          {board.title}
          {sub && <span className="sr-only"> — {sub}</span>}
        </h1>
        <p className={s.desc}>{board.desc}</p>
      </div>
    </section>
  );
}
