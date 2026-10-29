import { Fragment, useCallback, useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  PRODUCT_CATEGORIES,
  getCategory,
  getProduct,
  groupOf,
  productPath,
  type ProductCategory,
  type ProductDetail,
  type TestReport,
} from '../data/products';
import { COMPANY } from '../data/site';
import { Badge, Button, Media, cx } from '../components/ui';
import { Contact } from '../sections/Contact';
import { SafetyBand, SafetyDetails } from './product/SafetyBand';
import { ProductTabBar } from './product/ProductTabBar';
import { ProductGallery } from './product/ProductGallery';
import { FeatureIcon } from './product/FeatureIcon';
import { PRODUCT_GALLERY } from './product/galleryImages';
import steelShutterImg from '../assets/product-steel-shutter.png';
import screenShutterImg from '../assets/product-screen-shutter.png';
import pipeSingleDetailImg from '../assets/detail-pipe-single.jpg';
import pipeDoubleDetailImg from '../assets/detail-pipe-double.jpg';
import speedDoorImg from '../assets/product-speed-door.jpg';
import speedDoorRedImg from '../assets/product-speed-door-red.jpg';
import steelBannerImg from '../assets/banner-steel-shutter.jpg';
import aluminumBannerImg from '../assets/banner-aluminum-shutter.jpg';
import screenBannerImg from '../assets/banner-screen-shutter.jpg';
import overheadBannerImg from '../assets/banner-overhead-door.jpg';
import overheadDoorImg from '../assets/product-overhead-door.jpg';
import aluminumCardImg from '../assets/card-aluminum-shutter.jpg';
import steelDrawingImg from '../assets/drawing-steel-shutter.png';
import screenDrawingImg from '../assets/drawing-screen-shutter.png';
import steelReportImg from '../assets/report-steel-kict.jpg';
import speedMotorImg from '../assets/component-speed-motor.jpg';
import speedDrawingImg from '../assets/drawing-speed-door.jpg';
import speedRepairImg from '../assets/steps-speed-door-repair.jpg';
import speedControlImg from '../assets/component-speed-control.jpg';
import speedGuideRailImg from '../assets/component-speed-guiderail.jpg';
import s from './ProductPage.module.css';

// 상세 상단 갤러리 사진은 product/galleryImages.ts (제품별 여러 장)
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
// src가 없으면 같은 자리에 이미지 자리(placeholder)를 그림 — 이미지만 받으면 src 한 줄 추가로 끝
// wide: 가로로 긴 도면(정면도+입체도) → 박스 폭을 꽉 채움 (기본은 78%로 여백을 둠)
const DRAWINGS: Partial<Record<string, { src?: string; caption: string; title?: string; alt?: string; wide?: boolean }>> = {
  steel: { src: steelDrawingImg, caption: '예시 도면 · 개구부 3,000 × 3,000mm 기준' },
  screen: { src: screenDrawingImg, caption: '예시 도면 · 개구부 3,000 × 3,000mm 기준' },
  'speed-door': {
    src: speedDrawingImg,
    wide: true,
    caption: '구성도 · 개구부 폭·높이는 현장에 맞춰 제작 (OPEN WIDTH / HEIGHT = VAR.)',
    title: '구성도 · 제품 사양',
    alt: '스피드도어 구성도 — 모터, 샤프트, 도어 시트, 비전 시트, 가이드레일, 컨트롤 박스, 포토센서, 하단바 위치',
  },
  'overhead-door': {
    caption: '구성도 · 개구부 폭·높이는 현장에 맞춰 제작 (OPEN WIDTH / HEIGHT = VAR.)',
    title: '구성도 · 제품 사양',
    alt: '오버헤드도어 구성도 — 드럼, 스프링, 샤프트, 모터, 수동 체인, 패널, 힌지·롤러, 채광창, 하부 실, 컨트롤 위치',
  },
};

// 패널 종류 사진 (한 장) · 개폐 방식 그림 (openTypes와 같은 순서)
const PANEL_IMAGES: Partial<Record<string, string>> = {};
const OPEN_TYPE_IMAGES: Partial<Record<string, (string | undefined)[]>> = {};

