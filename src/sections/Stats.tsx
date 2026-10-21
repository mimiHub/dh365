import { STATS } from '../data/site';
import { MoreLink, StatItem, cx } from '../components/ui';
import { useReveal } from '../hooks/useReveal';
import s from './Stats.module.css';

/** Navy 섹션 — data-theme="dark" 하나로 안쪽 토큰이 전부 네이비 값으로 바뀝니다 */
export function Stats() {
  const ref = useReveal<HTMLElement>();
  return (
    <section data-theme="dark" className={cx('section', s.stats)} ref={ref} aria-labelledby="stats-title">
      <div className={s.deco} aria-hidden="true" />
      <div className={cx('container', s.inner)}>
        <div className={cx(s.head, 'reveal')}>
          <p className="dh-eyebrow">CERTIFIED SIZE</p>
          <h2 id="stats-title" className="dh-heading-title">
            대형 방화스크린셔터,
            <br />
            <em>인정 규격</em>이 넓어졌습니다
          </h2>
          <p className="dh-heading-desc">
            기존 8,000 × 4,000으로 한정되던 방화스크린셔터 인정 규격이 대폭 상향되었습니다.
            철재방화셔터는 기존 8,000 × 4,000 그대로입니다.
          </p>
          <MoreLink href="#news" className={s.more}>공지 보기</MoreLink>
        </div>
        <div className={s.grid}>
          {STATS.map((st, i) => (
            <div key={st.label} className="reveal" style={{ ['--reveal-delay' as string]: `${i * 80}ms` }}>
              <StatItem value={st.value} unit={st.unit} label={st.label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
