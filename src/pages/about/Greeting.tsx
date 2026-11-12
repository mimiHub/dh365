import glassImg from '../../assets/about-glass.jpg';
import { COMPANY, NAV, STATS } from '../../data/site';
import { GREETING, VALUES } from '../../data/about';
import { Button, SmartLink, StatItem, cx } from '../../components/ui';
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
  return (
    <>
      {/* 인사말 + 회사 개요 */}
      <section className={cx('container', s.narrow, s.greeting)} aria-labelledby="greeting-title">
        <div className={s.message}>
          <p className="dh-eyebrow">{GREETING.eyebrow}</p>
          <h2 id="greeting-title" className={s.headline}>
            {GREETING.headline[0]}
            <br />
            <em>{GREETING.headline[1]}</em>
          </h2>
          <div className={s.letter}>
            {GREETING.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className={s.sign}>
            {GREETING.sign.role}
            <strong>{GREETING.sign.name}</strong>
          </p>
        </div>
        <aside className={s.overview} aria-labelledby="overview-title">
          <h3 id="overview-title" className={s.overviewTitle}>회사 개요</h3>
          <InfoList variant="card" rows={OVERVIEW} />
        </aside>
      </section>

      {/* 핵심 가치 */}
      <section className={cx('container', s.narrow, s.section)} aria-labelledby="values-title">
        <p className="dh-eyebrow">CORE VALUES</p>
        <h2 id="values-title" className={s.h2}>대한방화가 지키는 세 가지</h2>
        <ol className={s.values}>
          {VALUES.map((v, i) => (
            <li key={v.key} className={s.value}>
              <span className={s.valueNo}>{String(i + 1).padStart(2, '0')}</span>
              <p className={s.valueEn}>{v.en}</p>
              <h3 className={s.valueTitle}>{v.title}</h3>
              <p className={s.valueBody}>{v.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 숫자로 보는 대한방화 — 다크 테마 토큰으로 StatItem 색이 자동 반전 */}
      <section data-theme="dark" className={s.statsBand} aria-labelledby="stats-title">
        <img className={s.statsBg} src={glassImg} alt="" aria-hidden="true" loading="lazy" />
        <div className={cx('container', s.narrow, s.statsInner)}>
          <p className="dh-eyebrow">IN NUMBERS</p>
          <h2 id="stats-title" className={s.h2}>숫자로 보는 대한방화</h2>
          <div className={s.stats}>
            {STATS.map((st) => (
              <StatItem key={st.label} value={st.value} unit={st.unit} label={st.label} />
            ))}
          </div>
        </div>
      </section>

      {/* 사업 분야 */}
      <section className={cx('container', s.narrow, s.section)} aria-labelledby="business-title">
        <p className="dh-eyebrow">BUSINESS</p>
        <h2 id="business-title" className={s.h2}>사업 분야</h2>
        <ul className={s.business}>
          {BUSINESS.map((b) => (
            <li key={b.href}>
              <SmartLink href={b.href} className={s.biz}>
                <span>{b.label}</span>
                <span className={s.bizArrow} aria-hidden="true">→</span>
              </SmartLink>
            </li>
          ))}
        </ul>
      </section>

      <div className={cx('container', s.narrow, s.cta)}>
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
    </>
  );
}
