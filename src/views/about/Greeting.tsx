const glassImg = '/images/about-glass.jpg';
const signatureImg = '/images/ceo-signature.png';
import { COMPANY, NAV, STATS } from '../../data/site';
import { GREETING, VALUES } from '../../data/about';
import { Button, CountUp, SmartLink, StatItem, cx } from '../../components/ui';
import { useReveal } from '../../hooks/useReveal';
import { CtaBand, InfoList } from '../../components/page';
import s from './About.module.css';

// 사업 분야 = 메뉴의 제품소개 하위 메뉴 그대로 (메뉴가 바뀌면 여기도 같이 바뀜)
const BUSINESS = NAV.find((n) => n.label === '제품소개')?.children ?? [];

const OVERVIEW = [
  { label: '회사명', value: `${COMPANY.name} (${COMPANY.nameEn})` },
  { label: '대표이사', value: COMPANY.ceo },
  { label: '사업분야', value: '방화·방범 셔터 설계 및 시공 (금속창호공사)' },
  { label: '사업자번호', value: COMPANY.bizNo },
  { label: '사업장', value: COMPANY.offices.map((o) => o.label).join(' · ') },
  { label: '대표전화', value: <a href={`tel:${COMPANY.tel}`}>{COMPANY.tel}</a> },
];

/** 회사소개 > 인사말 — 인사말 / 핵심 가치 / 숫자로 보는 대한방화 / 사업 분야 / 문의 */
export function Greeting() {
  // 안의 .reveal 요소들이 화면에 들어올 때 하나씩 data-revealed → CSS 전환 (스크롤 등장)
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref}>
      {/* 인사말 + 회사 개요 */}
      <section className={cx('container', s.narrow, s.greeting)} aria-labelledby="greeting-title">
        <div className={s.message}>
          <p className={cx('dh-eyebrow', 'reveal')}>{GREETING.eyebrow}</p>
          {/* 줄마다 가림막(overflow hidden) 안에서 아래→위로 올라옴 */}
          <h2 id="greeting-title" className={cx(s.headline, s.mask, 'reveal')}>
            <span className={s.line}>
              <span>{GREETING.headline[0]}</span>
            </span>
            <span className={s.line}>
              <em style={{ ['--line-delay' as string]: '120ms' }}>{GREETING.headline[1]}</em>
            </span>
          </h2>
          <div className={cx(s.letter, 'reveal')}>
            {GREETING.body.map((p, i) => (
              <p key={p} className="reveal" style={{ ['--reveal-delay' as string]: `${150 + i * 90}ms` }}>
                {p}
              </p>
            ))}
          </div>
          <p className={cx(s.sign, 'reveal')}>
            {GREETING.sign.role}
            <strong className={s.signName}>
              {GREETING.sign.name}
              {/* 이름 뒤에 겹쳐 놓는 친필 서명 — 이름이 이미 글자로 있으니 장식(alt 비움) */}
              <img className={s.signature} src={signatureImg} alt="" aria-hidden="true" />
            </strong>
          </p>
        </div>
        <aside className={cx(s.overview, s.fromRight, 'reveal')} style={{ ['--reveal-delay' as string]: '200ms' }} aria-labelledby="overview-title">
          <h3 id="overview-title" className={s.overviewTitle}>회사 개요</h3>
          <InfoList variant="card" rows={OVERVIEW} />
        </aside>
      </section>

      {/* 핵심 가치 */}
      <section className={cx('container', s.narrow, s.section)} aria-labelledby="values-title">
        <p className={cx('dh-eyebrow', 'reveal')}>CORE VALUES</p>
        <h2 id="values-title" className={cx(s.h2, 'reveal')}>대한방화가 지키는 세 가지</h2>
        <ol className={s.values}>
          {VALUES.map((v, i) => (
            <li key={v.key} className={cx(s.value, s.pop, 'reveal')} style={{ ['--reveal-delay' as string]: `${i * 120}ms` }}>
              <span className={s.valueNo}>{String(i + 1).padStart(2, '0')}</span>
              <p className={s.valueEn}>{v.en}</p>
              <h3 className={s.valueTitle}>{v.title}</h3>
              <p className={s.valueBody}>{v.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 숫자로 보는 대한방화 — 다크 테마 토큰으로 StatItem 색이 자동 반전 */}
      <section data-theme="dark" className={cx(s.statsBand, 'reveal')} aria-labelledby="stats-title">
        <img className={s.statsBg} src={glassImg} alt="" aria-hidden="true" loading="lazy" />
        <div className={cx('container', s.narrow, s.statsInner)}>
          <p className={cx('dh-eyebrow', 'reveal')}>IN NUMBERS</p>
          <h2 id="stats-title" className={cx(s.h2, 'reveal')}>숫자로 보는 대한방화</h2>
          <div className={s.stats}>
            {STATS.map((st, i) => (
              <div key={st.label} className="reveal" style={{ ['--reveal-delay' as string]: `${i * 110}ms` }}>
                {/* 화면에 들어오면 0부터 올라감 */}
                <StatItem value={<CountUp value={st.value} />} unit={st.unit} label={st.label} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 사업 분야 */}
      <section className={cx('container', s.narrow, s.section)} aria-labelledby="business-title">
        <p className={cx('dh-eyebrow', 'reveal')}>BUSINESS</p>
        <h2 id="business-title" className={cx(s.h2, 'reveal')}>사업 분야</h2>
        <ul className={s.business}>
          {BUSINESS.map((b, i) => (
            <li key={b.href} className={cx(s.fromLeft, 'reveal')} style={{ ['--reveal-delay' as string]: `${i * 70}ms` }}>
              <SmartLink href={b.href} className={s.biz}>
                <span>{b.label}</span>
                <span className={s.bizArrow} aria-hidden="true">→</span>
              </SmartLink>
            </li>
          ))}
        </ul>
      </section>

      <div className={cx('container', s.narrow, s.cta, s.zoomIn, 'reveal')}>
        <CtaBand
          title="현장에 맞는 방화셔터, 대한방화와 상의하세요"
          desc={
            <>
              견적·설계 문의를 남기시거나 대표번호 <a href={`tel:${COMPANY.tel}`}>{COMPANY.tel}</a>로 연락 주세요.
            </>
          }
          actions={
            <>
              <Button href="/quote/write" arrow>견적문의</Button>
              <Button href="/design/write" variant="secondary">설계문의</Button>
            </>
          }
        />
      </div>
    </div>
  );
}
