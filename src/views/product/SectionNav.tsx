import { useEffect, useRef, useState } from 'react';
import { cx } from '../../components/ui';
import { edgeClass, useScrollEdges } from '../../hooks/useScrollEdges';
import s from './SectionNav.module.css';

type Item = { id: string; label: string };

const HEADER = 72; // 모바일 고정 헤더 높이 (Header.module.css의 .bar 높이)

// 탭에 보이는 짧은 이름 — 모든 제품에서 탭이 한 줄에 들어오도록 두 글자 위주 (원래 이름은 aria-label로 읽힘)
const SHORT: Record<string, string> = { 안전장치: '안전', '형태·용도': '형태', 개폐방식: '개폐', 설치장소: '설치' };

/**
 * 제품 상세 구간 탭 (모바일 전용, PC에서는 CSS로 숨김)
 * - 부모 안에서 data-nav가 붙은 section을 찾아 탭을 만듦 → 제품마다 있는 구간이 달라도 자동으로 맞춰짐
 * - 스크롤하면 헤더 바로 아래에 붙고(position: sticky), 지금 보고 있는 구간 탭이 강조됨
 * - 탭은 한 줄에 고르게 나눠 배치. 아주 좁은 폰에서 넘치면 global.css '가로 스크롤 탭 공통 규칙'(끝 흐림·호버 화살표)
 * watch: 제품이 바뀌면(같은 페이지 안 이동) 구간을 다시 모으기 위한 값
 */
export function SectionNav({ watch }: { watch: string }) {
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState('');
  const edges = useScrollEdges(listRef, [items.length]);

  // 1) 구간 모으기 — 같은 라벨(예: 사양 + 설치장소가 한 구역)은 처음 것만
  useEffect(() => {
    const root = navRef.current?.parentElement;
    if (!root) return;
    const seen = new Set<string>();
    const found: Item[] = [];
    root.querySelectorAll<HTMLElement>('section[data-nav]').forEach((el) => {
      const label = el.dataset.nav!;
      if (seen.has(label) || !el.id) return;
      seen.add(label);
      found.push({ id: el.id, label });
    });
    setItems(found);
  }, [watch]);

  // 2) 지금 보고 있는 구간 — 헤더+탭 아래 기준선을 이미 지나간 마지막 구간
  useEffect(() => {
    if (!items.length) return;
    const onScroll = () => {
      const line = HEADER + (navRef.current?.offsetHeight ?? 0) + 24;
      let cur = items[0].id;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= line) cur = it.id;
      }
      setActive(cur); // 값이 같으면 React가 다시 그리지 않음
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);

  // 3) 강조된 탭이 탭 줄 가운데 오도록 (넘칠 때만, 탭 줄만 가로 스크롤)
  useEffect(() => {
    const list = listRef.current;
    const btn = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!list || !btn || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: btn.offsetLeft - (list.clientWidth - btn.offsetWidth) / 2, behavior: 'smooth' });
  }, [active]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - HEADER - (navRef.current?.offsetHeight ?? 0) - 12;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const cur = items.findIndex((it) => it.id === active);
  const arrow = (dir: -1 | 1) =>
    edges.overflow && (
      <button
        type="button"
        className={cx('dh-tabs-arrow', 'dh-edge-arrow', dir < 0 ? 'dh-edge-prev' : 'dh-edge-next', s.arrow)}
        aria-label={dir < 0 ? '이전 구간' : '다음 구간'}
        disabled={dir < 0 ? cur <= 0 : cur >= items.length - 1}
        onClick={() => go(items[cur + dir].id)}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d={dir < 0 ? 'M12.5 4.5 7 10l5.5 5.5' : 'M7.5 4.5 13 10l-5.5 5.5'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    );

  return (
    <nav ref={navRef} className={cx(s.nav, items.length < 3 && s.hidden)} aria-label="제품 상세 구간">
      <div className={cx(s.row, 'dh-edge-wrap')}>
        {arrow(-1)}
        <ul ref={listRef} className={cx(s.list, edgeClass(edges))}>
          {items.map((it) => (
            <li key={it.id}>
              <button type="button" data-id={it.id} className={s.tab} aria-label={SHORT[it.label] ? it.label : undefined} aria-current={it.id === active ? 'true' : undefined} onClick={() => go(it.id)}>
                {SHORT[it.label] ?? it.label}
              </button>
            </li>
          ))}
        </ul>
        {arrow(1)}
      </div>
    </nav>
  );
}
