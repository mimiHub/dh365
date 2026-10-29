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
import steelTypeNormalImg from '../assets/steel-type-normal.jpg';
import steelTypeDoorClosedImg from '../assets/steel-type-door-closed.jpg';
import steelTypeDoorOpenImg from '../assets/steel-type-door-open.jpg';
import steelForming1Img from '../assets/steel-forming-1.jpg';
import steelSlatImg from '../assets/slat-steel.jpg';
import steelForming2Img from '../assets/steel-forming-2.jpg';
import steelForming3Img from '../assets/steel-forming-3.jpg';
import steelForming4Img from '../assets/steel-forming-4.jpg';
import speedDrawingImg from '../assets/drawing-speed-door.jpg';
import speedRepairImg from '../assets/steps-speed-door-repair.jpg';
import overheadBandImg from '../assets/band-overhead-warehouse.jpg';
import overheadDriveImg from '../assets/component-overhead-drive.jpg';
import overheadSwitchImg from '../assets/component-overhead-switch.jpg';
import overheadPanelImg from '../assets/panel-overhead.jpg';
import overheadWindowImg from '../assets/window-overhead.jpg';
import overheadWhiteImg from '../assets/color-overhead-white.jpg';
import overheadGrayImg from '../assets/color-overhead-gray.jpg';
import overheadDrawingImg from '../assets/drawing-overhead-door.jpg';
import openStandardImg from '../assets/opentype-standard.jpg';
import alInsulatedDrawingImg from '../assets/drawing-al-insulated.jpg';
import slatExtrudedSetImg from '../assets/slat-al-extruded-set.jpg';
import partRailRearImg from '../assets/part-al-rail-rear.jpg';
import partRailSideImg from '../assets/part-al-rail-side.jpg';
import partBottomTImg from '../assets/part-al-bottom-t.jpg';
import partBottomIImg from '../assets/part-al-bottom-i.jpg';
import windExtrudedSetImg from '../assets/slat-al-wind-extruded-set.jpg';
import windInsulatedSetImg from '../assets/slat-al-wind-insulated-set.jpg';
import windRail1Img from '../assets/part-wind-rail-1.jpg';
import windRail2Img from '../assets/part-wind-rail-2.jpg';
import windRail3Img from '../assets/part-wind-rail-3.jpg';
import windRail4Img from '../assets/part-wind-rail-4.jpg';
import windLock1Img from '../assets/part-windlock-1.jpg';
import windLock2Img from '../assets/part-windlock-2.jpg';
import windLock3Img from '../assets/part-windlock-3.jpg';
import windLock4Img from '../assets/part-windlock-4.jpg';
import windGuideAImg from '../assets/part-wind-guiderail-a.jpg';
import windGuideBImg from '../assets/part-wind-guiderail-b.jpg';
import slatInsulatedSetImg from '../assets/slat-al-insulated-set.jpg';
import openHiliftImg from '../assets/opentype-hilift.jpg';
import openFullVerticalImg from '../assets/opentype-fullvertical.jpg';
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
  // 구조가 같아 철재방화셔터 도면을 같이 씀 (슬랫 내부 충전재만 다름)
  'steel-insulated': { src: steelDrawingImg, caption: '예시 도면 · 개구부 3,000 × 3,000mm 기준 · 슬랫 내부 단열재 충진' },
  screen: { src: screenDrawingImg, caption: '예시 도면 · 개구부 3,000 × 3,000mm 기준' },
  'speed-door': {
    src: speedDrawingImg,
    wide: true,
    caption: '구성도 · 개구부 폭·높이는 현장에 맞춰 제작 (OPEN WIDTH / HEIGHT = VAR.)',
    title: '구성도 · 제품 사양',
    alt: '스피드도어 구성도 — 모터, 샤프트, 도어 시트, 비전 시트, 가이드레일, 컨트롤 박스, 포토센서, 하단바 위치',
  },
  'al-insulated': {
    src: alInsulatedDrawingImg,
    caption: '예시 도면 · 개구부 폭·높이는 현장에 맞춰 제작',
    alt: '알루미늄 단열셔터 구조도 — 브라켓, 셔터박스, 알루미늄 샤프트, 가이드레일, AL 슬랫, 하부 씰, 푸시버튼 스위치 위치',
  },
  'overhead-door': {
    src: overheadDrawingImg, // wide 없음 → 박스 안 78%(최대 520px) + 여백
    caption: '구성도 · 개구부 폭·높이는 현장에 맞춰 제작 (OPEN WIDTH / HEIGHT = VAR.)',
    title: '구성도 · 제품 사양',
    alt: '오버헤드도어 구성도 — 드럼, 스프링, 샤프트, 모터, 수동 체인, 패널, 힌지·롤러, 채광창, 하부 실, 컨트롤 위치',
  },
};

