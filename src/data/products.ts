// 제품 상세페이지 콘텐츠 — 마크업과 분리 (site.ts와 같은 원칙: 백엔드 연동 시 이 파일만 API로 교체)
// 출처: 「카탈로그_대한방화.pdf」(공사지명원 ver.2026), 메뉴 구성은 「제품소개에 들어가는 내용.pdf」
//
// 표기 규칙
// - specs / maxSize / certs : 카탈로그 수치를 그대로 옮김 (임의 수정 금지)
// - summary / intro / features 문구 : 카탈로그 내용을 사이트용으로 새로 쓴 것 → [가안], 클라이언트 확인 필요
//   (카탈로그 문구 일부가 타사 브로슈어 문장 그대로라 원문 사용을 피함)
// - todo : 카탈로그에 내용이 없거나 서로 맞지 않는 부분 (화면에는 표시하지 않음 — 클라이언트 확인 요청서로 정리)

export type ProductCategory = 'screen' | 'steel' | 'aluminum' | 'speed-door' | 'overhead-door';

export interface SpecRow {
  label: string;
  value: string;
}

export interface Feature {
  title: string;
  body: string;
}

/** 공인시험기관 시험성적서 — 원본 내용을 그대로 옮김(수치 수정 금지) */
export interface TestReport {
  title: string;
  lab: string; // 시험기관
  accreditation?: string; // 인정기구
  reportNo: string;
  client: string; // 의뢰자 — 대한방화 명의가 아닐 수 있으므로 반드시 표기
  subject: string; // 시험대상
  method: string; // 시험방법(규격)
  testDate: string;
  issueDate: string;
  specimen: string; // 시험체 규격
  results: { item: string; criterion: string; time: string; result: string }[];
  /** 차열성: 60분 시점 평균·최대 온도와 기준 */
  heat?: { avg: number; avgLimit: number; max: number; maxLimit: number };
  note: string; // 성적서 원문 단서 조항
}

export interface ProductDetail {
  slug: string; // URL 조각 (/products/:slug)
  category: ProductCategory;
  name: string;
  nameEn: string;
  model?: string; // 카탈로그 모델명
  summary: string; // 카드·목록용 한 줄 [가안]
  intro: string; // 상세 상단 소개 [가안]
  maxSize?: { width: number; height: number }; // mm
  features: Feature[];
  uses: string[];
  specs: SpecRow[];
  certs?: string[]; // 시험성적서·특허 등
  reports?: TestReport[];
  sharedSafety?: boolean; // true면 FIRE_SAFETY 공통 블록을 함께 노출
  /** 구성품 카드 (이미지는 ProductPage의 COMPONENT_IMAGES에서 같은 순서로) */
  /** group: 같은 group끼리 소제목 아래 묶음(알루미늄 내풍압 '셔터의 구성'), body의 줄바꿈(\n)은 그대로 표시 */
  components?: { name: string; nameEn: string; body: string; group?: string }[];
  /** 구성품 블록 제목 바꾸기 (기본: COMPONENTS / 구성품) */
  componentsHead?: { en: string; title: string };
  /** 자동 복구 등 단계별 동작 설명 (이미지는 ProductPage의 STEP_IMAGES) */
  steps?: { title: string; heading: string; items: { title: string; body: string }[] };
  /** 선택 가능한 색상 — hex는 화면 표시용 근사색 */
  colors?: { name: string; nameEn: string; hex: string; vision?: boolean }[];
  /** 투시창(채광창) 안내 — 그림은 ProductPage의 WINDOW_IMAGES */
  window?: { title: string; spec: string; body: string };
  /** 부착 가능한 센서·조작 장치 */
  sensors?: { name: string; nameEn: string; body: string }[];
  /** 패널(슬랫) 종류 — 규격·피치 비교 카드 (이미지는 ProductPage의 PANEL_IMAGES) */
  panels?: { name: string; nameEn: string; thickness: string; pitch: string }[];
  /** 패널 블록 제목·라벨 바꾸기 (기본: PANEL / 패널 종류 / 전체 두께) — 알루미늄은 '슬랫 종류' */
  panelsHead?: { en: string; title: string; sizeLabel: string };
  /** 슬랫 계열별 두께 비교표 — 계열마다 [사진 + 두께별 전체두께·피치 표] (사진은 ProductPage의 SLAT_GROUP_IMAGES, 같은 순서) */
  slatGroups?: { name: string; nameEn: string; body: string; rows: { thickness: string; total: string; pitch: string }[] }[];
  /** 개폐 방식 — 헤드룸(천장 여유 공간)에 따라 고르는 타입 (그림은 OPEN_TYPE_IMAGES, 같은 순서) */
  openTypes?: { name: string; nameEn: string; headroom: string; body: string }[];
  todo?: string[];
}

/** 카테고리 안의 2단계 구분 (현재 알루미늄셔터만 사용) */
export interface ProductGroup {
  key: string;
  label: string;
  /** 이 구분을 고르면 카테고리 강조 문장 대신 노출 [가안] */
  highlight?: string;
  slugs: string[];
}

export interface CategoryInfo {
  key: ProductCategory;
  label: string;
  labelEn: string;
  /** 카테고리 카드의 한 줄 설명 [가안] */
  summary: string;
  /** 카드 아래 강조 문장 [가안]. *별표* 로 감싼 부분이 블루 강조 */
  highlight: string;
  /** groups가 있으면 카드는 선택한 구분의 제품만 보여줌 */
  groups?: ProductGroup[];
  slugs: string[];
}

/** 구분 목록에서 slugs를 모아 카테고리 전체 slugs를 만듦 — 같은 목록을 두 번 적지 않게 */
const withGroups = (c: Omit<CategoryInfo, 'slugs'> & { groups: ProductGroup[] }): CategoryInfo => ({
  ...c,
  slugs: c.groups.flatMap((g) => g.slugs),
});

/**
 * 제품소개 카테고리 = 상단 탭(1단계). 「제품소개에 들어가는 내용」의 ⑴~⑸ 위계 그대로
 * ⑴ 스크린방화셔터 ⑵ 철재방화셔터·철재단열방화셔터 ⑶ 알루미늄셔터(①~④ 구분) ⑷ 스피드도어 ⑸ 오버헤드도어
 */
