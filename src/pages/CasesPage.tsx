import { useRef, useState, type FormEvent, type KeyboardEvent, type MouseEvent } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CASES, PRODUCTS, type CaseItem } from '../data/site';
import { CASE_IMAGES } from '../data/caseImages';
import { Media, cx } from '../components/ui';
import { Contact } from '../sections/Contact';
import s from './CasesPage.module.css';

const PAGE_SIZE = 12; // 3열·2열·1열 어느 쪽으로 나눠도 마지막 줄이 꽉 차는 수
const nameOf = (key: string) => PRODUCTS.find((p) => p.key === key)?.name ?? '';
const casesPath = (key?: string) => (key ? `/cases/${key}` : '/cases');
const pad = (n: number) => String(n).padStart(2, '0');

// 분류별 개수 — 원본 데이터가 고정이라 컴포넌트 밖에서 한 번만 계산 (렌더마다 다시 셀 필요 없음)
const COUNTS: Record<string, number> = Object.fromEntries(PRODUCTS.map((p) => [p.key, CASES.filter((c) => c.product === p.key).length]));
const CATEGORIES = [{ key: '', name: '전체', count: CASES.length }, ...PRODUCTS.map((p) => ({ key: p.key, name: p.name, count: COUNTS[p.key] }))];

// 히어로 배경 모자이크 — 사진이 있는 사례 중 분류가 섞이도록 고른 8장
const HERO_TILES = [2, 1, 5, 3, 13, 20, 26, 4].map((id) => CASE_IMAGES[id]).filter(Boolean) as string[];

// 검색: 띄어쓰기 차이는 무시 ("지하 주차장" = "지하주차장") — 한글 현장명은 띄어쓰기가 제각각이라
const squash = (t: string) => t.replace(/\s+/g, '').toLowerCase();

/**
 * 시공사례 — /cases/:category?  (?q=검색어 &page=번호)
 * 분류·검색어·페이지를 모두 주소에 담아 둠 → 새로고침·뒤로가기·링크 공유를 해도 같은 목록이 보임
 */
