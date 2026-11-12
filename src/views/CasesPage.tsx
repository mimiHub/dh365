'use client';

import { useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { Navigate, useParams } from '@/lib/router';
import { CASES, PRODUCTS, type CaseItem } from '../data/site';
import { CASE_IMAGES } from '../data/caseImages';
import { Icon, Media, Pagination, cx } from '../components/ui';
import { CategoryNav, EmptyState, ListHead, SearchBox, SubHero } from '../components/page';
import { useListQuery } from '../hooks/useListQuery';
import { Contact } from '../sections/Contact';
import s from './CasesPage.module.css';

const PAGE_SIZE = 12; // 3열·2열·1열 어느 쪽으로 나눠도 마지막 줄이 꽉 차는 수
const nameOf = (key: string) => PRODUCTS.find((p) => p.key === key)?.name ?? '';
const casesPath = (key?: string) => (key ? `/cases/${key}` : '/cases');
const pad = (n: number) => String(n).padStart(2, '0');

// 분류별 개수 — 원본 데이터가 고정이라 컴포넌트 밖에서 한 번만 계산 (렌더마다 다시 셀 필요 없음)
const COUNTS: Record<string, number> = Object.fromEntries(PRODUCTS.map((p) => [p.key, CASES.filter((c) => c.product === p.key).length]));
const CATEGORIES = [{ key: '', name: '전체', count: CASES.length }, ...PRODUCTS.map((p) => ({ key: p.key, name: p.name, count: COUNTS[p.key] }))].map((c) => ({ ...c, to: casesPath(c.key) }));

// 히어로 배경 모자이크 — 사진이 있는 사례 중 분류가 섞이도록 고른 8장
const HERO_TILES = [2, 1, 5, 3, 13, 20, 26, 4].map((id) => CASE_IMAGES[id]).filter(Boolean) as string[];

/**
 * 시공사례 — /cases/:category?  (?q=검색어 &page=번호)
 * 분류·검색어·페이지를 모두 주소에 담아 둠 → 새로고침·뒤로가기·링크 공유를 해도 같은 목록이 보임
 */
export function CasesPage() {
  const { category = '' } = useParams();
  const dialog = useRef<HTMLDialogElement>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const product = PRODUCTS.find((p) => p.key === category);

  // 목록은 state가 아니라 '주소에서 계산' — 검색·페이지 규칙은 useListQuery(자료실·견적문의와 공용)
  const inCategory = product ? CASES.filter((c) => c.product === product.key) : CASES;
  const lq = useListQuery({ items: inCategory, pageSize: PAGE_SIZE, path: casesPath(category) });
  const { q, list } = lq;

  // 없는 분류 주소 → 전체 (Hook 호출이 모두 끝난 뒤에 분기)
  if (category && !product) return <Navigate to="/cases" replace />;


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
      <SubHero
        en="Projects"
        title="시공사례"
        desc="대한방화가 설계·시공한 현장을 제품별로 확인하세요."
        withNav
        // 사진 한 장 대신 실제 현장 사진 8장 모자이크
        bg={
          <div className={s.mosaic}>
            {HERO_TILES.map((src, i) => (
              <img key={i} src={src} alt="" style={{ animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
        }
      />

      <div className={s.band}>
        <CategoryNav items={CATEGORIES} current={category} label="시공사례 분류" id="case-cats" />

        <div className={cx('container', s.body)}>
          <ListHead ref={lq.topRef} title={<><em>{label}</em> 시공사례</>} total={list.length} q={q}>
            {/* key: 분류·검색어가 바뀌면 입력칸을 새로 그려 주소의 검색어(defaultValue)와 맞춤 */}
            <SearchBox key={`${category}|${q}`} id="cases-q" label="현장명 검색" placeholder="현장명을 입력하세요" defaultValue={q} onSearch={lq.search} />
          </ListHead>

          {lq.shown.length ? (
            // key: 분류·검색·페이지가 바뀔 때마다 목록을 새로 그려 등장 모션이 다시 재생되게
            <ul key={`${category}|${q}|${lq.page}`} className={s.grid}>
              {lq.shown.map((c, i) => {
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
            <EmptyState noun="시공사례" q={q} resetTo={casesPath(category)} />
          )}

          <Pagination page={lq.page} pages={lq.pages} onGo={lq.goPage} />
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
                  <Icon name="left" />
                </button>
                <button type="button" className={s.round} onClick={() => step(1)} aria-label="다음 사례">
                  <Icon name="right" />
                </button>
              </div>
            </div>
            <button type="button" className={s.close} onClick={() => dialog.current?.close()} aria-label="닫기">
<Icon name="close" size={22} />
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
