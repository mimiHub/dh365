import { Fragment, useEffect, useRef } from 'react';
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
};
const HERO_IMAGES: Partial<Record<ProductCategory, string>> = {
  screen: screenShutterImg,
  steel: steelShutterImg,
  aluminum: windShutterImg,
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
 * 제품소개 — 코아드 제품 페이지 구성
 * [카테고리 탭(1단계)] → [히어로: 카테고리명 + 구분 탭(2단계, 알루미늄셔터)] → [히어로에 걸친 제품 카드]
 * → [강조 문장] → [선택한 제품 상세] → [견적상담]
 *
 * 선택 상태를 useState가 아니라 URL(/products/aluminum/wave)에 둠:
 * 새로고침·공유·뒤로가기에도 같은 제품이 보이고, 메뉴에서 바로 특정 제품으로 들어올 수 있음.
 */
export function ProductPage() {
  const { category: catKey, slug } = useParams();
  const navigate = useNavigate();
  const track = useRef<HTMLUListElement>(null);
  const catList = useRef<HTMLUListElement>(null);

  const category = getCategory(catKey);
  // 선택 제품 → 그 제품이 속한 구분 → 카드 목록 순으로 정해짐 (구분 탭의 선택 상태도 URL 하나로 결정)
  const product = (slug && category?.slugs.includes(slug) ? getProduct(slug) : undefined) ?? (category && getProduct(category.slugs[0]));
  const group = category && product ? groupOf(category, product.slug) : undefined;
  const items = productsOf(group?.slugs ?? category?.slugs ?? []);
  const index = product ? items.indexOf(product) : 0;

  // 가로로 넘치는 목록에서 선택 항목을 가운데로 (scrollIntoView는 페이지 세로 스크롤까지 움직여서 목록만 직접 스크롤)
  const centerIn = (list: HTMLElement | null, i: number, behavior: ScrollBehavior) => {
    const item = list?.children[i] as HTMLElement | undefined;
    if (!list || !item || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2, behavior });
  };
  const catIndex = PRODUCT_CATEGORIES.findIndex((c) => c.key === category?.key);
  // 카테고리 탭: 모바일에서 선택 탭이 화면 밖에 있으면 보이게 (페이지 진입 시라 애니메이션 없이)
  useEffect(() => centerIn(catList.current, catIndex, 'instant'), [catIndex]);
  // 제품 카드: 구분이 바뀌면 카드 목록이 새로 그려지므로 group도 의존성에 포함
  useEffect(() => centerIn(track.current, index, 'smooth'), [index, group?.key]);

  // 잘못된 카테고리 주소 → 첫 카테고리로 (Hook 호출이 모두 끝난 뒤에 분기해야 Hook 순서 규칙을 지킴)
  if (!category || !product) return <Navigate to={productPath(PRODUCT_CATEGORIES[0])} replace />;

  // 같은 카테고리 안 제품 전환은 탭처럼 동작 → 기록을 쌓지 않고(replace) 스크롤도 유지
  const go = (i: number) => navigate(productPath(category, items[i].slug), { replace: true, state: { keepScroll: true } });

  return (
    <>
      {/* 카테고리 탭 — 코아드 상단 탭 바 */}
      <nav className={s.catBar} aria-label="제품 분류">
        <ul ref={catList} className={cx('container', s.catList)}>
          {PRODUCT_CATEGORIES.map((c) => (
            <li key={c.key}>
              <Link to={productPath(c)} className={s.catLink} aria-current={c.key === category.key ? 'page' : undefined}>
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className={s.hero} id="top" aria-labelledby="product-cat-title">
        <div className={cx(s.heroBg, HERO_IMAGES[category.key] && s.hasPhoto)} aria-hidden="true">
          {HERO_IMAGES[category.key] && <img src={HERO_IMAGES[category.key]} alt="" />}
        </div>
        <div className={s.heroText}>
          <h1 id="product-cat-title" className={s.heroTitle}>{category.label}</h1>
          <p className={s.heroEn}>{category.labelEn}</p>
          {category.groups && group && (
            // 2단계 구분 — 각 구분의 첫 제품으로 이동. 구분 전환은 탭처럼 기록을 쌓지 않고 스크롤 유지
            <nav aria-label={`${category.label} 구분`}>
              <ul className={s.groups}>
                {category.groups.map((g) => (
                  <li key={g.key}>
                    <Link
                      to={productPath(category, g.slugs[0])}
                      replace
                      state={{ keepScroll: true }}
                      className={s.groupLink}
                      aria-current={g.key === group.key ? 'true' : undefined}
                    >
                      {g.label}
                      {g.slugs.length > 1 && <span className={s.groupCount}>{g.slugs.length}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </section>

      {/* 제품 카드 — 히어로 하단에 걸쳐 놓임. 선택한 카드만 설명이 열려 키가 커지고 테두리가 생김 */}
      {/* key: 구분이 바뀌면 카드 목록을 새로 그려 트랙 스크롤 위치를 처음으로 */}
      <div className={s.cardsWrap} key={group?.key ?? category.key}>
        {items.length > 1 && (
          <>
            <button type="button" className={cx(s.arrow, s.prev)} onClick={() => go(index - 1)} disabled={index === 0} aria-label="이전 제품">
              <Chevron dir="left" />
            </button>
            <button type="button" className={cx(s.arrow, s.next)} onClick={() => go(index + 1)} disabled={index === items.length - 1} aria-label="다음 제품">
              <Chevron dir="right" />
            </button>
          </>
        )}
        <ul ref={track} className={s.cards} aria-label={`${group?.label ?? category.label} 제품`}>
          {items.map((p, i) => {
            const on = i === index;
            return (
              <li key={p.slug} className={s.cardItem}>
                <Link
                  to={productPath(category, p.slug)}
                  replace
                  state={{ keepScroll: true }}
                  className={cx(s.card, on && s.cardOn)}
                  aria-current={on ? 'true' : undefined}
                >
                  <span className={s.cardEn}>{p.nameEn}</span>
                  <strong className={s.cardName}>{p.name}</strong>
                  {/* 닫힌 카드의 요약은 화면에서만 숨김 — 스크린리더는 모든 카드 요약을 읽을 수 있게 */}
                  <span className={cx(s.cardDesc, !on && 'sr-only')}>{p.summary}</span>
                  <Media className={s.cardMedia} src={PRODUCT_IMAGES[p.slug]} label={`IMAGE — ${pad(i + 1)}`} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <p className={cx('container', s.highlight)}>
        <Highlight text={group?.highlight ?? category.highlight} />
      </p>

      {/* key: 제품이 바뀔 때 상세 영역을 새로 그려 등장 모션이 다시 재생되게 */}
      <ProductBody key={product.slug} product={product} />

      <Contact />
    </>
  );
}

function ProductBody({ product: p }: { product: ProductDetail }) {
  const ready = p.intro !== '';

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
        <Media className={s.overviewMedia} src={PRODUCT_IMAGES[p.slug]} alt={PRODUCT_IMAGES[p.slug] ? `${p.name} 시공 사진` : undefined} label={`IMAGE — ${p.nameEn}`} />
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

      {(p.specs.length > 0 || p.uses.length > 0) && (
        <section className={cx('container', s.block, s.specWrap)} aria-labelledby="spec-title">
          {p.specs.length > 0 && (
            <div>
              <BlockHead en="SPECIFICATION" title="제품 사양" id="spec-title" />
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
      )}
    </div>
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