// 패널 종류 사진 (한 장) · 개폐 방식 그림 (openTypes와 같은 순서)
const PANEL_IMAGES: Partial<Record<string, string>> = {
  'overhead-door': overheadPanelImg,
};
// 카드마다 그림이 있는 경우(알루미늄 슬랫 단면) — panels와 같은 순서. 이게 있으면 왼쪽 큰 사진 대신 카드 위에 그림
const PANEL_CARD_IMAGES: Partial<Record<string, (string | undefined)[]>> = {
};
// 슬랫 계열 사진 — slatGroups와 같은 순서
const SLAT_GROUP_IMAGES: Partial<Record<string, string[]>> = {
  'al-insulated': [slatExtrudedSetImg, slatInsulatedSetImg],
  'al-wind': [windExtrudedSetImg],
  'al-wind-insulated': [windInsulatedSetImg],
};
// 투시창 사진 · 색상 실물(질감) 사진 — 색상 사진이 있으면 CSS 미니 도어 대신 사진 타일로
const WINDOW_IMAGES: Partial<Record<string, string>> = {
  'overhead-door': overheadWindowImg,
};
const COLOR_IMAGES: Partial<Record<string, string[]>> = {
  'overhead-door': [overheadWhiteImg, overheadGrayImg],
};
const OPEN_TYPE_IMAGES: Partial<Record<string, (string | undefined)[]>> = {
  'overhead-door': [openStandardImg, openHiliftImg, openFullVerticalImg],
};

// 형태 사진 — types와 같은 순서, 형태마다 여러 장이면 [닫힘 → 열림]처럼 화살표로 이어 보여줌
const STEEL_TYPE_IMAGES = [[steelTypeNormalImg], [steelTypeDoorClosedImg, steelTypeDoorOpenImg]];
const TYPE_IMAGES: Partial<Record<string, string[][]>> = {
  steel: STEEL_TYPE_IMAGES,
  'steel-insulated': STEEL_TYPE_IMAGES,
};
// 용도 카드 옆 슬랫 그림 (방화용·방범용이 같은 모양 슬랫이고 두께만 다름)
const USAGE_IMAGES: Partial<Record<string, string>> = {
  steel: steelSlatImg,
};
const STEEL_PRODUCTION_IMAGES = [steelForming1Img, steelForming2Img, steelForming3Img, steelForming4Img];
const PRODUCTION_IMAGES: Partial<Record<string, string[]>> = {
  steel: STEEL_PRODUCTION_IMAGES,
  'steel-insulated': STEEL_PRODUCTION_IMAGES,
};

// 내풍압 계열 공통 '셔터의 구성' 사진 (products.ts의 WIND_SHUTTER_PARTS 순서)
// 앞 3장은 배경까지 찍힌 사진 → cover(꽉 채움), 나머지는 흰 배경 누끼 → contain
const WIND_PART_IMAGES = [
  { src: windRail1Img, cover: true }, { src: windRail2Img, cover: true }, { src: windRail3Img, cover: true }, { src: windRail4Img },
  { src: windLock1Img }, { src: windLock2Img }, { src: windLock3Img }, { src: windLock4Img },
  { src: windGuideAImg }, { src: windGuideBImg }, { src: partBottomTImg }, { src: partBottomIImg },
];

