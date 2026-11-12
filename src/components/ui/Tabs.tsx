import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from './cx';

export interface TabItem<V extends string> {
  value: V;
  label: string;
}

interface Props<V extends string> {
  items: TabItem<V>[];
  value: V;
  onChange: (v: V) => void;
  label: string; // tablist aria-label
  idPrefix: string; // 탭 ↔ 패널 aria 연결용
  className?: string;
}

/**
 * 제어 컴포넌트(controlled): 선택 상태는 부모가 가짐. 좌우 방향키 이동 지원.
 * 탭이 넘쳐서 가로 스크롤이 생길 때만 좌우 화살표가 나타나 이전/다음 탭을 선택합니다.
 */
export function Tabs<V extends string>({ items, value, onChange, label, idPrefix, className }: Props<V>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);
  const current = items.findIndex((it) => it.value === value);

  // 화면 폭에 따라 넘침 여부가 바뀌므로 ResizeObserver로 감시 (resize 이벤트보다 정확: 요소 자체 크기 기준)
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const check = () => setOverflow(list.scrollWidth > list.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + items.length) % items.length;
    select(n);
    refs.current[n]?.focus();
  };

  // 선택한 탭이 가로 스크롤 밖에 걸쳐 있으면 보이는 위치로 당겨옴.
  // scrollIntoView는 페이지 세로 스크롤까지 움직일 수 있어서, 탭 목록만 직접 스크롤함
  const select = (i: number) => {
    onChange(items[i].value);
    const list = listRef.current;
    const tab = refs.current[i];
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return;
    // offsetLeft는 '위치 지정된 조상' 기준이라 목록 기준 좌표를 rect 차이로 계산
    const tabX = tab.getBoundingClientRect().left - list.getBoundingClientRect().left + list.scrollLeft;
    const left = tabX - (list.clientWidth - tab.offsetWidth) / 2; // 가운데로
    list.scrollTo({ left, behavior: 'smooth' });
  };

  return (
    <div className={cx('dh-tabs-wrap', overflow && 'is-overflow', className)}>
      {/* 화살표는 tablist 바깥에 둠 — tablist 안에는 role="tab"만 있어야 스크린리더가 탭 개수를 정확히 읽음 */}
      {overflow && (
        <button type="button" className="dh-tabs-arrow dh-tabs-prev" aria-label="이전 분류" disabled={current <= 0} onClick={() => select(current - 1)}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      )}
      <div ref={listRef} className="dh-tabs" role="tablist" aria-label={label}>
        {items.map((it, i) => {
          const on = it.value === value;
          return (
            <button
              key={it.value}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${idPrefix}-tab-${it.value}`}
              aria-controls={`${idPrefix}-panel`}
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              className="dh-tab"
              onClick={() => select(i)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {it.label}
            </button>
          );
        })}
      </div>
      {overflow && (
        <button type="button" className="dh-tabs-arrow dh-tabs-next" aria-label="다음 분류" disabled={current >= items.length - 1} onClick={() => select(current + 1)}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7.5 4.5 13 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      )}
    </div>
  );
}
