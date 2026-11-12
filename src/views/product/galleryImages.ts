// 제품 상세 상단 갤러리 사진 — 제품(slug)별 여러 장. 첫 장이 대표 사진.
// 사진은 모두 같은 4:3 칸에 object-fit: cover로 들어가므로 원본 비율이 달라도 크기가 같게 보임.
// 구조 상세 사진(ProductPage의 DETAIL_IMAGES)은 여기 적지 않음 — 있으면 갤러리 2번째 장에 자동으로 들어감
// [시공사례] 표시 사진은 메인 시공사례(site.ts CASES)에서 해당 제품으로 분류된 현장 사진 → 클라이언트 확인 필요
const screenShutterImg = '/images/product-screen-shutter.png';
const steelShutterImg = '/images/product-steel-shutter.png';
const steelBannerImg = '/images/banner-steel-shutter.jpg';
const windShutterImg = '/images/product-wind-shutter.png';
const alInsulatedImg = '/images/product-al-insulated.jpg';
const securityShutterImg = '/images/product-security-shutter.png';
const pipeSingleImg = '/images/product-pipe-single.jpg';
const pipeDoubleImg = '/images/product-pipe-double.jpg';
const speedDoorImg = '/images/product-speed-door.jpg';
const speedDoorRedImg = '/images/product-speed-door-red.jpg';
const overheadDoorImg = '/images/product-overhead-door.jpg';
const overheadBannerImg = '/images/banner-overhead-door.jpg';
const caseScreenNamdongImg = '/images/case-screen-incheon-namdong.png';
const caseScreenAnsanImg = '/images/case-screen-ansan-seonggok.png';
const caseScreenGongjuImg = '/images/case-screen-gongju-univ.png';
const caseSteelFactoryImg = '/images/case-steel-factory.png';
const caseSteelWarehouseImg = '/images/case-steel-food-warehouse.png';
const caseSteelParkingImg = '/images/case-steel-apt-parking.png';
const caseWindGarageImg = '/images/case-wind-garage.png';
const caseWindIntakeImg = '/images/case-wind-water-intake.png';
const caseWindGeumgokImg = '/images/case-wind-geumgok-foodzone.png';
const caseSecurityPipeImg = '/images/case-security-pipe.png';
const waveImg = '/images/product-wave.jpg';
const wave2Img = '/images/product-wave-2.jpg';

export interface GalleryImage {
  src: string;
  alt: string; // 사진 설명 — 스크린리더·썸네일 이름으로 사용
  /** 'contain': 칸에 맞춰 자르지 않고 전체를 보여 줌(흰 배경 제품·구조 사진용). 기본은 칸을 꽉 채움(cover) */
  fit?: 'contain';
}

// 철재방화셔터 사진 — 철재단열방화셔터도 같이 씀 (겉모습이 같고 슬랫 속 충전재만 다름)
const STEEL_GALLERY: GalleryImage[] = [
  { src: steelShutterImg, alt: '물류센터 철재방화셔터 설치 모습' },
  { src: steelBannerImg, alt: '물류센터 철재방화셔터 전경' },
  { src: caseSteelFactoryImg, alt: '[시공사례] 자동차 부품공장' },
  { src: caseSteelWarehouseImg, alt: '[시공사례] 식품 물류창고' },
  { src: caseSteelParkingImg, alt: '[시공사례] 아파트 지하주차장' },
];

export const PRODUCT_GALLERY: Partial<Record<string, GalleryImage[]>> = {
  // product-screen-shutter.png = case-screen-gwangju-tech-hs.png(광주공고)와 같은 사진 → 한 장만
  screen: [
    { src: screenShutterImg, alt: '[시공사례] 광주공고 스크린방화셔터' },
    { src: caseScreenNamdongImg, alt: '[시공사례] 인천남동물류센터 하역장' },
    { src: caseScreenAnsanImg, alt: '[시공사례] 안산성곡물류센터 하역장' },
    { src: caseScreenGongjuImg, alt: '[시공사례] 공주대학교 사범대학' },
  ],
  steel: STEEL_GALLERY,
  // 철재단열방화셔터 사진이 없어 철재방화셔터 사진을 임시로 같이 씀(겉모습 동일) → 받으면 교체
  'steel-insulated': STEEL_GALLERY,
  'al-insulated': [{ src: alInsulatedImg, alt: '건물 출입구 알루미늄 단열셔터' }],
  'al-wind': [
    { src: windShutterImg, alt: '내풍압셔터 설치 모습' },
    { src: caseWindGarageImg, alt: '[시공사례] 차고지 내풍압셔터' },
    { src: caseWindIntakeImg, alt: '[시공사례] 취수장 내풍압셔터' },
  ],
  'al-wind-insulated': [{ src: caseWindGeumgokImg, alt: '[시공사례] 인천 금곡동 푸드존 단열내풍압셔터' }],
  'pipe-single': [
    { src: pipeSingleImg, alt: '지하주차장 출입구 스텐파이프셔터' },
    { src: caseSecurityPipeImg, alt: '[시공사례] 파이프셔터' },
  ],
  // product-security-shutter.png = case-security-perforated.png(타공셔터)와 같은 사진 → 한 장만
  'pipe-double': [{ src: pipeDoubleImg, alt: '상가 전면 이중 스텐파이프셔터' }],
  'steel-security': [{ src: securityShutterImg, alt: '[시공사례] 타공셔터' }],
  wave: [
    { src: waveImg, alt: '상가 전면 웨이브셔터' },
    { src: wave2Img, alt: '매장 안에서 본 웨이브셔터' },
  ],
  'speed-door': [
    { src: speedDoorRedImg, alt: '스피드도어 정면' },
    { src: speedDoorImg, alt: '물류센터 외벽 스피드도어' },
  ],
  'overhead-door': [
    { src: overheadDoorImg, alt: '오버헤드도어 정면' },
    { src: overheadBannerImg, alt: '물류창고 오버헤드도어 개방 모습' },
  ],
};
