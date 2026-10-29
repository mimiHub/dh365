import type { ReactNode } from 'react';

/**
 * 제품 특징 아이콘 — 특징 제목의 키워드로 아이콘을 고름.
 * 데이터(products.ts)에 아이콘을 따로 적지 않아도 되고, 새 특징이 추가돼도 키워드만 맞으면 자동으로 붙음.
 * 위에서부터 먼저 맞는 규칙을 씀 → 구체적인 키워드를 위에 둠. 아무것도 안 맞으면 체크 아이콘.
 */
const svg = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const I = {
  wind: svg(<><path d="M3 8h11a3 3 0 1 0-3-3" /><path d="M3 12h16a3 3 0 1 1-3 3" /><path d="M3 16h7" /></>),
  thermo: svg(<><path d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0Z" /><path d="M12 9v7" /></>),
  lock: svg(<><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /><path d="M12 14.5v2.5" /></>),
  shield: svg(<><path d="M12 3 5 6v5.5c0 4.2 2.9 7.9 7 9.5 4.1-1.6 7-5.3 7-9.5V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>),
  badge: svg(<><circle cx="12" cy="9" r="6" /><path d="m9.5 9 1.8 1.8 3.2-3.6" /><path d="m8.5 14-1.5 7 5-2.5 5 2.5-1.5-7" /></>),
  coin: svg(<><circle cx="12" cy="12" r="8.5" /><path d="M14.5 9.5c-.4-1-1.4-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.6 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1.1 0-2.1-.5-2.5-1.5" /><path d="M12 6.5v1.5M12 16v1.5" /></>),
  sound: svg(<><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /></>),
  quiet: svg(<><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" /><path d="m16 10 4 4M20 10l-4 4" /></>),
  sparkle: svg(<><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="m6 6 2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></>),
  factory: svg(<><path d="M3 20V10l5 3V10l5 3V6h4l1 14" /><path d="M3 20h18" /><path d="M7 16h2M12 16h2" /></>),
  expand: svg(<><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /><rect x="8.5" y="8.5" width="7" height="7" rx="1" /></>),
  narrow: svg(<><path d="M8 4v16M16 4v16" /><path d="m5 12 3-3v6l-3-3ZM19 12l-3-3v6l3-3Z" /></>),
  drop: svg(<><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" /><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" /></>),
  eye: svg(<><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>),
  layers: svg(<><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>),
  refresh: svg(<><path d="M20 12a8 8 0 1 1-2.3-5.7" /><path d="M20 4v5h-5" /></>),
  radar: svg(<><circle cx="12" cy="12" r="2" /><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14" /></>),
  palette: svg(<><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5 1-1.5 2-1.5h2a4 4 0 0 0 4-4c0-4.4-4-8-9-8Z" /><circle cx="7.5" cy="11" r="1" /><circle cx="10" cy="7" r="1" /><circle cx="15" cy="7" r="1" /></>),
  sun: svg(<><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></>),
  globe: svg(<><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5Z" /></>),
  wrench: svg(<><path d="M14.5 6.5a4 4 0 0 0 5 5L13 18a2.1 2.1 0 0 1-3-3l6.5-6.5Z" /><path d="M14.5 6.5 17 4l3 3-2.5 2.5" /><path d="M6 21 3 18" /></>),
  feather: svg(<><path d="M20 4c-8 0-13 5-13 13v3" /><path d="M20 4c0 6-3 11-9 12H7" /><path d="M14 10H9" /></>),
  link: svg(<><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" /><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" /></>),
  check: svg(<><circle cx="12" cy="12" r="8.5" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>),
};

const RULES: [RegExp, ReactNode][] = [
  [/풍속|내풍압|윈드/, I.wind],
  [/열관류|단열/, I.thermo],
  [/밀폐|기밀/, I.lock],
  [/방범|방화·방범|침입/, I.shield],
  [/낙하|추락/, I.shield],
  [/인정|비차열|시험/, I.badge],
  [/비용|경제/, I.coin],
  [/조용|소음/, I.quiet],
  [/음성/, I.sound],
  [/인테리어|미관/, I.sparkle],
  [/생산|OEM/, I.factory],
  [/좁은/, I.narrow],
  [/공간|박스/, I.expand],
  [/부식/, I.drop],
  [/개방감|광고|채광/, I.eye],
  [/적층|수직/, I.layers],
  [/복구/, I.refresh],
  [/센서/, I.radar],
  [/색상|컬러/, I.palette],
  [/가볍|경량/, I.feather],
  [/작동|정비/, I.wrench],
  [/연동|통합|체결/, I.link],
];

export function FeatureIcon({ title }: { title: string }) {
  return <>{RULES.find(([re]) => re.test(title))?.[1] ?? I.check}</>;
}
