import { Fragment, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  FIRE_SAFETY,
  PRODUCT_CATEGORIES,
  getCategory,
  getProduct,
  groupOf,
  productPath,
  productsOf,
  type ProductCategory,
  type ProductDetail,
} from '../data/products';
import { COMPANY } from '../data/site';
import { Badge, Button, Media, cx } from '../components/ui';
import { Contact } from '../sections/Contact';
import steelShutterImg from '../assets/product-steel-shutter.png';
import screenShutterImg from '../assets/product-screen-shutter.png';
import windShutterImg from '../assets/product-wind-shutter.png';
import securityShutterImg from '../assets/product-security-shutter.png';
import geumgokImg from '../assets/case-wind-geumgok-foodzone.png';
import pipeImg from '../assets/case-security-pipe.png';
import waveImg from '../assets/case-security-wave.png';
import speedDoorImg from '../assets/product-speed-door.jpg';
import speedDoorRedImg from '../assets/product-speed-door-red.jpg';
import steelBannerImg from '../assets/banner-steel-shutter.jpg';
import aluminumBannerImg from '../assets/banner-aluminum-shutter.jpg';
import screenBannerImg from '../assets/banner-screen-shutter.jpg';
import overheadBannerImg from '../assets/banner-overhead-door.jpg';
import overheadDoorImg from '../assets/product-overhead-door.jpg';
import aluminumCardImg from '../assets/card-aluminum-shutter.jpg';
import steelDrawingImg from '../assets/drawing-steel-shutter.png';
import s from './ProductPage.module.css';

// 이미지는 데이터(products.ts)와 분리 — 사진이 정해지면 여기만 채우면 됨. 없으면 Media가 슬랫 플레이스홀더
const PRODUCT_IMAGES: Partial<Record<string, string>> = {
  screen: screenShutterImg,
  steel: steelShutterImg,
  'al-wind': windShutterImg,
  'al-wind-insulated': geumgokImg, // 인천 금곡동 푸드존 단열내풍압셔터 현장
  'pipe-single': pipeImg,
  'steel-security': securityShutterImg,
  wave: waveImg,
  'speed-door': speedDoorRedImg, // 레드 스피드도어 정면
  'overhead-door': overheadDoorImg, // 실내 오버헤드도어 정면
};
const HERO_IMAGES: Partial<Record<ProductCategory, string>> = {
  screen: screenShutterImg,
  steel: steelShutterImg,
  aluminum: aluminumCardImg, // 알루미늄셔터 정면 (하단 통풍 슬랫)
  'speed-door': speedDoorRedImg,
  'overhead-door': overheadDoorImg,
};
// 히어로 배너 전용 사진 — 가로로 긴 와이드 컷. 없으면 카드 사진(HERO_IMAGES)을 배너로도 씀
const BANNER_IMAGES: Partial<Record<ProductCategory, string>> = {
  screen: screenBannerImg, // 스크린방화셔터 (와이드)
  steel: steelBannerImg, // 물류센터 철재방화셔터 (와이드)
  aluminum: aluminumBannerImg, // 알루미늄셔터 2연 (와이드)
  'speed-door': speedDoorImg, // 물류센터 외벽 스피드도어 (와이드)
  'overhead-door': overheadBannerImg, // 물류창고 오버헤드도어 개방 (와이드)
};

// 제품 구조도(도면) — 있으면 사양표 옆에 나란히. caption은 도면 기준 치수 안내
const DRAWINGS: Partial<Record<string, { src: string; caption: string }>> = {
  steel: { src: steelDrawingImg, caption: '예시 도면 · 개구부 3,000 × 3,000mm 기준' },
};

// 가로로 긴 사진을 정사각형·4:3 칸에 넣을 때 남길 위치 (기본은 가운데)
const IMAGE_POSITION: Partial<Record<string, string>> = {
  // 'overhead-door': '30% 50%',  ← 예: 왼쪽이 보이게
};

const pad = (n: number) => String(n).padStart(2, '0');
const mm = (n: number) => n.toLocaleString('ko-KR');

/** '*강조*' 표기를 <em>으로 — 데이터에 HTML을 넣지 않고(dangerouslySetInnerHTML 없이) 강조만 표현 */
function Highlight({ text }: { text: string }) {
  return (
    <>
      {text.split('*').map((part, i) => (i % 2 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>))}
    </>
  );
}

