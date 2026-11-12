import { ARCHIVES } from '../data/site';
import { NOTICES, noticePath } from '../data/notices';

// 메인에는 3건 — 고정 공지 먼저, 그다음 최신 순
const LATEST = [...NOTICES].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned)).slice(0, 3);
import { MoreLink, SmartLink, cx } from '../components/ui';
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
              <MoreLink href={noticePath()}>MORE</MoreLink>
            </div>
            <ul className={s.notices}>
              {LATEST.map((n) => (
                <li key={n.id}>
                  <SmartLink href={noticePath(n.id)} className={s.notice}>
                    {/* 등록일을 받으면 날짜, 그 전엔 고정 공지만 'NOTICE' 표시 */}
                    {n.date ? <time className={s.date}>{n.date}</time> : n.pinned && <span className={s.date}>NOTICE</span>}
                    <span className={s.nTitle}>{n.title}</span>
                    {n.body && <span className={s.summary}>{n.body.split('\n')[0]}</span>}
                  </SmartLink>
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
                  <SmartLink href={a.href} className={s.archive}>
                    <span className={s.aEn}>{a.en}</span>
                    <span className={s.aKo}>{a.label}</span>
                    <span className={s.aArrow} aria-hidden="true">→</span>
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
