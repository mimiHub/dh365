import type { ReactNode } from 'react';
import { FIRE_SAFETY } from '../../data/products';
import { Badge, cx } from '../../components/ui';
import { useReveal } from '../../hooks/useReveal';
import s from './SafetyBand.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * 방화셔터 공통 안전 시스템 — 스크린·철재 상세에 함께 노출 (네이비 밴드)
 *
 * 구성: [헤드라인 | 숫자 요약] → [특허 출원 안전장치 3종 카드] → [장애물 감지 데모 | 안전 브라켓트]
 *      → [연동제어기 음성안내] → [세부 안전 디테일 6] → [모터 용량 스케일 + 특허 등록]
 * 장식(아이콘·애니메이션)은 모두 aria-hidden — 내용은 텍스트로 그대로 읽힘
 */
export function SafetyBand() {
  const f = FIRE_SAFETY;
  const ref = useReveal<HTMLElement>();
  const caps = f.motor.capacities;

  return (
    <section ref={ref} className={s.band} data-theme="dark" aria-labelledby="safety-title">
      <div className={s.decor} aria-hidden="true" />
      <div className={cx('container', s.inner)}>
        {/* ── 헤드라인 + 숫자 요약 ── */}
        <header className={cx(s.head, 'reveal')}>
          <div>
            <p className="dh-eyebrow">SAFETY SYSTEM</p>
            <h3 id="safety-title" className={s.title}>
              3가지 <em>특허 출원 안전장치</em>를<br />기본으로 적용합니다
            </h3>
            <p className={s.lead}>대한방화가 설치하는 방화셔터에는 추락·끼임·고립을 막는 장치가 옵션이 아닌 기본으로 들어갑니다.</p>
          </div>
          <dl className={s.stats}>
            {/* 등록 여부가 확인되지 않은 항목은 '출원'으로만 셈 (카탈로그 p.3) */}
            <div>
              <dt>특허 출원</dt>
              <dd><strong>{f.patents.length}</strong>종</dd>
            </div>
            <div>
              <dt>안전 디테일</dt>
              <dd><strong>{f.details.length}</strong>종</dd>
            </div>
            <div>
              <dt>모터 라인업</dt>
              <dd><strong>{caps.length}</strong>종</dd>
            </div>
          </dl>
        </header>

        {/* ── 특허 출원 안전장치 3종 ── */}
        <ol className={s.patents}>
          {f.patents.map((pt, i) => (
            <li key={pt.title} className={cx(s.patent, 'reveal')} style={{ ['--reveal-delay' as string]: `${i * 100}ms` }}>
              <span className={s.ghost} aria-hidden="true">{pad(i + 1)}</span>
              <span className={s.iconRing} aria-hidden="true">{PATENT_ICONS[i]}</span>
              <p className={s.patentNo}>SAFETY {pad(i + 1)} · 특허 출원</p>
              <h4 className={s.patentTitle}>{pt.title}</h4>
              <p className={s.patentBody}>{pt.body}</p>
            </li>
          ))}
        </ol>

        {/* ── 장애물 감지(데모) + 안전 브라켓트 ── */}
        <div className={s.duo}>
          <article className={cx(s.card, s.obstacle, 'reveal')}>
            <div className={s.cardText}>
              <h4 className={s.cardTitle}>{f.obstacle.title} <Badge tone="fire">{f.obstacle.badge}</Badge></h4>
              <p className={s.cardBody}>{f.obstacle.body}</p>
              <ol className={s.steps}>
                <li><span>1</span>장애물 접촉</li>
                <li><span>2</span>5초 상승 후 정지</li>
                <li><span>3</span>음성 안내</li>
              </ol>
            </div>
            <ObstacleDemo />
          </article>

          <article className={cx(s.card, s.bracket, 'reveal')} style={{ ['--reveal-delay' as string]: '100ms' }}>
            <span className={s.iconRing} aria-hidden="true">{ICON.bracket}</span>
            <h4 className={s.cardTitle}>{f.bracket.title}</h4>
            <p className={s.cardBody}>{f.bracket.body}</p>
            <ul className={s.chips}>
              <li>500K 이상 모터 기본 장착</li>
              <li>방진 러버 기본 적용</li>
              <li>체인 이탈 추락 방지</li>
            </ul>
          </article>
        </div>

        {/* ── 연동제어기 음성안내 ── */}
        <article className={cx(s.card, s.voice, 'reveal')}>
          <div className={s.voiceHead}>
            <span className={s.speaker} aria-hidden="true">
              {ICON.speaker}
              <span className={s.wave}><i /><i /><i /><i /><i /></span>
            </span>
            <h4 className={s.cardTitle}>연동제어기 음성안내 <Badge tone="fire">특허 출원</Badge></h4>
            <p className={s.cardBody}>정전·화재·하강·장애물 등 상황별로 {f.voiceMessages.length}가지 음성으로 알려 대피를 돕습니다.</p>
          </div>
          <ul className={s.bubbles}>
            {f.voiceMessages.map((m) => (
              <li key={m}>“{m}”</li>
            ))}
          </ul>
        </article>

        {/* ── 세부 안전 디테일 ── */}
        <ul className={s.details}>
          {f.details.map((d, i) => (
            <li key={d.title} className={cx(s.detail, 'reveal')} style={{ ['--reveal-delay' as string]: `${(i % 3) * 80}ms` }}>
              <span className={s.detailIcon} aria-hidden="true">{DETAIL_ICONS[i]}</span>
              <div>
                <strong>{d.title}</strong>
                <span>{d.body}</span>
              </div>
            </li>
          ))}
        </ul>

        {/* ── 모터 용량 스케일 + 특허 등록 ── */}
        <div className={cx(s.motor, 'reveal')}>
          <div className={s.motorHead}>
            <p className={s.motorLabel}>DH 모터 시스템</p>
            <p className={s.motorSub}>개구부 크기에 맞춰 {caps[0]} ~ {caps[caps.length - 1]} 중 선택</p>
          </div>
          <ol className={s.scale} aria-label="모터 용량">
            {caps.map((c) => (
              <li key={c}><span className={s.tick} aria-hidden="true" />{c}</li>
            ))}
          </ol>
          <div className={s.cert}>
            <span className={s.certSeal} aria-hidden="true">{ICON.seal}</span>
            <div>
              <p className={s.certNo}>특허 {f.patent.no}</p>
              <p className={s.certTitle}>{f.patent.title} · {f.patent.registered} 등록</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 장애물 감지 동작 데모 — 셔터가 내려오다 장애물에 닿으면 올라가 멈추는 6초 루프 (순수 CSS 애니메이션) */
function ObstacleDemo() {
  return (
    <div className={s.demo} aria-hidden="true">
      <div className={s.demoFrame}>
        <div className={s.demoShutter}>
          <div className={s.demoSlats} />
          <div className={s.demoEdge} />
        </div>
        <div className={s.demoBox2}>
          <span className={s.demoAlert}>삐— 장애물 감지</span>
        </div>
      </div>
      <p className={s.demoCaption}>장애물 감지 → 자동 상승</p>
    </div>
  );
}

// ── 아이콘 (24×24, stroke) ── 장식용이라 모두 aria-hidden 위치에서만 사용
const svg = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const ICON = {
  speaker: svg(<><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" /><path d="M15.5 9a4 4 0 0 1 0 6" /></>),
  shield: svg(<><path d="M12 3 5 6v5.5c0 4.2 2.9 7.9 7 9.5 4.1-1.6 7-5.3 7-9.5V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>),
  up: svg(<><circle cx="12" cy="12" r="8.5" /><path d="M12 16V8M8.5 11.5 12 8l3.5 3.5" /></>),
  bracket: svg(<><path d="M5 4v16M19 4v16" /><path d="M5 8h14M5 16h14" /><circle cx="12" cy="12" r="2" /></>),
  seal: svg(<><circle cx="12" cy="10" r="6" /><path d="m9.5 10 1.8 1.8 3.2-3.6" /><path d="m8.5 15-1.5 6 5-2.5 5 2.5-1.5-6" /></>),
  link: svg(<><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" /><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" /></>),
  chain: svg(<><rect x="8" y="2.5" width="8" height="7" rx="3.5" /><rect x="8" y="14.5" width="8" height="7" rx="3.5" /><path d="M12 8v8" /></>),
  cover: svg(<><rect x="4" y="9" width="16" height="11" rx="2" /><path d="M7 9V7a5 5 0 0 1 10 0v2" /><path d="M9 14h6" /></>),
  flame: svg(<><path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 .3 1.6 1 2.5 2 3 0-3 0-5.5.5-8Z" /><path d="M4 20 20 4" /></>),
  ground: svg(<><path d="M12 3v9" /><path d="M6 12h12M8 15.5h8M10 19h4" /></>),
  box: svg(<><path d="m3.5 7.5 8.5-4 8.5 4v9l-8.5 4-8.5-4v-9Z" /><path d="m3.5 7.5 8.5 4 8.5-4M12 11.5v9" /></>),
};

const PATENT_ICONS = [ICON.speaker, ICON.shield, ICON.up];
// FIRE_SAFETY.details 순서와 맞춤: 방화·방범 연동 / 수동 체인 / 결선 단자 덮개 / 난연 소재 / 바디 접지 / 안전 포장
const DETAIL_ICONS = [ICON.link, ICON.chain, ICON.cover, ICON.flame, ICON.ground, ICON.box];
