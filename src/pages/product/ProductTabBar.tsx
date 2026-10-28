import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProduct, productPath, type CategoryInfo } from '../../data/products';
import { cx } from '../../components/ui';
import s from './ProductTabBar.module.css';

// 제품 전환은 탭처럼 동작 → 기록을 쌓지 않고(replace) 스크롤도 유지 (App의 스크롤 처리에서 keepScroll을 봄)
const swap = { replace: true, state: { keepScroll: true } } as const;

/**
 * 제품 탭 바 — 소개(회색 띠)와 상세(흰 영역) 경계에 놓이는 전체 폭 밑줄형 탭 (코아드 상단 탭 방식).
 * 카테고리 안 제품을 한 줄로 나열(구분 순서 유지). 칸 너비는 균등, 넘치면 가로 스크롤.
 * 모바일(≤767px): 탭이 잘려 보여서 같은 자리에 전체 폭 드롭다운(아래로 펼쳐지는 링크 목록, 구분별 묶음)으로 바꿈
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
  const index = category.slugs.indexOf(current);

  // 모바일처럼 넘칠 때 선택 탭을 가운데로 (scrollIntoView는 페이지 세로 스크롤까지 움직여서 목록만 직접 스크롤)
  useEffect(() => {
    const el = list.current;
    const item = el?.children[index] as HTMLElement | undefined;
    if (!el || !item || el.scrollWidth <= el.clientWidth) return;
    el.scrollTo({ left: item.offsetLeft - el.offsetLeft - (el.clientWidth - item.offsetWidth) / 2, behavior: 'smooth' });
  }, [index]);

  return (
    <nav className={s.bar} aria-label={`${category.label} 제품`}>
      <ul ref={list} className={cx('container', s.list)}>
        {category.slugs.map((slug) => (
          <li key={slug}>
            <Link to={productPath(category, slug)} {...swap} className={s.tab} aria-current={slug === current ? 'page' : undefined}>
              {getProduct(slug)!.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* 모바일 전용 드롭다운 — 네이티브 select는 브라우저에 따라 목록이 위로 뜨거나 작게 떠서 직접 만듦.
          링크 목록을 펼치는 '공개(disclosure)' 패턴: 버튼 aria-expanded + 아래 패널 */}
      <div className={cx('container', s.mobile)} ref={box}>
        <button type="button" className={s.select} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((v) => !v)}>
          <span className={s.selectLabel}>제품 선택</span>
          <span className={s.selectValue}>{getProduct(current)!.name}</span>
          <span className={cx(s.chevron, open && s.chevronOpen)} aria-hidden="true" />
        </button>
        <div id={panelId} className={cx(s.panel, open && s.panelOpen)} inert={!open}>
          {/* 위계: 1단계(구분, 또는 구분=제품 하나) 모두 같은 모양 / 2단계(구분 안 여러 제품)는 들여쓰기 + 세로선 */}
          <ul>
            {(category.groups ?? category.slugs.map((slug) => ({ key: slug, label: '', slugs: [slug] }))).map((g) => {
              const lone = g.slugs.length === 1;
              const name = (slug: string) => (lone && g.label ? g.label : getProduct(slug)!.name);
              const item = (slug: string, level: 1 | 2) => (
                <Link
                  to={productPath(category, slug)}
                  {...swap}
                  className={cx(s.option, level === 1 ? s.lv1 : s.lv2)}
                  aria-current={slug === current ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {name(slug)}
                </Link>
              );
              return (
                <li key={g.key} className={s.group}>
                  {lone ? (
                    item(g.slugs[0], 1)
                  ) : (
                    <>
                      <p className={cx(s.lv1, s.groupLabel, g.slugs.includes(current) && s.groupOn)}>
                        {g.label} <span className={s.count}>{g.slugs.length}</span>
                      </p>
                      <ul className={s.children}>
                        {g.slugs.map((slug) => <li key={slug}>{item(slug, 2)}</li>)}
                      </ul>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
