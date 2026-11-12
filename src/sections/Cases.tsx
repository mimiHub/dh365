import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@/lib/router';
import { CASES, PRODUCTS } from '../data/site';
import { Badge, Button, Media, MoreLink, SectionHeading, Tabs, cx, type TabItem } from '../components/ui';
import { useReveal } from '../hooks/useReveal';
import { CASE_IMAGES } from '../data/caseImages';
import s from './Cases.module.css';

type Filter = 'all' | (typeof PRODUCTS)[number]['key'];

const PAGE_SIZE = 6; // 처음에 보여줄 개수 = 더보기 한 번에 늘어나는 개수
const TABS: TabItem<Filter>[] = [{ value: 'all', label: '전체' }, ...PRODUCTS.map((p) => ({ value: p.key, label: p.name }))];
const nameOf = (key: string) => PRODUCTS.find((p) => p.key === key)?.name ?? '';



/** 시공사례 — 제품별 탭 필터 + 3열 그리드 + 더보기 */
export function Cases() {
  const [filter, setFilter] = useState<Filter>('all');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const ref = useReveal<HTMLElement>();
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const focusFrom = useRef<number | null>(null);

  // 필터 결과(파생 데이터)는 state가 아니라 계산으로 — 원본(CASES)과 filter만 state/상수로 둠
  const list = useMemo(() => (filter === 'all' ? CASES : CASES.filter((c) => c.product === filter)), [filter]);
  const shown = list.slice(0, visible);
  const hasMore = list.length > visible;

  // 탭을 바꾸면 다시 처음 6개부터 (이벤트 핸들러에서 같이 처리 — effect로 '필터 바뀌면 리셋'을 하면 한 번 더 렌더됨)
  const changeFilter = (f: Filter) => {
    setFilter(f);
    setVisible(PAGE_SIZE);
  };

  const loadMore = () => {
    focusFrom.current = visible; // 새로 붙는 첫 카드 인덱스
    setVisible((v) => v + PAGE_SIZE);
  };

  // 더보기 후 새로 나온 첫 카드로 포커스 이동 → 키보드·스크린리더 사용자가 이어서 탐색 가능
  // (DOM에 카드가 생긴 '뒤'여야 하므로 effect에서 처리)
  useEffect(() => {
    if (focusFrom.current === null) return;
    cardRefs.current[focusFrom.current]?.focus({ preventScroll: true });
    focusFrom.current = null;
  }, [visible]);

  return (
    <section id="cases" className="section" ref={ref} aria-labelledby="cases-title">
      <div className="container">
        <div className={cx(s.top, 'reveal')}>
          <SectionHeading id="cases-title" eyebrow="PROJECT" title="시공사례" description="대한방화가 설계·시공한 현장을 제품별로 확인하세요." />
          <MoreLink href="/cases">전체 시공사례</MoreLink>
        </div>

        <Tabs className={cx(s.tabs, 'reveal')} items={TABS} value={filter} onChange={changeFilter} label="제품별 시공사례" idPrefix="cases" />

        <div id="cases-panel" role="tabpanel" aria-labelledby={`cases-tab-${filter}`}>
          {list.length ? (
            <>
              <ul className={s.grid}>
                {shown.map((c, i) => (
                  <li key={c.id} className={cx(i >= PAGE_SIZE && s.added)}>
                    <Link
                      to={`/cases/${c.product}`}
                      className={s.card}
                      ref={(el) => {
                        cardRefs.current[i] = el;
                      }}
                    >
                      <Media className={s.media} src={CASE_IMAGES[c.id]} alt={CASE_IMAGES[c.id] ? c.title : undefined} label="IMAGE — 현장 사진" />
                      <Badge tone="accent" className={s.badge}>{nameOf(c.product)}</Badge>
                      <h3 className={s.title}>{c.title}</h3>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className={s.more}>
                {/* 몇 개 중 몇 개를 보고 있는지 — 변경 시 스크린리더가 읽어 줌 */}
                <p className={s.count} aria-live="polite">
                  <strong>{shown.length}</strong> / {list.length}
                </p>
                {hasMore && (
                  <Button variant="secondary" onClick={loadMore} aria-controls="cases-panel">
                    더보기
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </Button>
                )}
              </div>
            </>
          ) : (
            <p className={s.empty}>등록된 시공사례가 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
}
