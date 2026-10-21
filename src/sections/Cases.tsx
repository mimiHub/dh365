import { useEffect, useMemo, useRef, useState } from 'react';
import { CASES, PRODUCTS } from '../data/site';
import { Badge, Button, Media, MoreLink, SectionHeading, Tabs, cx, type TabItem } from '../components/ui';
import { useReveal } from '../hooks/useReveal';
import caseSteelFactoryImg from '../assets/case-steel-factory.png';
import caseSteelFoodWarehouseImg from '../assets/case-steel-food-warehouse.png';
import caseSteelAptParkingImg from '../assets/case-steel-apt-parking.png';
import caseScreenIncheonNamdongImg from '../assets/case-screen-incheon-namdong.png';
import caseScreenAnsanSeonggokImg from '../assets/case-screen-ansan-seonggok.png';
import caseScreenWirelessControllerImg from '../assets/case-screen-wireless-controller.png';
import caseScreenIncheonUnivImg from '../assets/case-screen-incheon-univ.png';
import caseScreenGumiSagokEsImg from '../assets/case-screen-gumi-sagok-es.png';
import caseScreenGongjuUnivImg from '../assets/case-screen-gongju-univ.png';
import caseScreenGwangjuTechHsImg from '../assets/case-screen-gwangju-tech-hs.png';
import caseScreenYeomjakEsImg from '../assets/case-screen-yeomjak-es.png';
import caseSmokeFoodCourtImg from '../assets/case-smoke-food-court.png';
import caseSmokeLifeHqImg from '../assets/case-smoke-life-hq.png';
import caseSmokeEmployeeCafeteriaImg from '../assets/case-smoke-employee-cafeteria.png';
import caseWiredInstallSiteImg from '../assets/case-wired-install-site.png';
import caseWiredSupiaHallImg from '../assets/case-wired-supia-hall.png';
import caseWiredUniversityImg from '../assets/case-wired-university.png';
import caseWindH2StationImg from '../assets/case-wind-h2-station.png';
import caseWindGeumgokFoodzoneImg from '../assets/case-wind-geumgok-foodzone.png';
import caseWindWaterIntakeImg from '../assets/case-wind-water-intake.png';
import caseWindAluminumHighspeedImg from '../assets/case-wind-aluminum-highspeed.png';
import caseWindGarageImg from '../assets/case-wind-garage.png';
import caseSecurityPerforatedImg from '../assets/case-security-perforated.png';
import caseSecurityWaveImg from '../assets/case-security-wave.png';
import caseSecurityPipeImg from '../assets/case-security-pipe.png';
import s from './Cases.module.css';

type Filter = 'all' | (typeof PRODUCTS)[number]['key'];

const PAGE_SIZE = 6; // 처음에 보여줄 개수 = 더보기 한 번에 늘어나는 개수
const TABS: TabItem<Filter>[] = [{ value: 'all', label: '전체' }, ...PRODUCTS.map((p) => ({ value: p.key, label: p.name }))];
const nameOf = (key: string) => PRODUCTS.find((p) => p.key === key)?.name ?? '';

// 시공사례별 사진. 실제 이미지가 있는 사례(id 기준)만 채우고, 나머지는 Media가 플레이스홀더로 표시합니다.
const CASE_IMAGES: Partial<Record<number, string>> = {
  2: caseSteelFactoryImg, // 자동차 부품공장 철재방화셔터
  9: caseSteelFoodWarehouseImg, // OO식품 물류창고 철제방화셔터
  13: caseSteelAptParkingImg, // 아파트 지하주차장 철제방화셔터
  1: caseScreenIncheonNamdongImg, // 인천남동물류센터 하역장 스크린방화셔터
  4: caseScreenAnsanSeonggokImg, // 안산성곡물류센터 하역장 스크린방화셔터
  7: caseScreenWirelessControllerImg, // 스크린방화셔터 무선제어기 시공
  14: caseScreenIncheonUnivImg, // 인천대학교 해양클러스터관
  15: caseScreenGumiSagokEsImg, // 구미 사곡초등학교 철재→스크린 교체공사
  16: caseScreenGongjuUnivImg, // 공주대학교 사범대학 스크린방화셔터 시공
  17: caseScreenGwangjuTechHsImg, // 광주공고 스크린방화셔터(인정제품)
  18: caseScreenYeomjakEsImg, // 염작초등학교 스크린방화셔터 보수공사
  3: caseSmokeFoodCourtImg, // 푸드코트 제연스크린 시공
  10: caseSmokeLifeHqImg, // 생명 본사 연화장 제연스크린 시공
  19: caseSmokeEmployeeCafeteriaImg, // 기업직원식당 제연스크린 시공
  8: caseWiredInstallSiteImg, // 망입유리 설치현장
  20: caseWiredSupiaHallImg, // 수피아연회장 망입유리 시공
  21: caseWiredUniversityImg, // OO대학교 망입유리 시공
  5: caseWindH2StationImg, // 수소충전소 내풍압셔터 설치(방폭형)
  12: caseWindGeumgokFoodzoneImg, // 인천 금곡동 푸드존 단열내풍압셔터
  22: caseWindWaterIntakeImg, // 취수장 내풍압셔터
  23: caseWindAluminumHighspeedImg, // 알루미늄 고속셔터
  24: caseWindGarageImg, // OO차고지 내풍압셔터
  6: caseSecurityPerforatedImg, // 타공셔터
  25: caseSecurityWaveImg, // 웨이브셔터
  26: caseSecurityPipeImg, // 파이프셔터
};

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
          <MoreLink href="#cases">전체 시공사례</MoreLink>
        </div>

        <Tabs className={cx(s.tabs, 'reveal')} items={TABS} value={filter} onChange={changeFilter} label="제품별 시공사례" idPrefix="cases" />

        <div id="cases-panel" role="tabpanel" aria-labelledby={`cases-tab-${filter}`}>
          {list.length ? (
            <>
              <ul className={s.grid}>
                {shown.map((c, i) => (
                  <li key={c.id} className={cx(i >= PAGE_SIZE && s.added)}>
                    <a
                      href="#cases"
                      className={s.card}
                      ref={(el) => {
                        cardRefs.current[i] = el;
                      }}
                    >
                      <Media className={s.media} src={CASE_IMAGES[c.id]} alt={CASE_IMAGES[c.id] ? c.title : undefined} label="IMAGE — 현장 사진" />
                      <Badge tone="accent" className={s.badge}>{nameOf(c.product)}</Badge>
                      <h3 className={s.title}>{c.title}</h3>
                    </a>
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