// 구성품 사진 — products.ts의 components와 같은 순서. 비어 있으면 이미지 자리로 표시
// wide: 가로로 긴 사진(단면도+입체도 등) → 카드가 한 줄 전체를 차지
const COMPONENT_IMAGES: Partial<Record<string, ({ src: string; wide?: boolean } | undefined)[]>> = {
  'speed-door': [{ src: speedMotorImg }, { src: speedControlImg }, { src: speedGuideRailImg, wide: true }],
};
// 단계별 동작 그림(자동 복구 등) — 한 장짜리 일러스트
const STEP_IMAGES: Partial<Record<string, string>> = {
  'speed-door': speedRepairImg,
};

// 구조 상세 사진(부품·결속부 확대) — 있으면 '제품 특징'을 [사진 | 특징 목록]으로 배치
// 라벨: 사진 위에 번호 핀으로 표시할 지점 (x·y는 사진 기준 %)
const DETAIL_IMAGES: Partial<Record<string, { src: string; caption: string; pins?: { x: number; y: number; label: string }[] }>> = {
  'pipe-single': {
    src: pipeSingleDetailImg,
    caption: '스테인리스 파이프 + 연결 링크 결속 구조',
    pins: [
      { x: 50, y: 48.8, label: '스텐 파이프' },
      { x: 32.5, y: 58, label: '연결 링크' },
      { x: 11.5, y: 88.5, label: '엔드캡' },
    ],
  },
  'pipe-double': {
    src: pipeDoubleDetailImg,
    caption: '스테인리스 파이프 + 연결 로드 결속 구조',
    pins: [
      { x: 50, y: 51.5, label: '스텐 파이프' },
      { x: 32, y: 59, label: '연결 로드' },
      { x: 13.7, y: 94.7, label: '엔드캡' },
    ],
  },
};

// 시험성적서 스캔 이미지 — 키는 성적서 번호
const REPORT_IMAGES: Partial<Record<string, string>> = {
  '2020TSE0051-1-1': steelReportImg,
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

  // 고를 제품이 둘 이상인 카테고리만 제품 탭 바
  const hasTabs = category.slugs.length > 1;
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

      {/* 소개 영역(카테고리 카드 + 강조 문장)은 연회색 배경, 아래 상세는 흰 배경 — 배너 바로 밑에서 좌우로 갈라지는 어색함을
          배경 전환으로 '영역이 바뀐다'는 신호를 줘서 자연스럽게 이어 줌 */}
      <div className={s.introBand}>
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
      </div>

      {/* 제품이 여럿인 카테고리(철재·알루미늄)는 회색 띠와 상세 경계에 전체 폭 제품 탭 */}
      {hasTabs && <ProductTabBar category={category} current={product.slug} />}

      {/* key: 제품이 바뀔 때 상세 영역을 새로 그려 등장 모션이 다시 재생되게 */}
      <ProductBody key={product.slug} product={product} />

      <Contact />
    </>
  );
}