export const PRODUCT_CATEGORIES: CategoryInfo[] = [
  {
    key: 'screen',
    label: '스크린방화셔터',
    labelEn: 'Fire Screen Shutter',
    summary: '천장 속에 감춰 설치하는 가볍고 조용한 방화셔터',
    highlight: '천장 속에 *감춰 설치*하는 가벼운 내화 스크린에, *3가지 특허 출원 안전장치*를 더했습니다.',
    slugs: ['screen'],
  },
  {
    key: 'steel',
    label: '철재방화셔터 / 철재단열방화셔터',
    labelEn: 'Steel Fire Shutter',
    summary: '밀폐성과 내구성이 뛰어난 강판 슬랫 방화셔터',
    highlight: '*밀폐성과 내구성*이 뛰어난 비차열 60분 인정 철재셔터에, *3가지 특허 출원 안전장치*를 기본 적용합니다.',
    slugs: ['steel', 'steel-insulated'],
  },
  withGroups({
    key: 'aluminum',
    label: '알루미늄셔터',
    labelEn: 'Aluminum Shutter',
    summary: '방범·단열·내풍압, 현장에 맞춘 알루미늄셔터',
    highlight: '가벼운 알루미늄 이중압출 슬랫에 *방범·단열·내풍압* 성능을 현장에 맞게 더합니다.',
    groups: [
      {
        key: 'security',
        label: '방범셔터',
        highlight: '스테인리스 파이프와 물결형 그물망으로 *침입은 막고*, 매장 안은 *보여주는* 방범셔터입니다.',
        slugs: ['pipe-single', 'pipe-double', 'steel-security', 'wave'],
      },
      {
        key: 'insulated',
        label: '단열셔터',
        highlight: '우레탄을 충진한 슬랫으로 *열관류율 1.233W/㎡K*, *기밀성 1등급*을 확인받은 단열셔터입니다.',
        slugs: ['al-insulated'],
      },
      {
        key: 'wind',
        label: '내풍압셔터',
        highlight: '바람이 강한 *남부지방*과 해안가에서 *45m/s 강풍*을 견디는 내풍압셔터입니다.',
        slugs: ['al-wind'],
      },
      {
        key: 'wind-insulated',
        label: '내풍압단열셔터',
        highlight: '*50m/s 내풍압*에 *우레탄 단열*까지 더한 알루미늄셔터입니다.',
        slugs: ['al-wind-insulated'],
      },
    ],
  }),
  {
    key: 'speed-door',
    label: '스피드도어',
    labelEn: 'Speed Door',
    summary: '부딪혀도 자동으로 복구되는 고속 개폐 도어',
    highlight: '차량이 잦은 출입구에서 *빠르게 여닫고*, 부딪혀도 *스스로 복구*되는 고속 도어입니다.',
    slugs: ['speed-door'],
  },
  {
    key: 'overhead-door',
    label: '오버헤드도어',
    labelEn: 'Overhead Door',
    summary: '단열·방음·내풍압을 갖춘 패널형 산업용 도어',
    highlight: '*단열·방음·내풍압*을 패널 하나로 해결하는 물류창고·격납고용 도어입니다.',
    slugs: ['overhead-door'],
  },
];

/**
 * 방화셔터 공통 안전장치 — 스크린·철재 상세에 같이 노출 (sharedSafety: true)
 * 출처: 인사말(특허 3종), 3) 대한방화 설치 방화셔터 특징 p.6~7
 */
export const FIRE_SAFETY = {
  // 카탈로그 p.3: 본문은 '3가지 특허 받은', 바로 아래 ☞는 '특허 출원 항목' → 확인 전까지 '출원'으로 표기
  headline: '3가지 특허 출원 안전장치를 기본 적용합니다', // [가안]
  patents: [
    { title: '음성안내', body: '상승·하강, 오동작, 장애물 감지 시 상황을 음성으로 안내합니다.' },
    { title: '낙하 방지 장치', body: '하강 중 브라켓 체인이 끊어져도 셔터가 추락하지 않도록 막습니다.' },
    { title: '비상 올림 버튼', body: '셔터가 내려온 상태에서도 비상 탈출을 위해 셔터를 올릴 수 있습니다.' },
  ],
  obstacle: {
    title: '장애물 감지장치',
    badge: '특허 출원',
    body: '셔터 하부에 장애물이 닿으면 자동으로 5초간 올라가 멈추고 음성으로 알립니다. 장애물을 치우지 않으면 다시 올라가 멈춥니다.',
  },
  bracket: {
    title: '안전 브라켓트',
    body: '체인 이탈·연결부 풀림 시 셔터 추락을 막습니다. 500K 이상 모터에 기본 장착(옵션 아님)되며, 체인 처짐을 막는 방진 러버를 기본 적용했습니다.',
  },
  voiceMessages: [
    '1차 전원이 차단되었으니 1차 전원을 확인하세요',
    '화재발생 화재발생 신속히 대피하시기 바랍니다.',
    '화재로 셔터가 막혔습니다. 비상구로 탈출하시기 바랍니다.',
    '셔터가 내려오고 있습니다. 주의하세요.',
    '버튼 조작음 : 정지 ~ 상승 ~ 하강 ~',
    '셔터가 장애물에 걸렸습니다. 장애물을 옮겨주세요.',
  ],
  details: [
    { title: '방화·방범 연동', body: '방화셔터가 하강하면 방범셔터가 상승하도록 동작을 연동합니다.' },
    { title: '수동 체인', body: '정전 시에도 수동 체인으로 개폐할 수 있습니다.' },
    { title: '결선 단자 안전 덮개', body: '컨트롤러 결선 단자에 덮개를 씌워 감전·단락을 예방합니다.' },
    { title: '난연 소재 전선·컨트롤박스', body: '전선과 컨트롤박스에 난연 소재를 사용합니다.' },
    { title: '알루미늄 바디 접지', body: '방열이 좋은 알루미늄 모터 바디에 접지 연결선을 둡니다.' },
    { title: '모터 안전 포장', body: '에어캡과 골판지로 이중 포장해 운송 중 파손을 막습니다.' },
  ],
  // 2) DH 모터 시스템 개요
  motor: {
    capacities: ['300K', '400K', '500K', '600K', '800K', '1000K', '1500K'],
    wiring: [
      { label: '폐쇄기선', value: '1.5 SQ 2선' },
      { label: '전원선', value: '2.5 SQ 2선' },
    ],
    controllers: [
      { label: '방범 스위치', value: '70 × 120 × 22' },
      { label: '연동제어기 노출형', value: '215 × 285 × 85' },
      { label: '연동제어기 매립형', value: '276 × 350 × 10' },
      { label: '뒷박스', value: '230 × 310 × 75' },
    ],
  },
  patent: { no: '제 10-2121150 호', title: '방화스크린셔터 구동장치', registered: '2020.06.03' },
};