// 구성품 사진 — products.ts의 components와 같은 순서. 비어 있으면 이미지 자리로 표시
// wide: 가로로 긴 사진(단면도+입체도 등) → 카드가 한 줄 전체를 차지
const COMPONENT_IMAGES: Partial<Record<string, ({ src: string; wide?: boolean; cover?: boolean } | undefined)[]>> = {
  'speed-door': [{ src: speedMotorImg }, { src: speedControlImg }, { src: speedGuideRailImg, wide: true }],
  'overhead-door': [{ src: overheadDriveImg }, { src: overheadSwitchImg }],
  'al-insulated': [{ src: partRailRearImg }, { src: partRailSideImg }, { src: partBottomTImg }, { src: partBottomIImg }],
  'al-wind': WIND_PART_IMAGES,
  'al-wind-insulated': WIND_PART_IMAGES,
};

// 제품 특징을 '사진 배경 띠 + 원형 아이콘'으로 보여줄 제품 — 배경 사진이 있으면 카드 대신 이 레이아웃
const FEATURE_BG: Partial<Record<string, string>> = {
  'overhead-door': overheadBandImg,
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

      {p.features.length > 0 && FEATURE_BG[p.slug] && !detail && <FeatureBand product={p} bg={FEATURE_BG[p.slug]!} />}
      {p.features.length > 0 && !(FEATURE_BG[p.slug] && !detail) && (
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

      {(p.types || p.usages) && <TypesBlock product={p} />}

      {/* 슬랫 종류가 있는 제품(알루미늄)은 '셔터의 구성'을 슬랫 종류 바로 다음에 — 같은 '제품 구성요소' 묶음 */}
      {p.components && !p.slatGroups && <ComponentsBlock product={p} />}
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
          {p.panels && <PanelBlock product={p} />}
          {p.slatGroups && <SlatGroupsBlock product={p} />}
          {p.slatGroups && p.components && <ComponentsBlock product={p} />}
          {(p.window || p.colors || p.sensors) && <OptionsBlock product={p} />}
          {p.openTypes && <OpenTypesBlock product={p} />}
        </>
      ) : (
        p.slatGroups ? (
          <>
            {/* 슬랫 종류가 있는 제품(내풍압 계열): [사양표 + 슬랫 두께표 | 슬랫 사진], 주요 설치 장소는 맨 아래 */}
            <SpecSlatBlock product={p} />
          </>
        ) : (p.specs.length > 0 || p.uses.length > 0) && (
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
      {/* 도면 없는 제품도 슬랫 단면이 있으면 사양·설치장소 아래에 */}
      {!drawing && p.panels && <PanelBlock product={p} />}
      {!drawing && p.slatGroups && p.components && <ComponentsBlock product={p} />}

      {p.production && <ProductionBlock product={p} />}
      {p.reports?.map((r) => <ReportBlock key={r.reportNo} report={r} />)}

      {/* 주요 설치 장소 — 상세 맨 아래(상담 바로 위). 도면·슬랫이 없는 제품은 위에서 사양표 옆에 붙어 나옴 */}
      {(drawing || p.slatGroups) && p.uses.length > 0 && (
        <section className={cx('container', s.block)} aria-labelledby="uses-title">
          <BlockHead en="APPLICATION" title="주요 설치 장소" id="uses-title" />
          <ul className={s.uses}>
            {p.uses.map((u) => <li key={u}>{u}</li>)}
          </ul>
        </section>
      )}
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

/**
 * 제품 특징 — 사진 배경 띠 + 원형 아이콘 (카탈로그의 동그란 아이콘 배지를 키운 형태)
 * 사진 위에 네이비 그라데이션을 덮어 글자가 읽히게 하고, 아이콘은 반투명 유리 원 + 바깥 링
 */
function FeatureBand({ product: p, bg }: { product: ProductDetail; bg: string }) {
  return (
    <section className={s.featureBand} aria-labelledby="features-title">
      <img className={s.featureBandBg} src={bg} alt="" aria-hidden="true" loading="lazy" />
      <div className={cx('container', s.featureBandInner)}>
        <div className={s.featureBandHead}>
          <p className={s.featureBandEn}>FEATURES</p>
          <h3 id="features-title" className={s.featureBandTitle}>제품 특징</h3>
        </div>
        <ol className={s.featureIcons}>
          {p.features.map((f, i) => (
            <li key={f.title} className={s.featureIconItem}>
              <span className={s.featureCircle} aria-hidden="true">
                <FeatureIcon title={f.title} />
              </span>
              <span className={s.featureIconNo}>{pad(i + 1)}</span>
              <h4 className={s.featureIconTitle}>{f.title}</h4>
              <p className={s.featureIconBody}>{f.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/**
 * 형태 + 용도 — [형태 카드(사진)] 다음 줄에 [용도 카드(아이콘 + 큰 사양 숫자 + 작동 방식)]
 * 비상문 일체형처럼 사진이 2장이면 [닫힘 → 열림] 사이에 화살표
 */
function TypesBlock({ product: p }: { product: ProductDetail }) {
  const imgs = TYPE_IMAGES[p.slug] ?? [];
  return (
    <section className={cx('container', s.block)} aria-labelledby="types-title">
      <BlockHead en="TYPE & USAGE" title="형태 · 용도" id="types-title" />
      {p.types && (
        <ul className={s.types}>
          {p.types.map((x, i) => {
            const set = imgs[i] ?? [];
            return (
              <li key={x.nameEn} className={s.typeCard}>
                <div className={s.typeImgs}>
                  {set.length === 0 && <Media className={s.typeImg} label={`IMAGE — ${x.nameEn}`} />}
                  {set.map((src, j) => (
                    <Fragment key={src}>
                      {j > 0 && (
                        <span className={s.typeArrow} aria-hidden="true">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h11M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </span>
                      )}
                      <img className={s.typeImg} src={src} alt={`${p.name} ${x.name}${set.length > 1 ? (j === 0 ? ' — 닫힌 모습' : ' — 비상문을 연 모습') : ''}`} loading="lazy" />
                    </Fragment>
                  ))}
                </div>
                <div className={s.typeText}>
                  <p className={s.componentEn}>{x.nameEn}</p>
                  <h4 className={s.componentName}>{x.name}</h4>
                  <p className={s.componentBody}>{x.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {p.usages && (
        <div className={cx(s.usageWrap, USAGE_IMAGES[p.slug] && s.usageWrapImg)}>
        {USAGE_IMAGES[p.slug] && (
          <figure className={s.usageFig}>
            <img src={USAGE_IMAGES[p.slug]} alt={`${p.name} 슬랫 — ${p.usages.map((u) => `${u.name} ${u.spec}`).join(', ')}`} loading="lazy" />
            <figcaption>슬랫 SLAT</figcaption>
          </figure>
        )}
        <ul className={s.usages}>
          {p.usages.map((u) => (
            <li key={u.nameEn} className={cx(s.usage, u.icon === 'fire' && s.usageFire)}>
              <span className={s.usageIcon} aria-hidden="true">{USAGE_ICONS[u.icon]}</span>
              <div className={s.usageMain}>
                <p className={s.usageEn}>{u.nameEn}</p>
                <h4 className={s.usageName}>{u.name}</h4>
              </div>
              <dl className={s.usageSpec}>
                <dt>{u.specLabel}</dt>
                <dd>{u.spec}</dd>
              </dl>
              <ul className={s.usageItems}>
                {u.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </li>
          ))}
        </ul>
        </div>
      )}
    </section>
  );
}

const usageSvg = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const USAGE_ICONS: Record<'fire' | 'security', ReactNode> = {
  fire: usageSvg(<path d="M12 21c-3.9 0-7-2.8-7-6.5 0-2.6 1.6-4.4 3-6 .4 1.6 1.4 2.5 2.2 2.8C10 8.6 11 5.5 14 3c.2 3 1.7 4.6 3 6.2 1.2 1.5 2 3.1 2 5.3 0 3.7-3.1 6.5-7 6.5Z" />),
  security: usageSvg(<><path d="M12 3 5 6v5.5c0 4.2 2.9 7.9 7 9.5 4.1-1.6 7-5.3 7-9.5V6l-7-3Z" /><rect x="9" y="11" width="6" height="5" rx="1" /><path d="M10.2 11V9.6a1.8 1.8 0 0 1 3.6 0V11" /></>),
};

/** 생산 설비 — 제목 띠 + 사진 4장 그리드 */
function ProductionBlock({ product: p }: { product: ProductDetail }) {
  const imgs = PRODUCTION_IMAGES[p.slug] ?? [];
  const pr = p.production!;
  return (
    <section className={cx('container', s.block)} aria-labelledby="production-title">
      <BlockHead en="PRODUCTION" title={pr.title} id="production-title" />
      <p className={s.productionBody}>{pr.body}</p>
      <ul className={s.production}>
        {imgs.map((src, i) => (
          <li key={src}>
            <img src={src} alt={`${p.name} 슬랫 포밍 라인 ${i + 1}`} loading="lazy" />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** 구성품 — 사진 카드 3장 (영문 라벨 + 이름 + 한 줄 설명) */
function ComponentsBlock({ product: p }: { product: ProductDetail }) {
  const imgs = COMPONENT_IMAGES[p.slug] ?? [];
  const list = p.components!.map((c, i) => ({ ...c, img: imgs[i] }));
  // group이 있으면 같은 group끼리 묶어 소제목 + 카드 줄, 없으면 한 줄
  const groups = list.reduce<{ title?: string; items: typeof list }[]>((acc, c) => {
    const last = acc[acc.length - 1];
    if (last && last.title === c.group) last.items.push(c);
    else acc.push({ title: c.group, items: [c] });
    return acc;
  }, []);
  return (
    <section className={cx('container', s.block)} aria-labelledby="components-title">
      <BlockHead en={p.componentsHead?.en ?? 'COMPONENTS'} title={p.componentsHead?.title ?? '구성품'} id="components-title" />
      {groups.map((g, gi) => (
        <div key={gi} className={s.componentGroup}>
          {g.title && <h4 className={s.componentGroupTitle}>{g.title}</h4>}
          <ul className={cx(s.components, g.items.length >= 4 && s.componentsFour)}>
            {g.items.map((c) => (
              <li key={c.nameEn + c.name} className={cx(s.component, c.img?.wide && s.componentWide)}>
                <Media className={cx(s.componentImg, c.img?.cover && s.componentImgCover)} src={c.img?.src} alt={`${p.name} ${c.name}`} label={`IMAGE — ${c.nameEn}`} />
                <div className={s.componentText}>
                  <p className={s.componentEn}>{c.nameEn}</p>
                  <h5 className={s.componentName}>{c.name}</h5>
                  <p className={s.componentBody}>{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
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

/**
 * 옵션 묶음 — [투시창] [도어 색상] [센서] 중 있는 것만 2열로.
 * 색상은 실물 질감 사진(COLOR_IMAGES)이 있으면 사진 타일, 없으면 CSS로 그린 미니 도어 견본
 */
function OptionsBlock({ product: p }: { product: ProductDetail }) {
  const colorImgs = COLOR_IMAGES[p.slug];
  return (
    <section className={cx('container', s.block, s.options)} aria-label="투시창·색상·센서 옵션">
      {p.window && (
        <div>
          <BlockHead en="WINDOW" title={p.window.title} />
          <figure className={s.windowFig}>
            <Media className={s.windowImg} src={WINDOW_IMAGES[p.slug]} alt={`${p.name} ${p.window.title} — 패널에 끼운 사각 채광창`} label="IMAGE — WINDOW" />
            <figcaption>
              <span className={s.headroom}>{p.window.spec}</span>
              <p className={s.optionsLead}>{p.window.body}</p>
            </figcaption>
          </figure>
        </div>
      )}
      {p.colors && (
        <div>
          <BlockHead en="DOOR COLOR" title="도어 색상" />
          {colorImgs ? (
            <>
              <p className={s.optionsLead}>엠보스 가공 강판으로 질감이 살아 있습니다.</p>
              <ul className={s.colorTiles}>
                {p.colors.map((c, i) => (
                  <li key={c.nameEn}>
                    <img src={colorImgs[i]} alt={`${c.name} 패널 표면 질감`} loading="lazy" />
                    <span><b>{c.name}</b> {c.nameEn}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
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
            </>
          )}
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

/**
 * 패널(슬랫) 종류 — 두 가지 배치
 *  ① 사진 1장 + 비교 카드: [패널 사진 | 두께·피치 카드] (오버헤드도어)
 *  ② 카드마다 단면 그림: 그림 카드를 가로로 나열 (알루미늄 슬랫, PANEL_CARD_IMAGES)
 */
function PanelBlock({ product: p }: { product: ProductDetail }) {
  const panels = p.panels!;
  const head = p.panelsHead ?? { en: 'PANEL', title: '패널 종류', sizeLabel: '전체 두께' };
  const cardImgs = PANEL_CARD_IMAGES[p.slug];
  const dl = (x: (typeof panels)[number]) => (
    <dl className={s.panelDl}>
      <div><dt>{head.sizeLabel}</dt><dd>{x.thickness}</dd></div>
      <div><dt>피치</dt><dd>{x.pitch}</dd></div>
    </dl>
  );
  return (
    <section className={cx('container', s.block)} aria-labelledby="panel-title">
      <BlockHead en={head.en} title={head.title} id="panel-title" />
      {cardImgs ? (
        <ul className={cx(s.panelImgCards, panels.length === 1 && s.panelImgSingle)}>
          {panels.map((x, i) => (
            <li key={x.nameEn + x.thickness} className={s.panelImgCard}>
              <Media className={s.panelCardImg} src={cardImgs[i]} alt={`${x.name} 단면도 — ${x.thickness}, 피치 ${x.pitch}`} label={`IMAGE — ${x.nameEn}`} />
              <div className={s.panelImgText}>
                <p className={s.panelEn}>{x.nameEn}</p>
                <h4 className={s.panelName}>{x.name}</h4>
                {dl(x)}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className={s.panelWrap}>
          <Media className={s.panelImg} src={PANEL_IMAGES[p.slug]} alt={`${p.name} ${head.title} 단면 — ${panels.map((x) => x.nameEn).join(', ')}`} label={`IMAGE — ${head.en}`} />
          <ul className={s.panelCards}>
            {panels.map((x) => (
              <li key={x.nameEn + x.thickness} className={s.panelCard}>
                <p className={s.panelEn}>{x.nameEn}</p>
                <h4 className={s.panelName}>{x.name}</h4>
                {dl(x)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/**
 * 슬랫 종류 — 계열(이중압출 / 단열)마다 [사진 + 두께별 비교표] 2열.
 * 표는 두께가 열(가로)로 나란한 비교형: 첫 열이 항목 머리(th scope=row), 첫 행이 두께(th scope=col)
 */
function SlatGroupsBlock({ product: p }: { product: ProductDetail }) {
  return (
    <section className={cx('container', s.block)} aria-labelledby="slat-title">
      <BlockHead en="SLAT" title="슬랫 종류" id="slat-title" />
      <SlatGroupList product={p} />
    </section>
  );
}

/**
 * 제품 사양 + 슬랫 — 왼쪽 열에 [사양표 → 슬랫 두께표]를 같은 폭으로 쌓고, 오른쪽에 슬랫 사진을 왼쪽 열 높이만큼 늘림.
 * 표 두 개의 시작선·끝선이 맞고, 사진이 표 전체 높이를 채워 양쪽 끝선이 같아짐
 */
function SpecSlatBlock({ product: p }: { product: ProductDetail }) {
  const imgs = SLAT_GROUP_IMAGES[p.slug] ?? [];
  const groups = p.slatGroups!;
  return (
    <section className={cx('container', s.block)} aria-labelledby="spec-title">
      <BlockHead en="SPECIFICATION" title="제품 사양 · 슬랫" id="spec-title" />
      <div className={s.specSlat}>
        <div className={s.specSlatTables}>
          <SpecTable product={p} />
          {groups.map((g) => (
            <div key={g.nameEn} className={s.specSlatGroup}>
              <h4 className={s.specSlatHead}>
                {g.name} <span>{g.nameEn}</span>
              </h4>
              <p className={s.slatGroupBody}>{g.body}</p>
              <SlatTable group={g} />
            </div>
          ))}
        </div>
        <div className={s.specSlatImgs}>
          {groups.map((g, i) => (
            <Media key={g.nameEn} className={s.specSlatImg} src={imgs[i]} alt={`${g.name} 두께별 견본 ${g.rows.length}종`} label={`IMAGE — ${g.nameEn}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** 슬랫 두께별 비교표 (두께가 열로 나란함) */
function SlatTable({ group: g }: { group: NonNullable<ProductDetail['slatGroups']>[number] }) {
  return (
    <table className={s.slatTable}>
      <caption className="sr-only">{g.name} 두께별 전체두께·피치</caption>
      <thead>
        <tr>
          <th scope="col">두께</th>
          {g.rows.map((r) => <th key={r.thickness} scope="col">{r.thickness}</th>)}
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">전체두께</th>
          {g.rows.map((r) => <td key={r.thickness}>{r.total}</td>)}
        </tr>
        <tr>
          <th scope="row">피치</th>
          {g.rows.map((r) => <td key={r.thickness}>{r.pitch}</td>)}
        </tr>
      </tbody>
    </table>
  );
}

/** 슬랫 계열 목록 — stacked: 옆 칸(제품 사양 옆)에 들어갈 때 계열이 하나여도 [사진 / 이름 / 표] 세로로 */
function SlatGroupList({ product: p, stacked = false }: { product: ProductDetail; stacked?: boolean }) {
  const imgs = SLAT_GROUP_IMAGES[p.slug] ?? [];
  const single = p.slatGroups!.length === 1;
  return (
    // 계열이 하나면 [사진 | 이름·표] 가로 배치 (stacked면 세로)
    <div className={cx(s.slatGroups, single && (stacked ? s.slatGroupsStacked : s.slatGroupsSingle))}>
      {p.slatGroups!.map((g, i) => (
        <figure key={g.nameEn} className={s.slatGroup}>
          <Media className={s.slatGroupImg} src={imgs[i]} alt={`${g.name} 두께별 견본 ${g.rows.length}종`} label={`IMAGE — ${g.nameEn}`} />
          <figcaption className={s.slatGroupHead}>
            <p className={s.panelEn}>{g.nameEn}</p>
            <h4 className={s.panelName}>{g.name}</h4>
            <p className={s.slatGroupBody}>{g.body}</p>
          </figcaption>
          <SlatTable group={g} />
        </figure>
      ))}
    </div>
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