/**
 * CSS 미디어쿼리를 JS에서도 같은 기준으로 읽음. useSyncExternalStore: 브라우저 상태(화면 폭)를 React에 구독시키는 표준 방법
 * — resize마다 state를 갱신하는 것보다 정확하고, 경계값을 넘을 때만 리렌더됨
 */
const MOBILE = '(max-width: 767px)'; // ProductPage.module.css 모바일 구간과 같은 값
function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
  );
}

/**
 * 제품소개 — 코아드 제품 페이지 구성
 * [히어로: 제품소개] → [히어로에 걸친 카테고리 카드 ‹ ›] → [강조 문장] → [하위 탭: 구분·제품] → [선택한 제품 상세] → [견적상담]
 *
 * 카테고리 이동은 카드가 맡음(별도 탭 바 없음). 탭 바를 대메뉴 바로 밑에 두면
 * 대메뉴 호버 시 열리는 메가메뉴가 탭을 덮어서, 메뉴 영역을 하나로 정리함.
 *
 * 선택 상태를 useState가 아니라 URL(/products/aluminum/wave)에 둠:
 * 새로고침·공유·뒤로가기에도 같은 제품이 보이고, 메뉴에서 바로 특정 제품으로 들어올 수 있음.
 */
export function ProductPage() {
  const { category: catKey, slug } = useParams();
  const navigate = useNavigate();
  const track = useRef<HTMLUListElement>(null);
  const single = useMediaQuery(MOBILE); // 모바일: 카드 한 장씩

  const category = getCategory(catKey);
  // 선택 제품 → 그 제품이 속한 구분 순으로 정해짐 (하위 탭의 선택 상태도 URL 하나로 결정)
  const product = (slug && category?.slugs.includes(slug) ? getProduct(slug) : undefined) ?? (category && getProduct(category.slugs[0]));
  const group = category && product ? groupOf(category, product.slug) : undefined;
  const catIndex = PRODUCT_CATEGORIES.findIndex((c) => c.key === category?.key);

  /**
   * 카드 트랙 — 한 화면에 4장(CSS --visible). 넘치면 ‹ ›로 한 칸씩 이동.
   * PC·태블릿: 화살표는 '선택'이 아니라 '보기'를 옮김(코아드 방식). 선택은 카드를 눌러서.
   * 모바일(한 장씩): 보이는 카드 = 선택된 카드. 화살표·스와이프가 곧 카테고리 선택
   *   (한 장만 보이는데 흐린 비선택 카드가 보이면 무엇이 선택됐는지 알 수 없어서)
   * 끝에 닿았는지는 스크롤 위치에서 읽어 옴 — 스와이프와 버튼이 같은 스크롤을 공유하므로 따로 state로 들지 않음
   */
  const [edge, setEdge] = useState({ start: true, end: true });
  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft >= el.scrollWidth - el.clientWidth - 2 });
  }, []);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      el.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  // 한 칸 = 카드 폭 + 간격 (간격은 CSS에서 읽어 반응형 값과 어긋나지 않게)
  const step = (el: HTMLElement) => {
    const card = el.querySelector('li');
    return card ? card.getBoundingClientRect().width + (parseFloat(getComputedStyle(el).columnGap) || 0) : el.clientWidth;
  };
  const selectAt = useCallback(
    (i: number) => navigate(productPath(PRODUCT_CATEGORIES[i]), { replace: true, state: { keepScroll: true } }),
    [navigate],
  );
  const slide = (dir: 1 | -1) => {
    if (single) return selectAt(catIndex + dir); // 선택이 바뀌면 아래 effect가 그 카드로 스크롤
    const el = track.current;
    if (el) el.scrollBy({ left: dir * step(el), behavior: 'smooth' });
  };

  // 모바일 스와이프: 스크롤이 멈추면 화면에 스냅된 카드를 선택
  // (scrollend 이벤트는 사파리 지원이 늦어서, 마지막 scroll 이후 150ms 조용하면 멈춘 것으로 봄)
  useEffect(() => {
    const el = track.current;
    if (!el || !single) return;
    let timer: number | undefined;
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const i = Math.round(el.scrollLeft / step(el));
        if (i !== catIndex && PRODUCT_CATEGORIES[i]) selectAt(i);
      }, 150);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      el.removeEventListener('scroll', onScroll);
    };
  }, [single, catIndex, selectAt]);

  // 선택 카드가 보이는 범위 밖이면 보이게만 당겨 옴 (이미 보이면 그대로 — 화면이 괜히 움직이지 않게)
  // scrollIntoView는 페이지 세로 스크롤까지 움직여서 트랙만 직접 스크롤
  useEffect(() => {
    const el = track.current;
    const item = el?.children[catIndex] as HTMLElement | undefined;
    if (!el || !item) return;
    const left = item.offsetLeft - el.offsetLeft;
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    if (single) {
      el.scrollTo({ left: left - pad, behavior: 'smooth' }); // 한 장씩: 선택 카드에 딱 맞춤
      return;
    }
    if (left - pad < el.scrollLeft) el.scrollTo({ left: left - pad, behavior: 'smooth' });
    else if (left + item.offsetWidth + pad > el.scrollLeft + el.clientWidth)
      el.scrollTo({ left: left + item.offsetWidth + pad - el.clientWidth, behavior: 'smooth' });
  }, [catIndex, single]);

  // 잘못된 카테고리 주소 → 첫 카테고리로 (Hook 호출이 모두 끝난 뒤에 분기해야 Hook 순서 규칙을 지킴)
  if (!category || !product) return <Navigate to={productPath(PRODUCT_CATEGORIES[0])} replace />;

  // 카드·하위 탭 전환은 탭처럼 동작 → 기록을 쌓지 않고(replace) 스크롤도 유지
  const swap = { replace: true, state: { keepScroll: true } } as const;

  // 하위 탭: 구분이 있으면 구분 → (구분 안 제품이 여럿이면) 제품, 구분이 없으면 카테고리 안 제품
  const productTabs = productsOf(group?.slugs ?? category.slugs);
  const banner = BANNER_IMAGES[category.key] ?? HERO_IMAGES[category.key];

  return (
    <>
      <section className={s.hero} id="top" aria-labelledby="product-hero-title">
        <div className={cx(s.heroBg, banner && s.hasPhoto)} aria-hidden="true">
          {/* key: 카테고리가 바뀌면 사진을 새로 그려 줌 효과가 다시 재생되게 */}
          {banner && <img key={category.key} src={banner} alt="" />}
        </div>
        <div className={s.heroText}>
          <h1 id="product-hero-title" className={s.heroTitle}>제품소개</h1>
          <p className={s.heroEn}>Products</p>
        </div>
      </section>

      {/* 카테고리 카드 — 히어로 하단에 걸쳐 놓임. 선택한 카드만 설명이 열려 키가 커지고 테두리가 생김 */}
      <nav className={s.cardsWrap} aria-label="제품 분류">
        {/* 다 보이면(양 끝 모두 닿음) 화살표를 감춤 — 눌러도 안 움직이는 버튼을 남기지 않음
            모바일은 선택 기준(첫·마지막 카테고리)으로, PC는 스크롤 끝 기준으로 비활성 */}
        {!(edge.start && edge.end) && (
          <>
            <button type="button" className={cx(s.arrow, s.prev)} onClick={() => slide(-1)} disabled={single ? catIndex === 0 : edge.start} aria-label={single ? '이전 분류' : '이전 분류 보기'} aria-controls="product-cards">
              <Chevron dir="left" />
            </button>
            <button type="button" className={cx(s.arrow, s.next)} onClick={() => slide(1)} disabled={single ? catIndex === PRODUCT_CATEGORIES.length - 1 : edge.end} aria-label={single ? '다음 분류' : '다음 분류 보기'} aria-controls="product-cards">
              <Chevron dir="right" />
            </button>
          </>
        )}
        <ul ref={track} id="product-cards" className={s.cards}>
          {PRODUCT_CATEGORIES.map((c, i) => {
            const on = i === catIndex;
            return (
              <li key={c.key} className={s.cardItem}>
                <Link to={productPath(c)} {...swap} className={cx(s.card, on && s.cardOn)} aria-current={on ? 'page' : undefined}>
                  <span className={s.cardEn}>{c.labelEn}</span>
                  <strong className={s.cardName}>{c.label}</strong>
                  {/* 닫힌 카드의 요약은 화면에서만 숨김 — 스크린리더는 모든 카드 요약을 읽을 수 있게 */}
                  <span className={cx(s.cardDesc, !on && 'sr-only')}>{c.summary}</span>
                  <Media className={s.cardMedia} src={HERO_IMAGES[c.key]} position={IMAGE_POSITION[c.key]} label={`IMAGE — ${pad(i + 1)}`} />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <p className={cx('container', s.highlight)}>
        <Highlight text={group?.highlight ?? category.highlight} />
      </p>

      {/* 하위 탭 — 2개 이상 고를 게 있을 때만. 알루미늄셔터 방범셔터처럼 구분 안에 제품이 여럿이면 두 줄 */}
      {(category.groups || productTabs.length > 1) && (
        <nav className={cx('container', s.subNav)} aria-label={`${category.label} 제품`}>
          {category.groups && group && (
            <ul className={s.subTabs}>
              {category.groups.map((g) => (
                <li key={g.key}>
                  <Link to={productPath(category, g.slugs[0])} {...swap} className={s.subTab} aria-current={g.key === group.key ? 'true' : undefined}>
                    {g.label}
                    {g.slugs.length > 1 && <span className={s.subCount}>{g.slugs.length}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {productTabs.length > 1 && (
            <ul className={cx(s.subTabs, category.groups && s.subTabsMinor)}>
              {productTabs.map((pt) => (
                <li key={pt.slug}>
                  <Link to={productPath(category, pt.slug)} {...swap} className={s.subTab} aria-current={pt.slug === product.slug ? 'true' : undefined}>
                    {pt.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </nav>
      )}

      {/* key: 제품이 바뀔 때 상세 영역을 새로 그려 등장 모션이 다시 재생되게 */}
      <ProductBody key={product.slug} product={product} />

      <Contact />
    </>
  );
}

function ProductBody({ product: p }: { product: ProductDetail }) {
  const ready = p.intro !== '';
  const drawing = DRAWINGS[p.slug];

  return (
    <div className={s.body}>
      {import.meta.env.DEV && p.todo && (
        // 개발 서버에서만 보이는 확인 목록 — 배포 빌드에는 포함되지 않음
        <aside className={cx('container', s.todo)} aria-label="확인 필요(개발용)">
          <strong>확인 필요</strong>
          <ul>{p.todo.map((t) => <li key={t}>{t}</li>)}</ul>
        </aside>
      )}

      {/* 개요 */}
      <section className={cx('container', s.overview)} aria-labelledby="product-name">
        <Media className={s.overviewMedia} src={PRODUCT_IMAGES[p.slug]} position={IMAGE_POSITION[p.slug]} alt={PRODUCT_IMAGES[p.slug] ? `${p.name} 시공 사진` : undefined} label={`IMAGE — ${p.nameEn}`} />
        <div className={s.overviewText}>
          <p className="dh-eyebrow">{p.nameEn}</p>
          <h2 id="product-name" className={s.name}>{p.name}</h2>
          {p.model && <p className={s.model}>{p.model}</p>}
          <p className={s.intro}>{ready ? p.intro : '제품 상세 정보를 준비하고 있습니다. 사양과 견적은 상담으로 안내해 드립니다.'}</p>

          {p.maxSize && (
            <dl className={s.size}>
              <div>
                <dt>최대 폭</dt>
                <dd>{mm(p.maxSize.width)}<small>mm</small></dd>
              </div>
              <div>
                <dt>최대 높이</dt>
                <dd>{mm(p.maxSize.height)}<small>mm</small></dd>
              </div>
            </dl>
          )}

          {p.certs && (
            <ul className={s.certs} aria-label="인증·시험성적">
              {p.certs.map((c) => <li key={c}><Badge tone="accent">{c}</Badge></li>)}
            </ul>
          )}

          <div className={s.actions}>
            <Button href="#contact" arrow>견적문의</Button>
            <Button href={`tel:${COMPANY.tel}`} variant="secondary">{COMPANY.tel}</Button>
          </div>
        </div>
      </section>

      {p.features.length > 0 && (
        <section className={cx('container', s.block)} aria-labelledby="features-title">
          <BlockHead en="FEATURES" title="제품 특징" id="features-title" />
          <ol className={s.features}>
            {p.features.map((f, i) => (
              <li key={f.title} className={s.feature}>
                <span className={s.featureNo}>{pad(i + 1)}</span>
                <h4 className={s.featureTitle}>{f.title}</h4>
                <p className={s.featureBody}>{f.body}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {p.sharedSafety && <SafetyBand />}

      {drawing ? (
        <>
          {/* 도면이 있는 제품: [구조도 | 사양표] → 아래에 설치 장소 */}
          <section className={cx('container', s.block)} aria-labelledby="spec-title">
            <BlockHead en="SPECIFICATION" title="구조도 · 제품 사양" id="spec-title" />
            <div className={s.specDrawing}>
              <figure className={s.drawing}>
                {/* 도면은 글자가 작아서 원본 크기로 열어 볼 수 있게 링크 */}
                <a href={drawing.src} target="_blank" rel="noopener noreferrer" className={s.drawingLink}>
                  <img src={drawing.src} alt={`${p.name} 구조도 — 케이스, 감기샤프트, 슬랫, 가이드레일 등 부품 위치와 치수`} loading="lazy" />
                  <span className={s.drawingZoom}>크게 보기<span className="sr-only">(새 창)</span></span>
                </a>
                <figcaption>{drawing.caption}{p.maxSize && ` · 최대 ${mm(p.maxSize.width)} × ${mm(p.maxSize.height)}mm`}</figcaption>
              </figure>
              {p.specs.length > 0 && <SpecTable product={p} />}
            </div>
          </section>
          {p.uses.length > 0 && (
            <section className={cx('container', s.block)} aria-labelledby="uses-title">
              <BlockHead en="APPLICATION" title="주요 설치 장소" id="uses-title" />
              <ul className={s.uses}>
                {p.uses.map((u) => <li key={u}>{u}</li>)}
              </ul>
            </section>
          )}
        </>
      ) : (
        (p.specs.length > 0 || p.uses.length > 0) && (
          <section className={cx('container', s.block, s.specWrap)} aria-labelledby="spec-title">
            {p.specs.length > 0 && (
              <div>
                <BlockHead en="SPECIFICATION" title="제품 사양" id="spec-title" />
                <SpecTable product={p} />
              </div>
            )}
            {p.uses.length > 0 && (
              <div>
                <BlockHead en="APPLICATION" title="주요 설치 장소" id={p.specs.length ? undefined : 'spec-title'} />
                <ul className={s.uses}>
                  {p.uses.map((u) => <li key={u}>{u}</li>)}
                </ul>
              </div>
            )}
          </section>
        )
      )}
    </div>
  );
}

function SpecTable({ product: p }: { product: ProductDetail }) {
  return (
    <table className={s.spec}>
      <caption className="sr-only">{p.name} 사양표</caption>
      <tbody>
        {p.specs.map((r) => (
          <tr key={r.label}>
            <th scope="row">{r.label}</th>
            <td>{r.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** 방화셔터 공통 — 특허 안전장치·모터 시스템 (스크린·철재 상세에 함께 노출) */
function SafetyBand() {
  const f = FIRE_SAFETY;
  return (
    <section className={s.safety} data-theme="dark" aria-labelledby="safety-title">
      <div className="container">
        <BlockHead en="SAFETY SYSTEM" title={f.headline} id="safety-title" />

        <ol className={s.patents}>
          {f.patents.map((pt, i) => (
            <li key={pt.title}>
              <span className={s.patentNo}>PATENT {pad(i + 1)}</span>
              <h4>{pt.title}</h4>
              <p>{pt.body}</p>
            </li>
          ))}
        </ol>

        <div className={s.safetyGrid}>
          <article className={s.safetyCard}>
            <h4>{f.obstacle.title} <Badge tone="fire">{f.obstacle.badge}</Badge></h4>
            <p>{f.obstacle.body}</p>
          </article>
          <article className={s.safetyCard}>
            <h4>{f.bracket.title}</h4>
            <p>{f.bracket.body}</p>
          </article>
          <article className={cx(s.safetyCard, s.voice)}>
            <h4>연동제어기 음성안내 <Badge tone="fire">특허 출원</Badge></h4>
            <ul>
              {f.voiceMessages.map((m) => <li key={m}>“{m}”</li>)}
            </ul>
          </article>
        </div>

        <ul className={s.details}>
          {f.details.map((d) => (
            <li key={d.title}>
              <strong>{d.title}</strong>
              <span>{d.body}</span>
            </li>
          ))}
        </ul>

        <div className={s.motor}>
          <p className={s.motorLabel}>DH 모터 용량</p>
          <ul>{f.motor.capacities.map((c) => <li key={c}>{c}</li>)}</ul>
          <p className={s.patentLine}>특허 {f.patent.no} · {f.patent.title}</p>
        </div>
      </div>
    </section>
  );
}

function BlockHead({ en, title, id }: { en: string; title: string; id?: string }) {
  return (
    <div className={s.blockHead}>
      <p className="dh-eyebrow">{en}</p>
      <h3 id={id} className={s.blockTitle}>{title}</h3>
    </div>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="28" height="28" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d={dir === 'left' ? 'M12.5 4.5 7 10l5.5 5.5' : 'M7.5 4.5 13 10l-5.5 5.5'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
