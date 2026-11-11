import heroImg from '../../assets/hero-slide-3.jpg';
import type { Board } from './boards';
import s from './QuoteHero.module.css';

/** 문의 게시판(견적문의·설계문의) 목록·글쓰기·상세 공용 히어로 */
export function QuoteHero({ board, sub }: { board: Board; sub?: string }) {
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
