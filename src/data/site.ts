// 사이트 콘텐츠 — (href: '/…'는 라우터 이동, '/#id'는 메인 섹션으로 이동) 마크업과 분리해 두면 백엔드 연동 시 이 파일만 API 응답으로 바꾸면 됩니다.
// 출처: 현재 dh365.co.kr (2026.10 기준). [가안] 표시는 시안용으로 새로 쓴 문구 → 클라이언트 확인 필요.

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const NAV: NavItem[] = [
  {
    label: '회사소개',
    href: '/about/greeting',
    children: [
      // 인사말도 /about이 아니라 /about/greeting — '/about'이면 조직도(/about/organization)에서도 인사말이 '현재 메뉴'로 잡힘
      { label: '인사말', href: '/about/greeting' },
      { label: '조직도', href: '/about/organization' },
      { label: '오시는길', href: '/about/location' },
    ],
  },
  {
    // 「제품소개에 들어가는 내용」 ⑴~⑸ (구 메뉴의 제연스크린·망입유리는 빠짐 — 클라이언트 확인)
    label: '제품소개',
    href: '/products/screen',
    children: [
      { label: '스크린방화셔터', href: '/products/screen' },
      { label: '철재방화셔터 / 철재단열방화셔터', href: '/products/steel' },
      { label: '알루미늄셔터', href: '/products/aluminum' },
      { label: '스피드도어', href: '/products/speed-door' },
      { label: '오버헤드도어', href: '/products/overhead-door' },
    ],
  },
  {
    label: '시공사례',
    href: '/cases',
    children: [
      { label: '철재방화셔터', href: '/cases/steel' },
      { label: '방화스크린셔터', href: '/cases/screen' },
      { label: '제연스크린', href: '/cases/smoke' },
      { label: '망입유리', href: '/cases/wired' },
      { label: '내풍압셔터', href: '/cases/wind' },
      { label: '방범셔터', href: '/cases/security' },
    ],
  },
  {
    label: '자료실',
    href: '/library/spec',
    children: [
      { label: '시방서·일람표 및 설계도면', href: '/library/spec' },
      { label: '보도자료', href: '/library/press' },
      { label: '관련법규', href: '/library/law' },
      { label: '동영상자료', href: '/library/video' },
    ],
  },
  // 글쓰기는 목록의 '글쓰기' 버튼·퀵메뉴로 들어가므로 메뉴에는 게시판 하나만
  { label: '견적문의', href: '/quote', children: [{ label: '견적문의', href: '/quote' }] },
  {
    label: '고객센터',
    href: '/notice',
    children: [
      { label: '공지사항', href: '/notice' },
      // 설계문의 — 견적문의와 같은 폼의 별도 게시판
      { label: '설계문의', href: '/design' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
];

export const COMPANY = {
  name: '(주)대한방화',
  nameEn: 'KOREA FIRE PROTECTION Co.,Ltd',
  ceo: '신동원',
  bizNo: '643-81-02594',
  tel: '031-388-0023',
  mobile: '010-4223-6477',
  email: 'dh365@dh365.co.kr',
  // mapQuery: 지도 검색용 주소 — 표기용 address는 '광주시'라서 그대로 검색하면 경기도 광주시로 잡힘 → 광역시명·도로명까지만
  offices: [
    { label: '본사', address: '경기도 과천시 관문로 92, 102동 814호(힐스테이트과천중앙)', mapQuery: '경기도 과천시 관문로 92' },
    { label: '부산지사', address: '부산시 동래구 금강공원로20번길 70 4층', mapQuery: '부산광역시 동래구 금강공원로20번길 70' },
    { label: '광주지사', address: '광주시 북구 일곡로7-5 둥지빌딩 1층', mapQuery: '광주광역시 북구 일곡로 7-5' },
  ],
};

export interface HeroSlide {
  eyebrow: string;
  title: string[]; // 줄 단위
  description: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    eyebrow: 'WIND RESISTANT SHUTTER',
    title: ['강풍·풍압에도 끄떡없는', '내풍압셔터'],
    description: '물류센터·공장 출입구에 최적화된 내풍압셔터로 강풍과 풍압을 견디는 안전한 개구부를 만듭니다.',
  },
  {
    eyebrow: 'LARGE SCREEN SHUTTER',
    title: ['폭 12,000mm까지,', '대형 방화스크린셔터'],
    description: '최대 12,000 × 8,500mm로 인정 사이즈를 상향, 2025년 3월 인정서를 발급받은 제품입니다.',
  },
  {
    eyebrow: 'RESPONSIBLE CONSTRUCTION',
    title: ['한번 시공하면', '끝까지 책임집니다'],
    description: '국내 대형 건설사와 협업해 온 금속창호공사 전문회사입니다.',
  },
];

// 회사 강점 — 코아드 'About' 섹션의 3탭 구조를 따름
export const STRENGTHS = [
  {
    key: 'certified',
    title: '방화셔터 인정제품 시공',
    body: '방화셔터 인정 승인을 완료한 제품만으로 설계·시공합니다. 현장 용도에 맞는 인정 규격을 먼저 검토해 드립니다.',
    points: ['철재·스크린 방화셔터 인정제품', '현장별 인정 규격 검토'],
  },
  {
    key: 'partner',
    title: '삼성 오피스 철제방화셔터 시공',
    body: '삼성 오피스 현장에 철제방화셔터를 시공했습니다. 유리 난간·스테인리스 마감과 잘 어우러지도록, 업무·상업 시설에 맞는 깔끔한 마감으로 설치합니다.',
    points: ['대형 오피스·상업시설 시공', '마감재와 어우러지는 셔터 디테일'],
  },
  {
    key: 'network',
    title: '본사·부산·광주 지사 운영',
    body: '과천 본사와 부산·광주 지사에서 현장 상담과 사후관리를 지원합니다.',
    points: ['수도권·영남·호남 대응', '시공 후 유지보수 상담'],
  },
];

export const STATS = [
  // 출처: 기존 사이트 공지 '방화셔터(스크린) 대형화(12m x 8.5m) 인정서 발급 안내'
  { value: '12,000', unit: 'mm', label: '방화스크린셔터 인정 폭' },
  { value: '8,500', unit: 'mm', label: '방화스크린셔터 인정 높이' },
  { value: '8,000', unit: 'mm', label: '철재방화셔터 인정 폭' },
  { value: '3', unit: '곳', label: '본사 · 부산 · 광주 지사' },
];

export interface Product {
  key: string;
  name: string;
  nameEn: string;
  description: string; // [가안]
  tags: string[];
}

export const PRODUCTS: Product[] = [
  { key: 'steel', name: '철재방화셔터', nameEn: 'Steel Fire Shutter', description: '강판 슬랫으로 개구부를 차단하는 방화셔터. 인정 규격 8,000 × 4,000.', tags: ['인정제품'] },
  { key: 'screen', name: '방화스크린셔터', nameEn: 'Fire Screen Shutter', description: '내화 원단으로 가볍고 천장 공간이 좁은 곳에도 설치하는 방화셔터.', tags: ['인정제품', '대형'] },
  { key: 'smoke', name: '제연스크린', nameEn: 'Smoke Screen', description: '화재 시 연기의 확산을 막아 피난 동선을 확보하는 스크린.', tags: ['차연'] },
  { key: 'wired', name: '망입유리', nameEn: 'Wired Glass', description: '유리 속 철망이 파손 시 비산과 화염 확산을 막는 방화 유리.', tags: ['방화'] },
  { key: 'wind', name: '내풍압셔터', nameEn: 'Wind Resistant Shutter', description: '강풍과 풍압을 견디도록 보강한 셔터. 물류센터·공장 출입구용.', tags: ['산업용'] },
  { key: 'security', name: '방범셔터', nameEn: 'Security Shutter', description: '상가·창고 출입구의 침입을 막는 방범용 셔터.', tags: ['방범'] },
];

export interface CaseItem {
  id: number;
  product: string; // PRODUCTS.key
  title: string;
}

// 시공사례 — 현재 사이트에 게시물이 없어 [가안] 자리표시
export const CASES: CaseItem[] = [
  { id: 1, product: 'screen', title: '인천남동물류센터 하역장 스크린방화셔터' },
  { id: 2, product: 'steel', title: '자동차 부품공장 철재방화셔터' },
  { id: 27, product: 'steel', title: '아산시 배방읍 세교리 근린생활 지하주차장' },
  { id: 28, product: 'steel', title: '울산 JMC현장 방폭형 철재방화셔터 설치' },
  { id: 3, product: 'smoke', title: '푸드코트 제연스크린 시공' },
  { id: 4, product: 'screen', title: '안산성곡물류센터 하역장 스크린방화셔터' },
  { id: 5, product: 'wind', title: '수소충전소 내풍압셔터 설치(방폭형)' },
  { id: 6, product: 'security', title: '타공셔터' },
  { id: 7, product: 'screen', title: '스크린방화셔터 무선제어기 시공' },
  { id: 8, product: 'wired', title: '망입유리 설치현장' },
  { id: 9, product: 'steel', title: 'OO식품 물류창고 철제방화셔터' },
  { id: 10, product: 'smoke', title: '생명 본사 연화장 제연스크린 시공' },
  { id: 12, product: 'wind', title: '인천 금곡동 푸드존 단열내풍압셔터' },
  { id: 13, product: 'steel', title: '아파트 지하주차장 철제방화셔터' },
  { id: 14, product: 'screen', title: '인천대학교 해양클러스터관' },
  { id: 15, product: 'screen', title: '구미 사곡초등학교 철재→스크린 교체공사' },
  { id: 16, product: 'screen', title: '공주대학교 사범대학 스크린방화셔터 시공' },
  { id: 17, product: 'screen', title: '광주공고 스크린방화셔터(인정제품)' },
  { id: 18, product: 'screen', title: '염작초등학교 스크린방화셔터 보수공사' },
  { id: 19, product: 'smoke', title: '기업직원식당 제연스크린 시공' },
  { id: 20, product: 'wired', title: '수피아연회장 망입유리 시공' },
  { id: 21, product: 'wired', title: 'OO대학교 망입유리 시공' },
  { id: 22, product: 'wind', title: '취수장 내풍압셔터' },
  { id: 23, product: 'wind', title: '알루미늄 고속셔터' },
  { id: 24, product: 'wind', title: 'OO차고지 내풍압셔터' },
  { id: 25, product: 'security', title: '웨이브셔터' },
  { id: 26, product: 'security', title: '파이프셔터' },
];

export const ARCHIVES = [
  { label: '시방서·일람표 및 설계도면', en: 'SPECIFICATION', href: '/library/spec' },
  { label: '보도자료', en: 'PRESS', href: '/library/press' },
  { label: '관련법규', en: 'REGULATIONS', href: '/library/law' },
  { label: '동영상자료', en: 'VIDEO', href: '/library/video' },
];

// 현재 사이트 하단 배너 링크. 배너가 이미지라 기관명 확인 필요 → 우선 도메인 표기
export const FAMILY_SITES = [
  { label: 'kd2.co.kr', href: 'http://www.kd2.co.kr/' },
  { label: 'shutter.or.kr', href: 'http://shutter.or.kr/' },
  { label: '대한전문건설협회', href: 'https://www.kosca.or.kr/' },
];
