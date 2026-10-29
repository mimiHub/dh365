import { useState, type ReactNode } from 'react';
import { FIRE_SAFETY } from '../../data/products';
import { Badge, cx } from '../../components/ui';
import { useReveal } from '../../hooks/useReveal';
import shutterPhoto from '../../assets/product-screen-shutter.png';
import bandPhoto from '../../assets/banner-steel-shutter.jpg';
import s from './SafetyBand.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * 방화셔터 공통 안전 시스템 — 스크린·철재 상세, 제품 특징 바로 아래
 *
 * 레이아웃: 체크무늬 2×2 (사진 띠는 SafetyDetails — 바로 아래에 이어 붙임)
 *   [흰 글 패널: 제목 + 특허 출원 3종 아코디언] [어두운 비주얼: 빛나는 동심원 + 아이콘 3개]
 *   [사진 비주얼: 장애물 감지 데모]            [흰 글 패널: 안전 브라켓트 · 음성안내]
 * 글 패널과 비주얼 패널을 엇갈려 배치해 리듬을 만들고, 아코디언 선택이 오른쪽 그래픽과 연동돼 '살아 있는' 느낌.
 * 장식(그래픽·애니메이션)은 모두 aria-hidden — 내용은 텍스트로 그대로 읽힘
 */
export function SafetyBand() {
  const f = FIRE_SAFETY;
  const ref = useReveal<HTMLElement>();
  const [patent, setPatent] = useState(0); // 아코디언에서 열린 특허 출원 항목

  return (
    <section ref={ref} className={s.band} aria-labelledby="safety-title">
      <div className={cx('container', s.grid)}>
        {/* ① 흰 글 패널 — 제목 + 특허 출원 3종 아코디언 */}
        <div className={cx(s.panel, s.light, 'reveal')}>
          <p className={s.eyebrow}>SAFETY SYSTEM</p>
          <h3 id="safety-title" className={s.title}>
            3가지 <em>특허 출원</em>
            <br />
            안전장치 기본 적용
          </h3>
          <p className={s.lead}>대한방화가 설치하는 방화셔터에는 추락·끼임·고립을 막는 장치가 옵션이 아닌 기본으로 들어갑니다.</p>

          <ul className={s.accordion}>
            {f.patents.map((pt, i) => {
              const open = i === patent;
              return (
                <li key={pt.title} className={cx(s.accItem, open && s.accOpen)}>
                  <button type="button" className={s.accHead} aria-expanded={open} aria-controls={`patent-${i}`} onClick={() => setPatent(i)}>
                    <span className={s.accNo}>{pad(i + 1)}</span>
                    {pt.title}
                    <span className={s.accChevron} aria-hidden="true" />
                  </button>
                  <div id={`patent-${i}`} className={s.accBody} role="region" aria-label={pt.title}>
                    <div>
                      <p>{pt.body}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ② 어두운 비주얼 — 빛나는 동심원, 아코디언에서 고른 항목의 아이콘이 함께 빛남 */}
        <div className={cx(s.panel, s.visual, s.rings)} aria-hidden="true">
          <div className={s.ringWrap}>
            <span className={cx(s.ring, s.r1)} />
            <span className={cx(s.ring, s.r2)} />
            <span className={cx(s.ring, s.r3)} />
            <span className={s.ringDash} />
            <div className={s.core}>
              <span className={s.coreLabel}>Fire Shutter</span>
              <strong className={s.coreTitle}>SAFETY</strong>
              <span className={s.coreSub}>특허 출원 {f.patents.length}종</span>
            </div>
            {PATENT_ICONS.map((icon, i) => (
              <span key={i} className={cx(s.node, s[`n${i}`], i === patent && s.nodeOn)}>
                {icon}
              </span>
            ))}
          </div>
        </div>

        {/* ③ 사진 비주얼 — 장애물 감지 데모 */}
        <div className={cx(s.panel, s.visual, s.photoPanel)}>
          <img className={s.panelPhoto} src={shutterPhoto} alt="" aria-hidden="true" loading="lazy" />
          <div className={s.photoInner}>
            <p className={s.eyebrowLight}>OBSTACLE SENSOR</p>
            <h4 className={s.photoTitle}>
              {f.obstacle.title} <Badge tone="fire">{f.obstacle.badge}</Badge>
            </h4>
            <ObstacleDemo />
            <ol className={s.steps}>
              <li><span>1</span>장애물 접촉</li>
              <li><span>2</span>5초 상승 후 정지</li>
              <li><span>3</span>음성 안내</li>
            </ol>
            <p className="sr-only">{f.obstacle.body}</p>
          </div>
        </div>

        {/* ④ 흰 글 패널 — 안전 브라켓트 + 음성안내 */}
        <div className={cx(s.panel, s.light, s.alignEnd, 'reveal')}>
          <p className={s.eyebrow}>SMART CONTROL</p>
          <h3 className={cx(s.title, s.titleAlt)}>
            추락은 막고
            <br />
            <em>상황은 알립니다</em>
          </h3>
          <p className={s.lead}>{f.bracket.body}</p>

          <p className={s.cellHead}>
            <span className={s.cellIcon} aria-hidden="true">{ICON.bracket}</span>
            {f.bracket.title}
          </p>
          <ul className={s.cells}>
            <li>500K 이상 모터<br /><b>기본 장착</b></li>
            <li>체인 처짐 방지<br /><b>방진 러버</b></li>
            <li>체인 이탈 시<br /><b>추락 방지</b></li>
          </ul>

          <p className={s.cellHead}>
            <span className={s.cellIcon} aria-hidden="true">{ICON.speaker}</span>
            연동제어기 음성안내 <Badge tone="fire">특허 출원</Badge>
            <span className={s.wave} aria-hidden="true"><i /><i /><i /><i /><i /></span>
          </p>
          <ul className={s.voice}>
            {f.voiceMessages.map((m) => (
              <li key={m}>“{m}”</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/**
 * 세부 안전 설계 — 사진 배경 띠 (세부 디테일 6 알약 탭 + 선택 디테일·모터·특허 유리 카드)
 * 체크무늬(SafetyBand) 바로 아래에 붙여 한 쌍으로 씀 (제품 특징 다음).
 * 상태가 서로 독립이라 컴포넌트를 나눠 둠 — 배치를 바꿀 때 JSX 줄만 옮기면 됨
 */
export function SafetyDetails() {
  const f = FIRE_SAFETY;
  const [detail, setDetail] = useState(0); // 고른 세부 디테일
  const caps = f.motor.capacities;

  return (
    <section className={s.strip} aria-labelledby="safety-details-title">
      <img className={s.stripPhoto} src={bandPhoto} alt="" aria-hidden="true" loading="lazy" />
      <div className={cx('container', s.stripInner)}>
        <div className={s.pillsCol}>
          <p className={s.eyebrowLight}>SAFETY DETAILS</p>
          <h3 id="safety-details-title" className={s.stripTitle}>세부 안전 설계</h3>
          <ul className={s.pills} role="tablist" aria-label="세부 안전 설계">
            {f.details.map((d, i) => (
              <li key={d.title}>
                <button
                  type="button"
                  role="tab"
                  id={`detail-tab-${i}`}
                  aria-selected={i === detail}
                  aria-controls="detail-panel"
                  className={s.pill}
                  onClick={() => setDetail(i)}
                >
                  {d.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={s.glassRow}>
          <article id="detail-panel" role="tabpanel" aria-labelledby={`detail-tab-${detail}`} className={cx(s.glass, s.glassMain)} key={detail}>
            <span className={s.glassIcon} aria-hidden="true">{DETAIL_ICONS[detail]}</span>
            <p className={s.glassNo}>DETAIL {pad(detail + 1)} / {pad(f.details.length)}</p>
            <h5 className={s.glassTitle}>{f.details[detail].title}</h5>
            <p className={s.glassBody}>{f.details[detail].body}</p>
          </article>

          <article className={s.glass}>
            <p className={s.glassNo}>DH MOTOR SYSTEM</p>
            <h5 className={s.glassTitle}>모터 라인업 {caps.length}종</h5>
            <ol className={s.scale} aria-label="모터 용량">
              {caps.map((c) => (
                <li key={c}><span className={s.tick} aria-hidden="true" />{c}</li>
              ))}
            </ol>
            <p className={s.glassBody}>개구부 크기에 맞춰 {caps[0]} ~ {caps[caps.length - 1]} 중 선택합니다.</p>
          </article>

          <article className={s.glass}>
            <span className={cx(s.glassIcon, s.gold)} aria-hidden="true">{ICON.seal}</span>
            <p className={s.glassNo}>PATENT</p>
            <h5 className={s.glassTitle}>특허 {f.patent.no}</h5>
            <p className={s.glassBody}>{f.patent.title}<br />{f.patent.registered} 등록</p>
          </article>
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
