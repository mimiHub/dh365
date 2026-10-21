import { ARCHIVES, NOTICES } from '../data/site';
import { MoreLink, cx } from '../components/ui';
import { useReveal } from '../hooks/useReveal';
import s from './News.module.css';

/** 소식·자료실 — Navy 섹션. 왼쪽 공지사항 리스트, 오른쪽 자료실 바로가기 2×2 */
export function News() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="news" data-theme="dark" className={cx('section', s.news)} ref={ref} aria-labelledby="news-title">
      <div className="container">
        <p className="dh-eyebrow reveal">DH NEWS</p>
        <h2 id="news-title" className="dh-heading-title reveal">대한방화 소식</h2>

        <div className={s.cols}>
          <div className={cx(s.col, 'reveal')}>
            <div className={s.colHead}>
              <h3 className={s.colTitle}>공지사항</h3>
              <MoreLink href="#news">MORE</MoreLink>
            </div>
            <ul className={s.notices}>
              {NOTICES.map((n) => (
                <li key={n.id}>
                  <a href="#news" className={s.notice}>
                    <time className={s.date}>{n.date}</time>
                    <span className={s.nTitle}>{n.title}</span>
                    {n.summary && <span className={s.summary}>{n.summary}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={cx(s.col, 'reveal')} style={{ ['--reveal-delay' as string]: '120ms' }}>
            <div className={s.colHead}>
              <h3 className={s.colTitle}>자료실</h3>
            </div>
            <ul className={s.archives}>
              {ARCHIVES.map((a) => (
                <li key={a.label}>
                  <a href={a.href} className={s.archive}>
                    <span className={s.aEn}>{a.en}</span>
                    <span className={s.aKo}>{a.label}</span>
                    <span className={s.aArrow} aria-hidden="true">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