export function CasesPage() {
  const { category = '' } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const listTop = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [openId, setOpenId] = useState<number | null>(null);

  const q = (params.get('q') ?? '').trim();
  const product = PRODUCTS.find((p) => p.key === category);

  // 목록은 state가 아니라 '주소에서 계산' — 원본은 CASES 하나, 나머지는 파생 데이터
  const inCategory = product ? CASES.filter((c) => c.product === product.key) : CASES;
  const list = q ? inCategory.filter((c) => squash(c.title).includes(squash(q))) : inCategory;
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(params.get('page')) || 1), pages); // 범위 밖 번호는 가까운 끝으로
  const shown = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 없는 분류 주소 → 전체 (Hook 호출이 모두 끝난 뒤에 분기)
  if (category && !product) return <Navigate to="/cases" replace />;

  // 분류 탭 = 탭처럼 동작 → 기록을 쌓지 않고(replace) 스크롤 유지. 분류를 바꾸면 검색어·페이지는 초기화
  const swap = { replace: true, state: { keepScroll: true } } as const;

  const search = (next: { q?: string; page?: number }) => {
    const sp = new URLSearchParams();
    const nq = next.q ?? q;
    if (nq) sp.set('q', nq);
    if (next.page && next.page > 1) sp.set('page', String(next.page));
    const qs = sp.toString();
    navigate({ pathname: casesPath(category), search: qs ? `?${qs}` : '' }, { state: { keepScroll: true } });
  };

  // 비제어 입력(defaultValue) + 제출 때 FormData로 읽기 — 글자마다 렌더할 필요가 없는 검색창에 알맞음
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    search({ q: String(new FormData(e.currentTarget).get('q') ?? '').trim(), page: 1 });
  };

  const goPage = (n: number) => {
    search({ page: n });
    listTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ── 사진 보기: 네이티브 <dialog> ──
  // showModal()이 포커스 가두기·Esc 닫기·배경 비활성(inert)을 브라우저가 해 줌. 닫으면 열었던 카드로 포커스가 돌아감
  const openIdx = openId === null ? -1 : list.findIndex((c) => c.id === openId);
  const current: CaseItem | undefined = list[openIdx];
  const open = (id: number) => {
    setOpenId(id);
    dialog.current?.showModal();
  };
  const step = (d: 1 | -1) => {
    if (openIdx < 0) return;
    setOpenId(list[(openIdx + d + list.length) % list.length].id);
  };
  const onDialogKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  };
  // 사진 바깥(어두운 배경)을 누르면 닫기 — 배경 클릭은 target이 dialog 자신
  const onDialogClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) dialog.current?.close();
  };

  const label = product?.name ?? '전체';

  return (
    <>
      <section className={s.hero} aria-labelledby="cases-hero-title">
        <div className={s.mosaic} aria-hidden="true">
          {HERO_TILES.map((src, i) => (
            <img key={i} src={src} alt="" style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
        <div className={s.heroText}>
          <p className={s.heroEn}>Projects</p>
          <h1 id="cases-hero-title" className={s.heroTitle}>시공사례</h1>
          <p className={s.heroDesc}>대한방화가 설계·시공한 현장을 제품별로 확인하세요.</p>
        </div>
      </section>

      <div className={s.band}>
        {/* 분류 — 히어로 아래쪽에 걸친 흰 패널. 각 칸에 사례 수를 같이 보여 줘 '어디에 얼마나 있는지'를 먼저 알 수 있게 */}
        <nav className={s.catWrap} aria-label="시공사례 분류">
          <ul className={s.cats}>
            {CATEGORIES.map((c) => {
              const on = c.key === category;
              return (
                <li key={c.key || 'all'}>
                  <Link to={casesPath(c.key)} {...swap} className={cx(s.cat, on && s.catOn)} aria-current={on ? 'page' : undefined}>
                    <span className={s.catName}>{c.name}</span>
                    <span className={s.catCount}>
                      {pad(c.count)}
                      <span className="sr-only">건</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={cx('container', s.body)}>
          <div className={s.toolbar} ref={listTop}>
            <h2 className={s.summary} aria-live="polite">
              <span>
                <em>{label}</em> 시공사례
              </span>
              <span className={s.total}>
                {q && <>‘{q}’ 검색 결과 </>}총 <strong>{list.length}</strong>건
              </span>
            </h2>

            {/* key: 분류가 바뀌면 입력칸을 새로 그려 주소의 검색어(defaultValue)와 맞춤 */}
            <form key={`${category}|${q}`} className={s.search} role="search" onSubmit={onSubmit}>
              <label htmlFor="cases-q" className="sr-only">현장명 검색</label>
              <input id="cases-q" name="q" type="search" defaultValue={q} placeholder="현장명을 입력하세요" className={s.searchInput} />
              <button type="submit" className={s.searchBtn} aria-label="검색">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="m20 20-4.2-4.2" />
                </svg>
              </button>
            </form>
          </div>

          {shown.length ? (
            // key: 분류·검색·페이지가 바뀔 때마다 목록을 새로 그려 등장 모션이 다시 재생되게
            <ul key={`${category}|${q}|${page}`} className={s.grid}>
              {shown.map((c, i) => {
                const img = CASE_IMAGES[c.id];
                return (
                  <li key={c.id} style={{ animationDelay: `${i * 50}ms` }}>
                    <button type="button" className={s.card} onClick={() => open(c.id)} aria-haspopup="dialog">
                      <span className={s.thumb}>
                        <Media className={s.media} src={img} label="IMAGE — 현장 사진" />
                        <span className={s.zoom} aria-hidden="true">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </span>
                      </span>
                      <span className={s.meta}>
                        <span className={s.chip}>{nameOf(c.product)}</span>
                        <strong className={s.title}>
                          <Marked text={c.title} q={q} />
                        </strong>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className={s.empty}>
              <p>{q ? <>‘{q}’에 맞는 시공사례가 없습니다.</> : '등록된 시공사례가 없습니다.'}</p>
              {q && (
                <Link to={casesPath(category)} {...swap} className={s.emptyReset}>
                  검색어 지우기
                </Link>
              )}
            </div>
          )}

          {pages > 1 && <Pagination page={page} pages={pages} onGo={goPage} />}
        </div>
      </div>

      <dialog ref={dialog} className={s.viewer} aria-labelledby="case-viewer-title" onClose={() => setOpenId(null)} onClick={onDialogClick} onKeyDown={onDialogKey}>
        {current && (
          <div className={s.viewerInner}>
            <Media className={s.viewerMedia} src={CASE_IMAGES[current.id]} alt={current.title} label="IMAGE — 현장 사진" />
            <div className={s.viewerBar}>
              <div className={s.viewerText}>
                <span className={s.chip}>{nameOf(current.product)}</span>
                <h2 id="case-viewer-title" className={s.viewerTitle}>{current.title}</h2>
              </div>
              <div className={s.viewerNav}>
                <span className={s.viewerCount}>
                  <strong>{pad(openIdx + 1)}</strong> / {pad(list.length)}
                </span>
                <button type="button" className={s.round} onClick={() => step(-1)} aria-label="이전 사례">
                  <Chevron dir="left" />
                </button>
                <button type="button" className={s.round} onClick={() => step(1)} aria-label="다음 사례">
                  <Chevron dir="right" />
                </button>
              </div>
            </div>
            <button type="button" className={s.close} onClick={() => dialog.current?.close()} aria-label="닫기">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        )}
      </dialog>

      <Contact />
    </>
  );
}

/** 검색어와 맞는 부분을 <mark>로 강조 (띄어쓰기 무시 검색이라, 띄어쓰기 없이 똑같이 들어 있을 때만 표시) */
function Marked({ text, q }: { text: string; q: string }) {
  const at = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + q.length)}</mark>
      {text.slice(at + q.length)}
    </>
  );
}

function Pagination({ page, pages, onGo }: { page: number; pages: number; onGo: (n: number) => void }) {
  return (
    <nav className={s.pager} aria-label="페이지">
      <button type="button" className={s.round} onClick={() => onGo(page - 1)} disabled={page === 1} aria-label="이전 페이지">
        <Chevron dir="left" />
      </button>
      <ol className={s.pages}>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            <button type="button" className={cx(s.pageNo, n === page && s.pageOn)} onClick={() => onGo(n)} aria-current={n === page ? 'page' : undefined}>
              {n}
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className={s.round} onClick={() => onGo(page + 1)} disabled={page === pages} aria-label="다음 페이지">
        <Chevron dir="right" />
      </button>
    </nav>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === 'left' ? 'M12.5 4.5 7 10l5.5 5.5' : 'M7.5 4.5 13 10l-5.5 5.5'} />
    </svg>
  );
}