function ProductBody({ product: p }: { product: ProductDetail }) {
  const ready = p.intro !== '';
  const drawing = DRAWINGS[p.slug];
  const detail = DETAIL_IMAGES[p.slug];
  // 갤러리 = 제품 사진 + 구조 상세 사진(있으면 2번째 장). 제품마다 따로 적지 않아 싱글·이중처럼 같은 종류는 항상 같은 구성
  const base = PRODUCT_GALLERY[p.slug] ?? [];
  const gallery = detail ? [...base.slice(0, 1), { src: detail.src, alt: `${p.name} 구조 상세 — ${detail.caption}`, fit: 'contain' as const }, ...base.slice(1)] : base;

  return (
    <div className={s.body}>

      {/* 개요 */}
      <section className={cx('container', s.overview)} aria-labelledby="product-name">
        <ProductGallery images={gallery} name={p.name} placeholder={`IMAGE — ${p.nameEn}`} />
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
          {detail ? (
            // 구조 사진이 있으면: 왼쪽 사진(번호 핀) | 오른쪽 특징을 세로 목록으로
            <div className={s.featureSplit}>
              <figure className={s.detailFig}>
                {/* 바깥(detailImg)은 여백만, 안쪽(detailPhoto)은 사진과 같은 크기 — 핀 %가 사진 기준이라 여백을 바꿔도 위치가 안 어긋남 */}
                <div className={s.detailImg}>
                  <div className={s.detailPhoto}>
                    <img src={detail.src} alt={`${p.name} 구조 상세 — ${detail.caption}`} loading="lazy" />
                    {detail.pins?.map((pin, i) => (
                      <span key={pin.label} className={s.pin} style={{ left: `${pin.x}%`, top: `${pin.y}%` }} aria-hidden="true">
                        {i + 1}
                      </span>
                    ))}
                  </div>
                </div>
                {/* 카드 하단: [구조 상세 / 설명] — 구분선 — [① ② ③ 범례] (범례는 글자 길이대로 붙여 나열) */}
                <figcaption className={s.detailCap}>
                  <div className={s.detailTitle}>
                    <strong>구조 상세</strong>
                    <span>{detail.caption}</span>
                  </div>
                  {detail.pins && (
                    <ol className={s.pinLegend}>
                      {detail.pins.map((pin, i) => (
                        <li key={pin.label}>
                          <span className={s.pinNo}>{i + 1}</span>
                          {pin.label}
                        </li>
                      ))}
                    </ol>
                  )}
                </figcaption>
              </figure>
              <ol className={s.featureList}>
                {p.features.map((f, i) => (
                  <li key={f.title}>
                    {/* 2열 그리드: [아이콘 | 번호+제목 / 설명] — 아이콘이 두 행에 걸쳐 왼쪽에 고정 */}
                    <span className={s.featureIcon}><FeatureIcon title={f.title} /></span>
                    <h4 className={s.featureTitle}><span className={s.featureNo}>{pad(i + 1)}</span>{f.title}</h4>
                    <p className={s.featureBody}>{f.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <ol className={s.features}>
              {p.features.map((f, i) => (
                <li key={f.title} className={s.feature}>
                  <div className={s.featureHead}>
                    <span className={s.featureIcon}><FeatureIcon title={f.title} /></span>
                    <span className={s.featureNo}>{pad(i + 1)}</span>
                  </div>
                  <h4 className={s.featureTitle}>{f.title}</h4>
                  <p className={s.featureBody}>{f.body}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}

      {/* 방화셔터 공통 안전장치 — 제품 특징 바로 아래에 [특허 출원 체크무늬 + 세부 안전 설계 띠] 한 쌍으로.
          화려한 그래픽을 페이지 중간으로 올려 위쪽(심플)·아래쪽(화려)으로 쏠리지 않게 함 */}
      {p.sharedSafety && (
        <>
          <SafetyBand />
          <SafetyDetails />
        </>
      )}

      {p.components && <ComponentsBlock product={p} />}
      {p.steps && <StepsBand product={p} />}

      {drawing ? (
        <>
          {/* 도면이 있는 제품: [구조도 | 사양표] → (색상·센서) → 아래에 설치 장소 */}
          <section className={cx('container', s.block)} aria-labelledby="spec-title">
            <BlockHead en="SPECIFICATION" title={drawing.title ?? '구조도 · 제품 사양'} id="spec-title" />
            {/* 도면 박스와 사양표의 높이를 맞춤: 그리드 행 높이(둘 중 큰 쪽)에 양쪽이 늘어남.
                그래서 도면 설명은 그리드 밖(아래)으로 뺌 — 안에 두면 설명 줄만큼 도면 쪽이 더 길어져 끝선이 어긋남 */}
            <div className={s.specDrawing}>
              <figure className={s.drawing} aria-describedby="drawing-note">
                {/* 도면은 글자가 작아서 원본 크기로 열어 볼 수 있게 링크. 이미지가 아직 없으면 같은 크기의 자리만 */}
                {drawing.src ? (
                  <a href={drawing.src} target="_blank" rel="noopener noreferrer" className={cx(s.drawingLink, drawing.wide && s.drawingWide)}>
                    <img src={drawing.src} alt={drawing.alt ?? `${p.name} 구조도 — 케이스, 감기샤프트, 슬랫, 가이드레일 등 부품 위치와 치수`} loading="lazy" />
                    <span className={s.drawingZoom}>크게 보기<span className="sr-only">(새 창)</span></span>
                  </a>
                ) : (
                  <Media className={s.drawingEmpty} label={`IMAGE — ${p.nameEn} 구성도`} />
                )}
              </figure>
              {p.specs.length > 0 && <SpecTable product={p} />}
            </div>
            <p id="drawing-note" className={s.drawingNote}>
              {drawing.caption}{p.maxSize && ` · 최대 ${mm(p.maxSize.width)} × ${mm(p.maxSize.height)}mm`}
            </p>
          </section>
          {(p.colors || p.sensors) && <OptionsBlock product={p} />}
          {p.panels && <PanelBlock product={p} />}
          {p.openTypes && <OpenTypesBlock product={p} />}
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

      {p.reports?.map((r) => <ReportBlock key={r.reportNo} report={r} />)}
    </div>
  );
}

/**
 * 시험성적서 — 핵심 결과는 표로 읽히게(텍스트), 원본 스캔은 이미지로(증빙).
 * 의뢰자·시험대상을 숨기지 않고 그대로 표기: 대한방화 명의가 아닌 성적서를 자사 인증처럼 보이게 하면 안 됨
 */
function ReportBlock({ report: r }: { report: TestReport }) {
  const img = REPORT_IMAGES[r.reportNo];
  const meta: [string, string][] = [
    ['시험기관', r.accreditation ? `${r.lab} · ${r.accreditation}` : r.lab],
    ['성적서 번호', r.reportNo],
    ['의뢰자', r.client],
    ['시험대상', r.subject],
    ['시험방법', r.method],
    ['시험체', r.specimen],
    ['시험일자', `${r.testDate} (발급 ${r.issueDate})`],
  ];
  return (
    <section className={cx('container', s.block)} aria-labelledby={`report-${r.reportNo}`}>
      <BlockHead en="TEST REPORT" title="공인 시험성적서" id={`report-${r.reportNo}`} />
      {/* 두 줄 모두 좌우를 채워 균형: [스캔 | 성적서 정보] / [결과표 | 차열 온도] */}
      <div className={s.reportHead}>
        {img && (
          <figure className={s.reportScan}>
            <a href={img} target="_blank" rel="noopener noreferrer" className={s.drawingLink}>
              <img src={img} alt={`시험성적서 ${r.reportNo} 원본 스캔 (3쪽)`} loading="lazy" />
              <span className={s.drawingZoom}>원본 보기<span className="sr-only">(새 창)</span></span>
            </a>
          </figure>
        )}
        <div>
          <p className={s.reportTitle}>
            {r.title} <Badge tone="solid">60분 전 항목 적합</Badge>
          </p>
          <dl className={s.reportMeta}>
            {meta.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className={s.reportNote}>{r.note}</p>
        </div>
      </div>

      <div className={cx(s.reportBody, !r.heat && s.reportBodySingle)}>
        <table className={cx(s.spec, s.resultTable)}>
          <caption className="sr-only">{r.title} 시험결과</caption>
          <colgroup>
            <col className={s.colItem} />
            <col />
            <col className={s.colShort} />
            <col className={s.colShort} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">시험항목</th>
              <th scope="col">기준</th>
              <th scope="col">시간</th>
              <th scope="col">결과</th>
            </tr>
          </thead>
          <tbody>
            {r.results.map((x, i) => {
              // 원본 성적서처럼 같은 시험항목(차염성·차열성)은 칸을 합침: 그룹의 첫 줄만 th를 그리고 rowSpan으로 늘림
              const first = i === 0 || r.results[i - 1].item !== x.item;
              const span = first ? r.results.slice(i).findIndex((y) => y.item !== x.item) : 0;
              const rows = span === -1 ? r.results.length - i : span;
              return (
                <tr key={i}>
                  {first && <th scope="rowgroup" rowSpan={rows}>{x.item}</th>}
                  <td>{x.criterion}</td>
                  <td className={s.nowrap}>{x.time}</td>
                  <td><span className={s.pass}>{x.result}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {r.heat && (
          <div className={s.heat}>
            {/* 머리: [온도계 아이콘 타일 | 영문 라벨 + 제목 + 설명 | 적합 배지] */}
            <div className={s.heatHead}>
              <span className={s.heatIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0Z" /><path d="M12 9v7" /><path d="M17 5h3M17 9h2" />
                </svg>
              </span>
              <div className={s.heatHeadText}>
                <p className={s.heatEyebrow}>HEAT INSULATION</p>
                <p className={s.heatTitle}>차열성 · 비가열면 온도</p>
                <p className={s.heatSub}>가열 60분 시점, 불이 닿지 않는 반대면의 온도</p>
              </div>
              <Badge tone="solid">적합</Badge>
            </div>
            <div className={s.donuts}>
              <HeatDonut label="평균 온도" value={r.heat.avg} limit={r.heat.avgLimit} />
              <HeatDonut label="최고 측정점" value={r.heat.max} limit={r.heat.maxLimit} delay={200} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/** 화면에 들어왔는지 — 한 번 보이면 true로 고정 (차트 애니메이션 시작 신호) */
function useInView<T extends Element>(threshold = 0.4) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/**
 * 숫자 카운트업 — run이 true가 되면 0 → target까지 duration 동안 올라감
 * requestAnimationFrame: 브라우저가 화면을 그릴 때마다(보통 1초 60번) 콜백을 불러 줌 → setInterval보다 부드럽고, 탭이 안 보이면 자동으로 쉼
 * 동작 줄이기 설정이면 바로 최종값
 */
function useCountUp(target: number, run: boolean, duration = 1400, delay = 0) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(target); return; }
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now + delay;
      const p = Math.min(1, Math.max(0, (now - start) / duration));
      setV(target * (1 - Math.pow(1 - p, 3))); // easeOutCubic — 처음엔 빠르고 끝에서 천천히 멈춤
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration, delay]);
  return v;
}

/**
 * 측정값이 기준 대비 어디쯤인지 도넛으로 — 숫자만 보는 것보다 '여유'가 한눈에 보임
 * SVG 원의 테두리(stroke)를 점선처럼 끊어 호를 그림: pathLength=100으로 두면 원 둘레가 100이 되어
 * stroke-dasharray="pct 100" = '앞 pct만큼 그리고 나머지는 빈칸' → 퍼센트를 그대로 넣으면 됨
 * 애니메이션: 화면에 들어오면 호가 0→pct로 그려지고(CSS transition), 가운데 숫자·%가 같은 속도로 카운트업(JS)
 */
function HeatDonut({ label, value, limit, delay = 0 }: { label: string; value: number; limit: number; delay?: number }) {
  const pct = Math.min(100, (value / limit) * 100);
  const gid = useId(); // 그라데이션 id — 도넛이 2개라 겹치지 않게
  const [ref, inView] = useInView<HTMLElement>();
  const shownValue = useCountUp(value, inView, 1400, delay);
  const shownPct = useCountUp(pct, inView, 1400, delay);
  return (
    <figure ref={ref} className={s.donut} data-in={inView || undefined} style={{ '--delay': `${delay}ms` } as CSSProperties}>
      <div className={s.donutChart} role="img" aria-label={`${label} ${value}℃, 기준 ${limit}℃의 ${Math.round(pct)}%`}>
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--brand)" />
            </linearGradient>
          </defs>
          <circle className={s.donutTrack} cx="60" cy="60" r="50" pathLength={100} />
          {/* 기준선(100%) 바깥 눈금 — 링 둘레에 10% 간격 */}
          <circle className={s.donutTicks} cx="60" cy="60" r="58" pathLength={100} />
          {/* -90° 회전: SVG 원은 3시 방향에서 시작하므로 12시에서 시작하게 */}
          <circle
            className={s.donutFill}
            cx="60" cy="60" r="50" pathLength={100}
            stroke={`url(#${gid})`}
            style={{ '--pct': inView ? pct : 0 } as CSSProperties}
          />
        </svg>
        {/* 눈으로 보는 숫자는 카운트업, 스크린리더는 위 aria-label의 최종값을 읽음 */}
        <div className={s.donutCenter} aria-hidden="true">
          <strong>{shownValue.toFixed(1)}<small>℃</small></strong>
          <span>기준의 {Math.round(shownPct)}%</span>
        </div>
      </div>
      <figcaption className={s.donutCap}>
        <b>{label}</b>
        <span>기준 {limit}℃ 이하</span>
        <span><em>여유 {(limit - value).toFixed(1)}℃</em></span>
      </figcaption>
    </figure>
  );
}

/** 구성품 — 사진 카드 3장 (영문 라벨 + 이름 + 한 줄 설명) */
function ComponentsBlock({ product: p }: { product: ProductDetail }) {
  const imgs = COMPONENT_IMAGES[p.slug] ?? [];
  return (
    <section className={cx('container', s.block)} aria-labelledby="components-title">
      <BlockHead en="COMPONENTS" title="구성품" id="components-title" />
      <ul className={s.components}>
        {p.components!.map((c, i) => (
          <li key={c.nameEn} className={cx(s.component, imgs[i]?.wide && s.componentWide)}>
            <Media className={s.componentImg} src={imgs[i]?.src} alt={`${p.name} ${c.name}`} label={`IMAGE — ${c.nameEn}`} />
            <div className={s.componentText}>
              <p className={s.componentEn}>{c.nameEn}</p>
              <h4 className={s.componentName}>{c.name}</h4>
              <p className={s.componentBody}>{c.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * 단계별 동작(자동 복구) — 회색 전체 폭 띠: [제목 + 그림 1장] 아래에 01→02→03 단계를 화살표로 연결.
 * 그림은 3단계가 한 장에 그려진 일러스트라, 단계 글을 그림의 세 칸과 같은 3열로 맞춤
 */
function StepsBand({ product: p }: { product: ProductDetail }) {
  const st = p.steps!;
  const img = STEP_IMAGES[p.slug];
  return (
    <section className={s.stepsBand} aria-labelledby="steps-title">
      <div className="container">
        <BlockHead en={st.title} title={st.heading} id="steps-title" />
        <Media className={s.stepsImg} src={img} alt={`${p.name} ${st.heading} — ${st.items.map((x) => x.title).join(' → ')}`} label={`IMAGE — ${st.title}`} />
        {/* 그림에 이미 01·02·03 번호와 화살표가 있으면 아래 목록의 번호 원·연결선은 숨기고 그림의 세 칸 아래에 글만 맞춤 */}
        <ol className={cx(s.steps, img && s.stepsUnderImg)}>
          {st.items.map((x, i) => (
            <li key={x.title} className={s.step}>
              <span className={s.stepNo}>{pad(i + 1)}</span>
              <h4 className={s.stepTitle}><span className={s.stepTag}>{pad(i + 1)}</span>{x.title}</h4>
              <p className={s.stepBody}>{x.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** 도어 색상 + 센서 — 색상은 이미지 없이 CSS로 그린 미니 도어(시트 색 + 비전 창), 센서는 아이콘 목록 */
function OptionsBlock({ product: p }: { product: ProductDetail }) {
  return (
    <section className={cx('container', s.block, s.options)} aria-label="색상·센서 옵션">
      {p.colors && (
        <div>
          <BlockHead en="DOOR COLOR" title="도어 색상" />
          <p className={s.optionsLead}>시트 색상을 고르고, 투명한 비전 시트를 조합할 수 있습니다.</p>
          <ul className={s.colors}>
            {p.colors.map((c) => (
              <li key={c.nameEn} className={s.color}>
                {/* 미니 도어: 프레임 안에 시트 색, 비전 시트는 반투명 창으로 */}
                <span className={cx(s.swatch, c.vision && s.swatchVision)} style={{ '--sheet': c.hex } as CSSProperties} aria-hidden="true">
                  <span className={s.swatchWindow} />
                </span>
                <b>{c.name}</b>
                <span>{c.nameEn}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {p.sensors && (
        <div>
          <BlockHead en="SENSOR" title="센서 · 조작 장치" />
          <ul className={s.sensors}>
            {p.sensors.map((x) => (
              <li key={x.nameEn} className={s.sensor}>
                <span className={s.sensorIcon} aria-hidden="true">{SENSOR_ICONS[x.nameEn] ?? SENSOR_ICONS.DEFAULT}</span>
                <div>
                  <h4 className={s.sensorName}>{x.name} <span>{x.nameEn}</span></h4>
                  <p className={s.sensorBody}>{x.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/** 패널 종류 — [패널 사진 | 두께·피치 비교표]. 표는 패널이 열(가로)로 나란한 비교형 */
function PanelBlock({ product: p }: { product: ProductDetail }) {
  const panels = p.panels!;
  return (
    <section className={cx('container', s.block)} aria-labelledby="panel-title">
      <BlockHead en="PANEL" title="패널 종류" id="panel-title" />
      <div className={s.panelWrap}>
        <Media className={s.panelImg} src={PANEL_IMAGES[p.slug]} alt={`${p.name} 패널 단면 — ${panels.map((x) => x.nameEn).join(', ')}`} label="IMAGE — PANEL" />
        <ul className={s.panelCards}>
          {panels.map((x) => (
            <li key={x.nameEn + x.thickness} className={s.panelCard}>
              <p className={s.panelEn}>{x.nameEn}</p>
              <h4 className={s.panelName}>{x.name}</h4>
              <dl className={s.panelDl}>
                <div><dt>전체 두께</dt><dd>{x.thickness}</dd></div>
                <div><dt>피치</dt><dd>{x.pitch}</dd></div>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** 개폐 방식 — 타입별 그림 카드 3장 (헤드룸 조건을 배지로 강조) */
function OpenTypesBlock({ product: p }: { product: ProductDetail }) {
  const imgs = OPEN_TYPE_IMAGES[p.slug] ?? [];
  return (
    <section className={cx('container', s.block)} aria-labelledby="opentype-title">
      <BlockHead en="DOOR OPEN TYPE" title="개폐 방식" id="opentype-title" />
      <p className={s.openLead}>천장까지 남는 공간(헤드룸)에 맞춰 도어가 열리는 방식을 고릅니다.</p>
      <ol className={s.openTypes}>
        {p.openTypes!.map((x, i) => (
          <li key={x.nameEn} className={s.component}>
            <Media className={s.componentImg} src={imgs[i]} alt={`${p.name} ${x.name} 개폐 방식 — ${x.headroom}`} label={`IMAGE — ${x.nameEn}`} />
            <div className={s.componentText}>
              <p className={s.componentEn}>{pad(i + 1)} · {x.nameEn}</p>
              <h4 className={s.componentName}>{x.name}</h4>
              <p className={s.headroom}>{x.headroom}</p>
              <p className={s.componentBody}>{x.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

const sensorSvg = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const SENSOR_ICONS: Record<string, ReactNode> = {
  'PUSH BUTTON': sensorSvg(<><rect x="5" y="3" width="14" height="18" rx="2" /><circle cx="12" cy="9" r="2.5" /><circle cx="12" cy="16" r="2.5" /></>),
  'PHOTO SENSOR': sensorSvg(<><path d="M3 12h3M18 12h3" /><circle cx="12" cy="12" r="3" /><path d="M7 12h1.5M15.5 12H17" strokeDasharray="1 2" /><path d="M12 5v2M12 17v2" /></>),
  'INFRARED SENSOR': sensorSvg(<><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M12 7 5 20M12 7l7 13M7 20h10" /></>),
  'LOOP SENSOR': sensorSvg(<><rect x="4" y="13" width="16" height="7" rx="1.5" /><path d="M8 13V9a4 4 0 0 1 8 0v4" /><path d="M7.5 16.5h9" strokeDasharray="1.5 2" /></>),
  'REMOTE CONTROL': sensorSvg(<><rect x="8" y="7" width="8" height="14" rx="2" /><circle cx="12" cy="12" r="1.5" /><path d="M12 16v1" /><path d="M9 4.5a4.5 4.5 0 0 1 6 0M7 2.5a7.5 7.5 0 0 1 10 0" /></>),
  DEFAULT: sensorSvg(<circle cx="12" cy="12" r="8" />),
};

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