export const PRODUCT_DETAILS: ProductDetail[] = [
  // ─────────────────────────── ⑴ 스크린방화셔터 · ⑵ 철재방화셔터 ───────────────────────────
  {
    slug: 'screen',
    category: 'screen',
    name: '스크린방화셔터',
    nameEn: 'Fire Screen Shutter',
    summary: '천장 속에 감춰 설치하는 가볍고 조용한 방화셔터',
    intro:
      '내화 코팅한 유리섬유 직물(와이어·실리카)을 본체로 한 방화셔터입니다. 천장 안에 완전히 숨겨 설치할 수 있어 아트리움, 계단, 로비, 엘리베이터 앞처럼 공간의 미관이 중요한 곳에 적합합니다.',
    maxSize: { width: 11700, height: 8500 },
    features: [
      { title: '낮은 낙하 사고 위험', body: '철재셔터보다 가벼워 낙하 사고 위험이 적습니다.' },
      { title: '경제적인 비용', body: '철재방화셔터보다 설치 비용이 저렴합니다.' },
      { title: '조용하고 부드러운 작동', body: '하강 시 소음이 적고 부드럽게 움직여 심리적 안정감을 줍니다.' },
      { title: '인테리어와 조화', body: '천장 속에 감춰져 인테리어가 중요한 공간에도 잘 어울립니다.' },
      { title: '직접 생산', body: '김포 공장 컨베이어 라인에서 하루 70틀까지 제작하며, 실리카 98% 정품 원단만 사용합니다(성적서 사양).' },
    ],
    uses: ['아트리움·개방형 공간', '계단', '로비', '상업시설 엘리베이터 앞', '물류센터 하역장'],
    specs: [
      { label: '케이스', value: 'EGI 1.55mm' },
      { label: '마환봉', value: '6mm' },
      { label: '감기샤프트', value: '60.5 × 2.9mm + 114.3 × 2mm' },
      { label: '전동개폐기', value: 'DH-150K' },
      { label: '베어링부', value: 'DH-380B' },
      { label: '앵글', value: '40 × 40 × 3mm' },
      { label: '스크린', value: '와이어 글라스 코팅직물 0.7mm' },
      { label: '가이드레일', value: 'EGI 1.55mm + 마감재 SUS 1.2mm' },
      { label: '하단마감재', value: 'SUS 1.55mm' },
    ],
    certs: ['방화스크린셔터 구동장치 특허 제10-2121150호'],
    sharedSafety: true,
    todo: [
      '구조도: 가이드레일 마감재가 "SUS 1.2m"로 표기됨 → "1.2mm" 오기로 보임(사양표는 1.2mm). 도면 수정 필요',
      '안전장치 3종(음성안내·낙하 방지·비상 올림): 카탈로그 p.3에 "특허 받은"과 "특허 출원"이 함께 적혀 있음 → 현재 "특허 출원"으로 표기. 등록 특허라면 특허번호 받아서 표기 변경',
      '최대 사이즈: 카탈로그 11,700 × 8,500 / site.ts·기존 공지 12,000 × 8,500 — 어느 쪽이 맞는지 확인',
      '원단 두께: 도면 0.7mm(와이어) / 설치제품 소개 0.8mm(실리카) — 와이어·실리카 두 종을 나눠 표기할지 확인',
      '카탈로그 원문에 "국민방화 스크린셔터"라는 타사명이 들어 있음 → 사이트에는 쓰지 않음',
    ],
  },
  {
    slug: 'steel',
    category: 'steel',
    name: '철재방화셔터',
    nameEn: 'Steel Fire Shutter',
    summary: '밀폐성과 내구성이 뛰어난 강판 슬랫 방화셔터',
    intro:
      '전기아연도금 강판을 슬래팅·포밍한 슬랫으로 만든 방화셔터입니다. 화재 시 불길을 차단해 대피 시간을 벌고 확산을 막아, 공장·물류창고·차고·주차장처럼 위험도가 높거나 가연성 물질이 있는 곳에 주로 설치합니다.',
    maxSize: { width: 8000, height: 4000 },
    features: [
      { title: '밀폐성능과 내구성', body: '견고한 강판 슬랫으로 방화 구획을 확실하게 나눕니다.' },
      { title: '공간 활용', body: '건축물 내부 면적을 최대한 살릴 수 있습니다.' },
      { title: '좁은 곳에도 설치', body: '좁은 통로, 비상계단, 백화점 에스컬레이터 주변에도 효과적으로 설치합니다.' },
      { title: '비차열 60분 인정제품', body: '경동기업 비차열 60분 방화셔터 자재를 사용합니다.' },
    ],
    uses: ['공장', '물류창고', '차고·주차장', '비상계단·좁은 통로', '백화점 에스컬레이터 주변'],
    specs: [
      { label: '케이스', value: 'EGI 1.55mm' },
      { label: '조인트바', value: 'EGI 1.55mm' },
      { label: '전동개폐기', value: 'KD-모터' },
      { label: '베어링부', value: 'KD-브라켓트' },
      { label: '앵글', value: '50 × 50 × 4mm' },
      { label: '가이드레일', value: 'EGI 1.55mm + 마감재 SUS 1.2 / EGI 1.15mm' },
      { label: '슬랫', value: 'EGI 1.55mm' },
      { label: '하단마감재', value: 'SUS / EGI 1.55mm' },
    ],
    // 출처: 한국건설기술연구원 시험성적서 2020TSE0051-1-1 (첨부 이미지 3페이지)
    reports: [
      {
        title: '90도 오픈형 여닫이 비상문 구조 차연·내화 시험',
        lab: '한국건설기술연구원(KICT)',
        accreditation: 'KOLAS 공인시험기관',
        reportNo: '2020TSE0051-1-1',
        client: '(주)동도산업',
        subject: '90도 오픈형 여닫이 비상문 (셔터 일체형)',
        method: 'KS F 2845:2013 (유리구획 부분의 내화시험방법에 따른 개별성적서)',
        testDate: '2021.01.24 ~ 2021.01.28',
        issueDate: '2021.02.05',
        specimen: '전체 3,000 × 3,000 × 550mm (개구부 2,740 × 2,450mm)',
        results: [
          { item: '차염성', criterion: '6mm 균열게이지 관통 후 150mm 이상 이동 없을 것', time: '60분', result: '적합' },
          { item: '차염성', criterion: '10mm 균열게이지 관통 없을 것', time: '60분', result: '적합' },
          { item: '내화성', criterion: '10mm 균열게이지 관통 없을 것', time: '60분', result: '적합' },
          { item: '차열성', criterion: '평균 140℃ 초과하지 않을 것', time: '60분', result: '적합' },
          { item: '차열성', criterion: '최대 180℃ 초과하지 않을 것', time: '60분', result: '적합' },
        ],
        heat: { avg: 130.1, avgLimit: 140, max: 132.1, maxLimit: 180 },
        note: '위 시험결과는 의뢰자가 제시한 시편에 한하며 용도 이외의 사용을 금합니다. (성적서 원문)',
      },
    ],
    sharedSafety: true,
    todo: [
      '안전장치 3종(음성안내·낙하 방지·비상 올림): 카탈로그 p.3에 "특허 받은"과 "특허 출원"이 함께 적혀 있음 → 현재 "특허 출원"으로 표기. 등록 특허라면 특허번호 받아서 표기 변경',
      '시험성적서: 의뢰자가 (주)동도산업이고 "용도 이외 사용 금지 / 설계사무소 참고용"으로 발급됨 → 대한방화 사이트 게시 가능 여부·동도산업과의 관계(제조사 등) 클라이언트 확인',
      '도면 하단 치수: 다시 그린 도면은 30 / 2,740 / 30(합 2,800) — 성적서·카탈로그 원본은 130 / 2,740 / 130(합 3,000). 도면 수정 필요',
      '강판 두께: 소개문 1.6T / 도면 슬랫 EGI 1.55mm — 표기 통일 필요',
      '인사말의 "폭 8,000·높이 4,000 초과 대형사이즈 가능"과 최대 8,000 × 4,000 표기가 충돌 — 확인',
    ],
  },
  {
    slug: 'steel-insulated',
    category: 'steel',
    name: '철재단열방화셔터',
    nameEn: 'Insulated Steel Fire Shutter',
    summary: '방화 성능에 단열을 더한 철재셔터',
    intro: '', // 카탈로그에 전용 페이지 없음
    features: [],
    uses: [],
    specs: [],
    sharedSafety: true,
    todo: ['카탈로그에 전용 내용 없음(회사개요에 "단열, 내풍압 철제 셔터" 한 줄뿐) — 제품 소개·사양·사진 요청 필요'],
  },

  // ─────────────────────────── ⑶ 알루미늄셔터 ② 단열 ③ 내풍압 ④ 내풍압단열 ───────────────────────────
  {
    slug: 'al-insulated',
    category: 'aluminum',
    name: '단열셔터',
    nameEn: 'AL. Insulated Shutter',
    summary: '우레탄을 충진한 알루미늄 슬랫 단열셔터',
    intro:
      'AL6063 이중압출 슬랫 속에 우레탄을 충진한 단열셔터입니다. KS F 2278(창호의 단열성 시험)에 따른 열관류율 기준을 충족해 에너지 절약형 건물에 적합합니다.',
    features: [
      { title: '열관류율 1.233W/㎡K', body: '열관류율 1.233W/㎡K, 기밀성 1등급 시험성적서를 보유하고 있습니다.' },
      { title: '가볍고 조용한 개폐', body: '내구성이 좋고 특수수지를 사용해 개폐 시 소음이 적으며, 가벼워 설치 후 관리가 쉽습니다.' },
      { title: '다양한 색상', body: '현장 마감에 맞춰 여러 색상 중 선택할 수 있습니다.' },
    ],
    uses: ['에너지 절약 설계 대상 건축물', '공장·창고 출입구', '상가·주택·차고'],
    specs: [
      { label: '슬랫', value: 'Pitch 80mm, 1.0T × 28mm AL6063 이중압출물(우레탄 충진)' },
      { label: '슬랫 (16mm형)', value: 'Pitch 72mm, AL 0.8T / 1.2T × 16mm AL6063 이중압출물(우레탄 충진)' },
      { label: '가이드레일', value: 'SUS 1.2T H/L' },
      { label: '하단', value: 'I BAR (16mm형 I 또는 T BAR)' },
    ],
    // 슬랫 2종: 카탈로그 p.14 「AL. 열관류율셔터」(28mm) + p.16 「AL. 압출(단열)셔터」(16mm)
    // p.16 도면의 슬랫 표기가 "AL 1.2T (이중압출, 우레탄 충진)"이라 단열셔터의 16mm형으로 묶음
    // 셔터의 구성: 협업 업체 상세 페이지 「제품구성요소 > 셔터의 구성」
    componentsHead: { en: 'SHUTTER PARTS', title: '셔터의 구성' },
    components: [
      { name: '가이드레일 + 슬랫 · 후면 부착', nameEn: 'REAR ATTACHMENT', body: '재질 SUS 1.2T / 1.5T, EGI 1.2T / 1.6T' },
      { name: '가이드레일 + 슬랫 · 측면 부착', nameEn: 'SIDE ATTACHMENT', body: '재질 SUS 1.2T / 1.5T, EGI 1.2T / 1.6T' },
      { name: '하단바 T 타입', nameEn: 'BOTTOM BAR · TYPE T', body: 'TYPE T' },
      { name: '하단바 I 타입', nameEn: 'BOTTOM BAR · TYPE I', body: 'TYPE I' },
    ],
    // 슬랫 종류: 협업 업체 상세 페이지 「SLAT의 종류」 — 이중압출 / 단열 두 계열 × 두께 4종
    slatGroups: [
      {
        name: '이중압출 슬랫',
        nameEn: 'AL EXTRUDED SLAT',
        body: 'AL6063 이중압출 슬랫입니다.',
        rows: [
          { thickness: '0.8T', total: '15mm', pitch: '72mm' },
          { thickness: '1.2T', total: '15mm', pitch: '72mm' },
          { thickness: '1.6T', total: '15mm', pitch: '72mm' },
          { thickness: '1.3T', total: '22.4mm', pitch: '75mm' },
        ],
      },
      {
        name: '단열 슬랫',
        nameEn: 'AL INSULATED SLAT',
        body: '이중압출 슬랫 속에 우레탄을 충진했습니다.',
        rows: [
          { thickness: '0.8T', total: '15mm', pitch: '72mm' },
          { thickness: '1.2T', total: '15mm', pitch: '72mm' },
          { thickness: '1.6T', total: '15mm', pitch: '72mm' },
          { thickness: '1.3T', total: '22.4mm', pitch: '75mm' },
        ],
      },
    ],
    certs: ['열관류율 1.233W/㎡K', '기밀성 1등급 시험성적서', '우레탄 시험성적서'],
    todo: [
      '슬랫 종류 표(협업 업체 자료): 전체두께 15mm — 카탈로그 p.16은 16mm, 두께 0.8/1.2T만 표기(1.6T·1.3T 없음) → 대한방화 기준 확인',
      '슬랫 종류 표에 카탈로그 p.14의 28mm(1.0T, 피치 80) 열관류율 슬랫이 없음 → 사양표에만 남김, 확인',
      '구조도 그림 표기가 카탈로그 p.16 도면과 다름(175 고강도 스프링·2T 철판·아연도금·무게임 옵션·가이드레일 0.5T 등) → 표기 확인·수정 필요',
      '받은 단열 SLAT 그림은 "AL 0.5T or 1.2T", 카탈로그 p.16은 "AL 0.8T or 1.2T" → 화면 카드는 카탈로그(0.8T) 기준, 그림 수정 필요',
      'p.16 「AL. 압출(단열)셔터」 본문에는 우레탄 언급이 없고 도면에만 "우레탄 충진" → 16mm형도 우레탄 충진인지 확인',
    ],
  },
  {
    slug: 'al-wind',
    category: 'aluminum',
    name: '내풍압셔터',
    nameEn: 'AL. Wind Resistant Shutter',
    model: 'DOORS-4000',
    summary: '45~50m/s 강풍을 견디는 윈드락 알루미늄셔터',
    // 출처: 카탈로그 p.15 + 협업 업체 「AL. 내풍압셔터」 상세 페이지(특징·제품구성요소)
    intro:
      '이중압출 슬랫과 윈드락, AL 내풍압 가이드레일로 45~50m/s의 풍압을 견디도록 설계한 알루미늄셔터입니다. 강한 역풍에도 정상 작동 상태를 유지하고, 악천후로부터 시설과 장비를 보호합니다.',
    features: [
      { title: '뛰어난 복원력', body: '부드럽게 열리고 멈추며 소음이 적고, 철제보다 풍압에 의한 복원력이 뛰어납니다.' },
      { title: '초대형 내풍압셔터 제작', body: '윈드락을 장착해 강한 풍압을 견디며, 최대 14m까지 초대형으로 제작할 수 있습니다.' },
      { title: '소음 및 이물질 차단', body: '금속 마찰 소음이 적고 세밀한 결합으로 먼지·이물질을 막습니다. 방음셔터 제작도 가능합니다.' },
    ],
    uses: ['발전소', '공장·기계반입실', '대형 물류창고·물류센터', '남부지방·해안가', '군부대', '백화점·상가·차고'],
    specs: [
      { label: '슬랫', value: 'Pitch 72mm, 1.2T × 16mm AL6063 이중압출물' },
      { label: '가이드레일', value: '150 × 5T AL6063 이중압출물' },
      { label: '윈드락', value: 'AL6063 BEARING TYPE (10단마다 체결)' },
      { label: '하단', value: 'I BAR' },
      { label: '셔터박스', value: '600 ~ VAR.' },
      { label: '최대 크기', value: '폭 14m × 높이 12m (초대형 제작)' },
    ],
    // 슬랫 종류: 협업 업체 「SLAT의 종류」 — 이중압출 × 두께 3종 (단열 슬랫은 내풍압단열셔터로)
    slatGroups: [
      {
        name: '이중압출 슬랫',
        nameEn: 'AL EXTRUDED SLAT',
        body: 'AL6063 이중압출 슬랫입니다.',
        rows: [
          { thickness: '1.2T', total: '15mm', pitch: '72mm' },
          { thickness: '1.6T', total: '15mm', pitch: '72mm' },
          { thickness: '1.3T', total: '22.4mm', pitch: '72mm' },
        ],
      },
    ],
    // 셔터의 구성: 협업 업체 「제품구성요소 > 셔터의 구성」 (3묶음 × 4)
    componentsHead: { en: 'SHUTTER PARTS', title: '셔터의 구성' },
    components: [
      { group: '가이드레일 + 윈드락 + 슬랫', name: 'DJWL-1 조합', nameEn: 'AL GUIDE RAIL 5T', body: 'AL 슬랫 1.2T / 1.3T × 15mm\n피치 72mm · 윈드락 DJWL-1' },
      { group: '가이드레일 + 윈드락 + 슬랫', name: 'DJWL-2 조합', nameEn: 'AL GUIDE RAIL 5T', body: 'AL 슬랫 1.3T × 22.4mm\n피치 72mm · 윈드락 DJWL-2' },
      { group: '가이드레일 + 윈드락 + 슬랫', name: 'DJWL-3 조합', nameEn: 'AL GUIDE RAIL 5T', body: 'AL 슬랫 1.2T / 1.3T × 15mm\n피치 72mm · 윈드락 DJWL-3' },
      { group: '가이드레일 + 윈드락 + 슬랫', name: 'DJWL-4 조합', nameEn: 'AL GUIDE RAIL 5T', body: 'AL 슬랫 1.3T × 22.4mm\n피치 72mm · 윈드락 DJWL-4' },
      { group: '윈드락', name: 'DJWL-1', nameEn: 'WIND LOCK', body: '재질 AL' },
      { group: '윈드락', name: 'DJWL-2', nameEn: 'WIND LOCK · 22.4mm', body: '재질 아세탈' },
      { group: '윈드락', name: 'DJWL-3', nameEn: 'WIND LOCK', body: '재질 AL' },
      { group: '윈드락', name: 'DJWL-4', nameEn: 'WIND LOCK', body: '재질 아세탈' },
      { group: '가이드레일 · 하단바', name: '가이드레일', nameEn: 'GUIDE RAIL', body: '양쪽에 각파이프를 지지해 강한 풍압에 견디도록 설계했습니다.' },
      { group: '가이드레일 · 하단바', name: '가이드레일', nameEn: 'GUIDE RAIL', body: 'AL 내풍압 가이드레일' },
      { group: '가이드레일 · 하단바', name: '하단바 T 타입', nameEn: 'BOTTOM BAR · TYPE T', body: 'TYPE T' },
      { group: '가이드레일 · 하단바', name: '하단바 I 타입', nameEn: 'BOTTOM BAR · TYPE I', body: 'TYPE I' },
    ],
    certs: ['AL 1.2T × 16mm 45m/s 시험성적서', '방음 시험성적서'],
    todo: [
      '협업 업체 표: 이중압출 1.3T 피치 72mm (단열셔터 페이지 표는 75mm) → 확인',
      '전체두께 15mm(협업 업체) vs 16mm(카탈로그 p.15) 확인',
      '최대 크기 14m × 12m는 협업 업체 사진 표기 기준 → 대한방화 시공 가능 범위 확인',
      '내풍압 성능: 카탈로그 45m/s, 협업 업체 45~50m/s → 확인',
      '셔터의 구성 두 번째 가이드레일: 원자료에 설명 없음("GUIDE RAIL"만) → "AL 내풍압 가이드레일"로 임시 표기, 확인',
    ],
  },
  {
    slug: 'al-wind-insulated',
    category: 'aluminum',
    name: '내풍압단열셔터',
    nameEn: 'AL. Insulated Wind Resistant Shutter',
    summary: '50m/s 내풍압에 우레탄 단열까지 더한 셔터',
    intro:
      '우레탄 충진 28mm 슬랫에 윈드락을 더해 단열 성능과 50m/s 내풍압 성능을 함께 갖춘 알루미늄셔터입니다.',
    features: [
      { title: '풍속 50m/s 시험 통과', body: 'AL 1.0T × 28mm 슬랫 기준 50m/s 시험성적서를 보유하고 있습니다.' },
      { title: '단열 + 내풍압', body: '열관류율 기준을 만족하는 우레탄 충진 슬랫으로 단열과 내풍압을 한 번에 해결합니다.' },
      { title: '윈드락 체결', body: '슬랫 10단마다 윈드락을 체결해 강풍에도 슬랫 이탈을 막습니다.' },
    ],
    uses: ['해수담수화·하수처리 시설', '물류센터·식품공장', '발전소', '해안가 시설'],
    specs: [
      { label: '슬랫', value: 'Pitch 80mm, 1.0T × 28mm AL6063 이중압출물(우레탄 충진)' },
      { label: '가이드레일', value: '150 × 4T AL6063 이중압출물 (150 × 100)' },
      { label: '윈드락', value: 'AL6063 BEARING TYPE (83 × 35, 10단마다 체결)' },
      { label: '하단', value: 'I BAR' },
    ],
    // 슬랫 종류: 협업 업체 「AL. 내풍압셔터」 페이지의 단열 슬랫 표 (우레탄 충진 = 내풍압단열)
    slatGroups: [
      {
        name: '단열 슬랫',
        nameEn: 'AL INSULATED SLAT',
        body: '이중압출 슬랫 속에 우레탄을 충진했습니다.',
        rows: [
          { thickness: '1.2T', total: '15mm', pitch: '72mm' },
          { thickness: '1.6T', total: '15mm', pitch: '72mm' },
          { thickness: '1.3T', total: '22.4mm', pitch: '75mm' },
        ],
      },
    ],
    certs: ['AL 1.0T × 28mm 50m/s 시험성적서', '열관류율 1.233W/㎡K'],
    todo: [
      '용도 목록은 시공실적(다산 해수담수화, 인천 금곡동 푸드존, 영종도 하수처리장 = 단열내풍압)에서 뽑은 것 — 확인',
      '슬랫 종류 표(협업 업체: 1.2·1.6·1.3T, 15/22.4mm, 피치 72/75)와 카탈로그 슬랫(1.0T × 28mm, 피치 80) 다름 → 확인',
    ],
  },

  // ─────────────────────────── ⑶ 알루미늄셔터 ① 방범셔터 ───────────────────────────
  {
    slug: 'pipe-single',
    category: 'aluminum',
    name: '싱글 스텐파이프셔터',
    nameEn: 'Stainless Pipe Shutter',
    summary: '부식에 강한 스테인리스 파이프 방범셔터',
    intro:
      '스테인리스 파이프를 엮은 방범셔터로, 열리면 수직으로 올라가 셔터박스 위에 나란히 겹쳐집니다. 오버헤드도어의 장점을 살리면서 작은 박스 공간에도 설치할 수 있습니다.',
    features: [
      { title: '내부식성', body: '스테인리스 소재라 습기·염분이 많은 환경에서도 오래 씁니다.' },
      { title: '작은 박스 공간', body: '파이프가 셔터박스 상부에 병렬로 겹쳐져 설치 공간이 작습니다.' },
      { title: '개방감', body: '파이프 사이로 안이 보여 닫혀 있어도 답답하지 않습니다.' },
    ],
    uses: ['하수종말처리장', '빗물펌프장', '해안가', '원자력발전소', '지하주차장 출입구'],
    specs: [],
    todo: ['파이프 규격(지름·두께)·최대 사이즈 자료 없음'],
  },
  {
    slug: 'pipe-double',
    category: 'aluminum',
    name: '이중 스텐파이프셔터',
    nameEn: 'Double Stainless Pipe Shutter',
    // 출처: 카탈로그 '이중 스텐파이프 셔터' 페이지 (특징·용도)
    summary: '작은 박스 공간에 설치하는 스테인리스 파이프 방범셔터',
    intro:
      '열리면 수직으로 올라가 셔터박스 상부에 병렬로 겹쳐지는 스테인리스 파이프셔터입니다. 기존 오버헤드도어의 장점을 살리면서 작은 박스 공간으로도 설치할 수 있는 새로운 타입의 도어입니다.',
    features: [
      { title: '수직 상승·병렬 적층', body: '개폐 시 수직으로 올라가 셔터박스 상부에 병렬로 겹쳐집니다.' },
      { title: '작은 박스 공간', body: '오버헤드도어의 장점은 살리고, 작은 셔터박스 공간에도 설치할 수 있습니다.' },
      { title: '내부식성', body: '부식에 강한 스테인리스라 습기·염분이 많은 시설에 적합합니다.' },
    ],
    uses: ['하수종말처리장', '빗물펌프장', '해안가', '원자력발전소'],
    specs: [],
    todo: [
      '카탈로그의 싱글·이중 페이지 설명이 같음 — "이중"의 차이(파이프 배열·강도·간격 등)와 규격(지름·두께·최대 사이즈) 확인 필요',
      '요약·소개 문구는 카탈로그 문장을 다듬은 [가안]',
    ],
  },
  {
    slug: 'steel-security',
    category: 'aluminum',
    name: '철재방범셔터',
    nameEn: 'Steel Security Shutter',
    summary: '스텐판 슬랫으로 방범과 방화를 함께하는 셔터',
    intro:
      '방화문과 방화셔터의 이중 구조를 하나의 셔터 시스템으로 통합한 스테인리스 판 셔터입니다. 건축물 내부 면적을 최대한 활용할 수 있습니다.',
    features: [
      { title: '방범·방화 통합', body: '방화문 + 방화셔터 이중 구조를 셔터 하나로 해결합니다.' },
      { title: '공간 활용', body: '좁은 통로, 비상계단, 백화점 에스컬레이터 주변에 효과적입니다.' },
    ],
    uses: ['상가·점포', '창고 출입구', '좁은 통로·비상계단'],
    specs: [],
    todo: ['카탈로그에는 "스텐판 방범 및 방화셔터"로만 소개 — 철재방범셔터와 같은 제품인지, 슬랫 소재(스텐/철재) 확인'],
  },
  {
    slug: 'wave',
    category: 'aluminum',
    name: '웨이브셔터',
    nameEn: 'Wave Shutter',
    summary: '물결무늬 파이프로 매장을 보여주는 방범셔터',
    intro:
      '물결형 파이프를 그물처럼 엮은 개폐식 방범셔터입니다. 기존 슬랫·직선형 그릴셔터와 다른 디자인으로, 영업이 끝난 뒤에도 매장 안 제품과 디스플레이를 보여줍니다.',
    features: [
      { title: '완벽한 방범', body: '물결형 파이프를 상하좌우로 견고하게 결속해 외부에서 훼손하기 어렵습니다.' },
      { title: '광고 효과', body: '야간·휴일에도 매장 내부가 보여 디스플레이 효과가 이어집니다.' },
      { title: '경제성', body: '연결고리 파손과 파이프 유동 문제를 개선해 고장 없이 오래 씁니다.' },
    ],
    uses: ['상가·점포', '고급주택', '빌딩 로비'],
    specs: [{ label: '웨이브 파이프', value: 'Ø13.8' }],
  },

  // ─────────────────────────── 스피드도어 · 오버헤드도어 ───────────────────────────
  {
    slug: 'speed-door',
    category: 'speed-door',
    name: '스피드도어',
    nameEn: 'Speed Door',
    model: 'DOORS-1100 (AUTO REPAIR TYPE)',
    summary: '부딪혀도 자동으로 복구되는 고속 개폐 도어',
    intro:
      '차량이 빈번하게 드나드는 물류센터·공장에 맞춘 고속 도어입니다. 작동 중 충돌하거나 외력이 가해져도 파손을 최소화하고, 다시 작동하면 시트가 레일로 자동 복구됩니다.',
    features: [
      { title: '자동 복구', body: '충돌로 시트가 레일에서 빠져도 재작동 시 스스로 제자리로 돌아옵니다.' },
      { title: '뛰어난 밀폐력', body: '스프링 가이드와 PVC 가이드로 틈새를 막아 냉난방 손실을 줄입니다.' },
      { title: '다양한 센서', body: '푸시버튼, 포토센서, 적외선센서, 루프센서, 리모컨 등 현장에 맞게 부착합니다.' },
      { title: '컬러 선택', body: '그레이·오렌지·블루 시트와 비전 시트를 조합할 수 있습니다.' },
    ],
    uses: ['물류센터', '공장', '클린룸·식품 공장 내부 구획'],
    specs: [
      { label: '도어 시트', value: 'POLYESTER 합성 2중 접직조물 0.9, 2.0THK / 선택: POLYESTER 방염시트(국민안전처고시 제2016-138호 방염코팅)' },
      { label: '도어 박스', value: 'SUS 또는 EGI · 600(W) × 360(H) / 640(W) × 440(H)' },
      { label: '가이드레일', value: 'AL 피막처리 / PVC 고강도 압출성형재' },
      { label: '모터', value: '1/2HP(0.43kW) · 1HP(0.75kW) · 2HP(1.5kW) — Made in Italy / Japan' },
      { label: '컨트롤', value: '단상 AC220V, 인버터 타입' },
      { label: '가이드레일 커버', value: 'SUS 1.2T H/L' },
      { label: '최소 확보 공간', value: '좌 200mm / 우(모터측) 450mm' },
    ],
    // 출처: 카탈로그 p.23 구성품 및 구성도 · 자동 복구 기능 · DOOR COLOR · SENSOR
    components: [
      { name: '모터', nameEn: 'MOTOR', body: '이탈리아·일본산 모터를 사용합니다.' },
      { name: '컨트롤', nameEn: 'CONTROL', body: '다양한 센서를 부착할 수 있습니다.' },
      { name: '알루미늄 가이드레일', nameEn: 'AL. GUIDE RAIL', body: 'AL 사이드 가이드 · 스프링 가이드 · 스프링 · PVC 가이드 · 투스(Tooth)로 구성됩니다.' },
    ],
    steps: {
      title: 'AUTO REPAIR',
      heading: '자동 복구 기능',
      items: [
        { title: '충돌', body: '차량·지게차 등이 닫힌 도어에 부딪힙니다.' },
        { title: '시트 이탈', body: '시트가 레일에서 빠져나가며 충격을 흘려 보내 파손을 줄입니다.' },
        { title: '자동 복구', body: '다시 작동하면 시트가 레일로 들어가 원래대로 돌아옵니다.' },
      ],
    },
    colors: [
      { name: '그레이', nameEn: 'GRAY', hex: '#8b9099' },
      { name: '오렌지', nameEn: 'ORANGE', hex: '#ee6a2c' },
      { name: '블루', nameEn: 'BLUE', hex: '#3d3fae' },
      { name: '비전 시트', nameEn: 'VISION SHEET', hex: '#e9eef3', vision: true },
    ],
    sensors: [
      { name: '푸시버튼', nameEn: 'PUSH BUTTON', body: '손으로 터치하여 열고 닫습니다.' },
      { name: '포토센서', nameEn: 'PHOTO SENSOR', body: '빛을 이용해 물체의 유무를 감지합니다.' },
      { name: '적외선센서', nameEn: 'INFRARED SENSOR', body: '원추형 영역 안의 물체를 감지해 도어를 작동합니다.' },
      { name: '루프센서', nameEn: 'LOOP SENSOR', body: '지면에 자기장을 형성해 물체를 감지하고 도어를 작동합니다.' },
      { name: '리모컨', nameEn: 'REMOTE CONTROL', body: '원격으로 도어를 작동합니다.' },
    ],
    certs: ['특허 제10-0698757호'],
    todo: [
      '특허 제10-0698757호의 권리자 확인(대한방화 특허인지 제조사 특허인지)',
      '최소 확보 공간: 카탈로그 p.23은 좌 200mm, 새로 받은 구성도 이미지는 좌 300mm → 어느 쪽이 맞는지 확인',
      '컨트롤 박스 전원: 카탈로그 "1차 전원 인입 단상 220V" / 구성도 이미지 "좌,우겸용 단상전원 220V" 표기 차이',
    ],
  },
  {
    slug: 'overhead-door',
    category: 'overhead-door',
    name: '오버헤드도어',
    nameEn: 'Overhead Door',
    model: 'DOORS-2000',
    summary: '단열·방음·내풍압을 갖춘 패널형 산업용 도어',
    // 출처: 카탈로그 p.24(소개·SPECIFICATION·아이콘 5종 = 특징 5개) · p.25(용도·도어의 우수성·보안과 디자인) · p.26(구성도·PANEL·DOOR OPEN TYPE)
    intro:
      '강도와 단열성이 우수하고 외관이 깔끔하며, 내식성과 내구성이 뛰어나 물류창고와 격납고 등에 많이 쓰이는 산업용 도어입니다. 용도에 따라 다양한 패널을 고를 수 있고, 카운터 밸런스 시스템으로 작동이 원활하고 조작이 편리합니다. 견고한 보안을 갖추면서 원하는 디자인에 맞춰 설계·제작할 수 있습니다.',
    features: [
      { title: '단열', body: '고밀도 폴리우레탄 또는 난연 2급 준불연 우레탄 패널로 외부의 찬 공기와 먼지를 막아 실내 작업 환경을 지킵니다.' },
      { title: '에너지 절감', body: '투시창으로 채광이 좋아 에너지 효율을 높일 수 있습니다.' },
      { title: '방음', body: '외부로부터 소음 전달을 줄입니다.' },
      { title: '정비 용이', body: '수동 작동도 가능하며 고장이 적고 수리가 간단합니다. 유지보수가 거의 필요 없습니다.' },
      { title: '안전', body: '도어 추락 방지기로 도어 추락에 의한 사고를 미리 막습니다.' },
    ],
    uses: ['물류창고·격납고', '소방서·발전소', '식음료·유제품·빙과류 제조·보관시설', '농수축산물 저온 저장시설', '과일 후숙시설', '해안가 등 강풍 노출 장소'],
    specs: [
      { label: '패널', value: '내·외부 0.5mm 아연도 강판 또는 0.5mm AL 강판, 엠보스 가공 / 폴리우레탄 충진(50·80T), FIBER GLASS(50·60T), FULL VISION(50T)' },
      { label: '단열재', value: '폴리우레탄(50·80T), 난연 2급(준불연 2급 우레탄 50·80T) — 시험성적서 보유' },
      { label: '트랙', value: '고내구성 아연도 철판' },
      { label: '웨더 실', value: '상부, 하부, 양측면' },
      { label: '채광창', value: '이중 아크릴 630 × 330 × 3T' },
      { label: '색상', value: 'WHITE, GRAY 외 다양한 색상' },
      { label: '열관류율', value: '50T 0.785W/㎡K · 80T 0.605W/㎡K' },
      { label: '내풍압', value: '45m/s 풍압에 견디는 구조 (내풍압 시험성적서 보유)' },
    ],
    // 구성품 사진: 카탈로그 p.24 하단 (구동부 · 조작 스위치)
    components: [
      { name: '구동부', nameEn: 'DRIVE UNIT', body: '카운터 밸런스 시스템으로 작동이 원활하며, 수동 체인으로도 열고 닫을 수 있습니다.' },
      { name: '조작 스위치', nameEn: 'PUSH BUTTON SWITCH', body: '열림(OPEN) · 정지(STOP) · 닫힘(CLOSE) 버튼으로 간단하게 조작합니다.' },
    ],
    // 투시창·색상: 협업 업체 오버헤드도어 상세 페이지 자료 (이미지 사용 허락 확인 필요)
    window: {
      title: '투시창',
      spec: '이중 아크릴 630 × 330 × 3T',
      body: '투시창으로 채광률을 높여 에너지 효율을 높이고, 견고한 보안을 유지하면서 미관도 살립니다.',
    },
    colors: [
      { name: '화이트', nameEn: 'WHITE', hex: '#f1f2f3' },
      { name: '그레이', nameEn: 'GRAY', hex: '#9ba1a8' },
    ],
    panels: [
      { name: '우레탄', nameEn: 'URETHANE', thickness: '50T', pitch: '480 / 530mm' },
      { name: '우레탄', nameEn: 'URETHANE', thickness: '80T', pitch: '480 / 530mm' },
      { name: '풀비전', nameEn: 'FULL VISION', thickness: '50T', pitch: '주문 가능' },
      { name: '파이버글라스', nameEn: 'FIBER GLASS', thickness: '50 · 60T', pitch: '550mm' },
    ],
    openTypes: [
      { name: '스탠다드', nameEn: 'STANDARD TYPE', headroom: '헤드룸 600mm', body: '가장 일반적인 방식으로 개폐되는 타입입니다.' },
      { name: '하이리프트', nameEn: 'HI-LIFT TYPE', headroom: '헤드룸 600mm 이상', body: '개구부 높이보다 적은 공간에 적용하는 타입입니다.' },
      { name: '풀버티컬', nameEn: 'FULL VERTICAL TYPE', headroom: '헤드룸 = 개구부 높이 + 500mm', body: '도어가 열릴 때 수직으로 올라가는 타입입니다.' },
    ],
    certs: ['내풍압 시험성적서(45m/s)', '단열재 시험성적서'],
    todo: [
      '협업 업체 상세 페이지의 최대 사이즈 "115,000(W) × 5,000(H)"는 115m라 오기로 보임(11,500?) → 확인 전까지 미표기',
      '협업 업체 이미지(패널·투시창·색상) 사용 허락 확인',
      'DOOR OPEN TYPE 설명 문구가 "HEAD ROOM이 OPEN HEIGHT + 600MM"로 그림 표기(HEAD ROOM : 600MM)와 다름 → 그림 기준으로 정리, 확인 필요',
    ],
  },
];

export const getCategory = (key: string | undefined) => PRODUCT_CATEGORIES.find((c) => c.key === key);
export const getProduct = (slug: string | undefined) => PRODUCT_DETAILS.find((p) => p.slug === slug);
export const productsOf = (slugs: string[]) => slugs.map((s) => getProduct(s)!);
/** 제품이 속한 2단계 구분 (구분이 없는 카테고리면 undefined) */
export const groupOf = (category: CategoryInfo, slug: string) => category.groups?.find((g) => g.slugs.includes(slug));
/** 상세 URL — 제품이 하나뿐인 카테고리는 slug를 생략 */
export const productPath = (category: CategoryInfo, slug?: string) =>
  slug && category.slugs.length > 1 ? `/products/${category.key}/${slug}` : `/products/${category.key}`;
