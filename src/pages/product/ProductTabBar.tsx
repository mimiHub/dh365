import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getProduct, productPath, type CategoryInfo } from '../../data/products';
import { cx } from '../../components/ui';
import s from './ProductTabBar.module.css';

// 제품 전환은 탭처럼 동작 → 기록을 쌓지 않고(replace) 스크롤도 유지 (App의 스크롤 처리에서 keepScroll을 봄)
const swap = { replace: true, state: { keepScroll: true } } as const;

/**
 * 제품 탭 바 — 소개(회색 띠)와 상세(흰 영역) 경계에 놓이는 전체 폭 밑줄형 탭 (코아드 상단 탭 방식).
 * 카테고리 안 제품을 한 줄로 나열(구분 순서 유지). 칸 너비는 균등, 넘치면 가로 스크롤.
 * 제품이 하나뿐인 카테고리에는 쓰지 않음 (부모에서 판단)
 */
export function ProductTabBar({ category, current }: { category: CategoryInfo; current: string }) {
  const list = useRef<HTMLUListElement>(null);
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
    </nav>
  );
}
