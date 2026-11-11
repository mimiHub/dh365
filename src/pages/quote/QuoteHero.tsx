import heroImg from '../../assets/hero-slide-3.jpg';
import s from './QuoteHero.module.css';

/** 견적문의 목록·글쓰기 공용 히어로 */
export function QuoteHero({ sub }: { sub?: string }) {
  return (
    <section className={s.hero} aria-labelledby="quote-hero-title">
      <div className={s.bg} aria-hidden="true">
        <img src={heroImg} alt="" />
      </div>
      <div className={s.text}>
        <p className={s.en}>Estimate</p>
        <h1 id="quote-hero-title" className={s.title}>
          견적문의
          {sub && <span className="sr-only"> — {sub}</span>}
        </h1>
        <p className={s.desc}>현장 규격과 용도를 남겨 주시면 담당자가 검토 후 견적을 안내해 드립니다.</p>
      </div>
    </section>
  );
}
