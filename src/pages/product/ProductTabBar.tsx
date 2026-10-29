import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProduct, productPath, type CategoryInfo } from '../../data/products';
import { cx } from '../../components/ui';
import s from './ProductTabBar.module.css';

// 제품 전환은 탭처럼 동작 → 기록을 쌓지 않고(replace) 스크롤도 유지 (App의 스크롤 처리에서 keepScroll을 봄)
const swap = { replace: true, state: { keepScroll: true } } as const;

/**
 * 제품 탭 바 — 소개(회색 띠)와 상세(흰 영역) 경계에 놓이는 전체 폭 밑줄형 탭 (코아드 상단 탭 방식).
 * 1단계 = 구분(알루미늄: 방범셔터·단열셔터·내풍압셔터·내풍압단열셔터) 탭, 칸 너비는 균등.
 * 2단계 = 구분 안에 제품이 여럿이면(방범셔터: 싱글·이중·철재·웨이브) 탭 아래 칩 줄.
 * 모바일(≤767px): 1단계 탭은 드롭다운으로 바뀌고, 2단계 칩은 그대로 아래에
 * 제품이 하나뿐인 카테고리에는 쓰지 않음 (부모에서 판단)
 */
export function ProductTabBar({ category, current }: { category: CategoryInfo; current: string }) {
  const list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // 바깥을 누르거나 ESC를 누르면 닫힘
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // 탭 = 1단계(구분). 구분이 없는 카테고리(철재 등)는 제품 하나하나가 곧 1단계
  const groups = category.groups ?? category.slugs.map((slug) => ({ key: slug, label: getProduct(slug)!.name, slugs: [slug] }));
  const index = groups.findIndex((g) => g.slugs.includes(current));
  const active = groups[index];
  // 2단계: 선택한 구분 안에 제품이 여럿이면(방범셔터 4종) 탭 아래에 칩으로
  const chips = active && active.slugs.length > 1 ? active : undefined;

  // 모바일처럼 넘칠 때 선택 탭을 가운데로 (scrollIntoView는 페이지 세로 스크롤까지 움직여서 목록만 직접 스크롤)
  useEffect(() => {
    const el = list.current;
    const item = el?.children[index] as HTMLElement | undefined;
    if (!el || !item || el.scrollWidth <= el.clientWidth) return;
    el.scrollTo({ left: item.offsetLeft - el.offsetLeft - (el.clientWidth - item.offsetWidth) / 2, behavior: 'smooth' });
  }, [index]);

  // 칩 줄도 넘치면(모바일) 선택한 칩이 보이게 가로 스크롤
  const chipList = useRef<HTMLUListElement>(null);
  const chipIndex = chips ? chips.slugs.indexOf(current) : -1;
  useEffect(() => {
    const el = chipList.current;
    const item = el?.children[chipIndex] as HTMLElement | undefined;
    if (!el || !item || el.scrollWidth <= el.clientWidth) return;
    el.scrollTo({ left: item.offsetLeft - el.offsetLeft - (el.clientWidth - item.offsetWidth) / 2, behavior: 'smooth' });
  }, [chipIndex]);

  return (
    <nav className={s.bar} aria-label={`${category.label} 제품`}>
      {/* 1단계 탭 — 구분을 누르면 그 구분의 첫 제품으로 */}
      <ul ref={list} className={cx('container', s.list)}>
        {groups.map((g, i) => (
          <li key={g.key}>
            <Link to={productPath(category, g.slugs[0])} {...swap} className={s.tab} aria-current={i === index ? 'page' : undefined}>
              {g.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* 모바일 전용 드롭다운 — 1단계(구분)만. 2단계는 아래 칩으로 (PC와 같은 구조)
          링크 목록을 펼치는 '공개(disclosure)' 패턴: 버튼 aria-expanded + 아래 패널 */}
      <div className={cx('container', s.mobile)} ref={box}>
        <button type="button" className={s.select} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((v) => !v)}>
          <span className={s.selectLabel}>제품 선택</span>
          <span className={s.selectValue}>{active?.label}</span>
          <span className={cx(s.chevron, open && s.chevronOpen)} aria-hidden="true" />
        </button>
        <div id={panelId} className={cx(s.panel, open && s.panelOpen)} inert={!open}>
          <ul>
            {groups.map((g, i) => (
              <li key={g.key}>
                <Link
                  to={productPath(category, g.slugs[0])}
                  {...swap}
                  className={s.option}
                  aria-current={i === index ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {g.label}
                  {g.slugs.length > 1 && <span className={s.count}>{g.slugs.length}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 2단계 칩 — 선택한 구분에 제품이 여럿일 때만. 넘치면 가로 스크롤 */}
      {chips && (
        <div className={s.chipsRow}>
          <ul ref={chipList} className={cx('container', s.chips)} aria-label={`${chips.label} 종류`}>
            {chips.slugs.map((slug) => (
              <li key={slug}>
                <Link to={productPath(category, slug)} {...swap} className={s.chip} aria-current={slug === current ? 'page' : undefined}>
                  {getProduct(slug)!.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
