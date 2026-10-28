import { Link, useNavigate } from 'react-router-dom';
import { getProduct, productPath, type CategoryInfo, type ProductDetail } from '../../data/products';
import { COMPANY } from '../../data/site';
import { cx } from '../../components/ui';
import s from './ProductSideNav.module.css';

// 제품 전환은 탭처럼 동작 → 기록을 쌓지 않고(replace) 스크롤도 유지 (App의 스크롤 처리에서 keepScroll을 봄)
const swap = { replace: true, state: { keepScroll: true } } as const;

/**
 * 제품 사이드 메뉴 — 카테고리 안의 [구분 > 제품] 트리.
 * PC: 상세 왼쪽에 고정(sticky). 태블릿·모바일: 같은 목록을 <select>로 (좁은 화면에 트리를 두면 본문이 밀려남)
 * 선택 상태는 URL의 제품에서 계산 — 별도 state 없음
 */
export function ProductSideNav({ category, product }: { category: CategoryInfo; product: ProductDetail }) {
  const navigate = useNavigate();
  const groups = category.groups ?? [{ key: 'all', label: '', slugs: category.slugs }];

  return (
    <aside className={s.side}>
      <nav className={s.tree} aria-label={`${category.label} 제품`}>
        <p className={s.title}>{category.label}</p>
        <ul>
          {groups.map((g) => {
            const inGroup = g.slugs.includes(product.slug);
            // 제품이 하나뿐인 구분은 구분 이름 자체가 제품 링크 (단열셔터 → 단열셔터)
            if (g.label && g.slugs.length === 1) {
              return (
                <li key={g.key}>
                  <Link to={productPath(category, g.slugs[0])} {...swap} className={s.group} aria-current={inGroup ? 'page' : undefined}>
                    {g.label}
                  </Link>
                </li>
              );
            }
            return (
              <li key={g.key}>
                {g.label && (
                  <p className={cx(s.groupLabel, inGroup && s.groupOn)}>
                    {g.label} <span className={s.count}>{g.slugs.length}</span>
                  </p>
                )}
                <ul className={cx(g.label && s.children)}>
                  {g.slugs.map((slug) => (
                    <li key={slug}>
                      <Link
                        to={productPath(category, slug)}
                        {...swap}
                        className={g.label ? s.child : s.group}
                        aria-current={slug === product.slug ? 'page' : undefined}
                      >
                        {getProduct(slug)!.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 태블릿·모바일 — 네이티브 select: 접근성·터치 조작이 기본으로 해결됨 */}
      <label className={s.mobile}>
        <span className="sr-only">{category.label} 제품 선택</span>
        <select value={product.slug} onChange={(e) => navigate(productPath(category, e.target.value), swap)}>
          {category.groups
            ? category.groups.map((g) => (
                <optgroup key={g.key} label={g.label}>
                  {g.slugs.map((slug) => (
                    <option key={slug} value={slug}>{getProduct(slug)!.name}</option>
                  ))}
                </optgroup>
              ))
            : category.slugs.map((slug) => (
                <option key={slug} value={slug}>{getProduct(slug)!.name}</option>
              ))}
        </select>
      </label>

      <div className={s.cta}>
        <p className={s.ctaLabel}>제품 상담</p>
        <a href={`tel:${COMPANY.tel}`} className={s.ctaTel}>{COMPANY.tel}</a>
        <a href="#contact" className={s.ctaLink}>견적문의 →</a>
      </div>
    </aside>
  );
}
