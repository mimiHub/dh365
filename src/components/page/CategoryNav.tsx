import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SliderNav, cx } from '../ui';
import s from './CategoryNav.module.css';

export interface CategoryItem {
  key: string;
  name: string;
  to: string;
  count?: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * 분류 패널 — 히어로 아래에 걸친 흰 패널. 각 칸에 개수를 같이 보여 '어디에 얼마나 있는지'를 먼저 알 수 있게.
 * 칸이 화면보다 넓으면(모바일) 가로 스크롤 + 아래에 SliderNav [01 / 07 ‹ ›]. 시공사례·자료실 공용
 */
interface Props {
  items: CategoryItem[];
  current: string;
  /** nav 이름 (스크린리더) — 예: '자료실 분류' */
  label: string;
  /** 칸 목록 id — 넘칠 때 SliderNav가 aria-controls로 가리킴 */
  id: string;
  /**
   * 좁은 화면(≤1199px, 가로 스크롤 배치)에서 칸 폭
   * - auto  : 글자 길이만큼 + 남는 공간 나눔 → 칸마다 폭이 다름 (분류가 많은 시공사례·자료실)
   * - equal : 모든 칸 같은 폭 (칸이 적고 이름 길이가 비슷한 회사소개처럼 '탭'으로 보여야 할 때)
   * PC(≥1200px)는 원래 균등 칸이라 차이 없음
   */
  itemWidth?: 'auto' | 'equal';
}

export function CategoryNav({ items, current, label, id, itemWidth = 'auto' }: Props) {
  const navigate = useNavigate();
  const listRef = useRef<HTMLUListElement>(null);
  const [overflow, setOverflow] = useState(false);
  const index = Math.max(0, items.findIndex((c) => c.key === current));

  // 넘치는지 — 크기 변화는 ResizeObserver로 감시 (화면 폭이 아니라 '실제로 넘치는지'를 재야 정확)
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const check = () => setOverflow(list.scrollWidth > list.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  // 선택한 칸을 가운데로 — scrollIntoView는 페이지 세로 스크롤까지 움직여서 목록만 직접 스크롤
  useEffect(() => {
    const list = listRef.current;
    const item = list?.children[index] as HTMLElement | undefined;
    if (!list || !item || list.scrollWidth <= list.clientWidth) return;
    const x = item.getBoundingClientRect().left - list.getBoundingClientRect().left + list.scrollLeft;
    list.scrollTo({ left: x - (list.clientWidth - item.offsetWidth) / 2, behavior: 'smooth' });
  }, [index, overflow]);

  // 분류 = 탭처럼 동작 → 기록을 쌓지 않고(replace) 스크롤 유지. 분류를 바꾸면 검색어·페이지는 초기화
  const swap = { replace: true, state: { keepScroll: true } } as const;
  const step = (d: 1 | -1) => {
    const next = items[index + d];
    if (next) navigate(next.to, swap);
  };

  return (
    <nav className={s.wrap} aria-label={label}>
      <div className={cx(s.panel, overflow && s.scroll)}>
        <ul ref={listRef} id={id} className={cx(s.list, itemWidth === 'equal' && s.equal)} style={{ ['--count' as string]: items.length }}>
          {items.map((c) => {
            const on = c.key === current;
            return (
              <li key={c.key || 'all'}>
                <Link to={c.to} {...swap} className={cx(s.item, on && s.on)} aria-current={on ? 'page' : undefined}>
                  <span className={s.name}>{c.name}</span>
                  {c.count !== undefined && (
                    <span className={s.count}>
                      {pad(c.count)}
                      <span className="sr-only">건</span>
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      {overflow && (
        <SliderNav
          className={s.sliderNav}
          current={index}
          total={items.length}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          prevDisabled={index === 0}
          nextDisabled={index === items.length - 1}
          controls={id}
          itemLabel="분류"
        />
      )}
    </nav>
  );
}
