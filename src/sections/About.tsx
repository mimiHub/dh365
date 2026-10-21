import { useState } from 'react';
import { STRENGTHS } from '../data/site';
import { Media, MoreLink, cx } from '../components/ui';
import { useReveal } from '../hooks/useReveal';
import officesMapImg from '../assets/offices-map.png';
import certFireShutterImg from '../assets/cert-fire-shutter.png';
import caseSamsungOfficeImg from '../assets/case-samsung-office.png';
import s from './About.module.css';

// 강점 항목별 사진. 실제 이미지가 있는 항목만 여기 채우고,
// 나머지는 Media가 라벨(label)만 받아 슬랫 패턴 플레이스홀더로 표시됩니다.
const STRENGTH_IMAGES: Partial<Record<string, string>> = {
  certified: certFireShutterImg, // 90도 오픈형 여닫이 비상문 구조 차연/내화 시험성적서(KICT)
  partner: caseSamsungOfficeImg, // 삼성 오피스 철제방화셔터 시공 현장 사진
  network: officesMapImg, // 본사·부산·광주 지사 위치 지도
};

// 문서(시험성적서·지도)는 cover로 자르면 글자가 잘려 contain 처리가 필요하지만,
// 이건 실제 현장 '사진'이라 다른 둘처럼 .docMedia(contain)를 쓰지 않고 기본 cover를 그대로 씁니다.
const DOC_IMAGE_KEYS = new Set(['certified', 'network']);

/** 회사소개 — 큰 영문 슬로건 + 인사말 요약 + 강점 3가지(왼쪽 목록 ↔ 오른쪽 이미지 전환) */
export function About() {
  const [active, setActive] = useState(0);
  const ref = useReveal<HTMLElement>();
  const cur = STRENGTHS[active];

  return (
    <section id="about" className="section" ref={ref} aria-labelledby="about-title">
      <div className="container">
        <p className={cx('dh-eyebrow', 'reveal')}>ABOUT US</p>
        <h2 id="about-title" className={cx(s.slogan, 'reveal')}>
          <span>BEST QUALITY,</span>
          <span>BEST SERVICE,</span>
          <span className={s.em}>BEST ENGINEER.</span>
        </h2>

        <div className={cx(s.intro, 'reveal')}>
          <p className={s.lead}>
            가장 좋은 자재, 성실 시공으로
            <br />
            항상 고객님의 성원에 보답하겠습니다.
          </p>
          <div>
            <p className={s.body}>
              (주)대한방화는 국내 대형 건설사와 협업하며 방화스크린셔터를 포함한 방화·방범 셔터를 전문으로 설계·시공하는
              금속창호공사 전문회사입니다. 방화셔터 인정 승인을 완료한 제품으로 설계·시공합니다.
            </p>
            <MoreLink href="#about" className={s.more}>회사소개</MoreLink>
          </div>
        </div>

        <div className={s.strengths}>
          <ol className={s.list}>
            {STRENGTHS.map((item, i) => (
              <li key={item.key} className={cx(s.item, i === active && s.itemOn, 'reveal')} style={{ ['--reveal-delay' as string]: `${i * 80}ms` }}>
                <button type="button" className={s.itemHead} aria-expanded={i === active} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)}>
                  <span className={s.no}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={s.itemTitle}>{item.title}</span>
                </button>
                <div className={s.itemBody}>
                  <div>
                    <p>{item.body}</p>
                    <ul className={s.points}>
                      {item.points.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div className={cx(s.figure, 'reveal')}>
            <Media
              key={cur.key}
              className={cx(s.media, DOC_IMAGE_KEYS.has(cur.key) && s.docMedia)}
              src={STRENGTH_IMAGES[cur.key]}
              alt={STRENGTH_IMAGES[cur.key] ? cur.title : undefined}
              label={`IMAGE — ${cur.title}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
