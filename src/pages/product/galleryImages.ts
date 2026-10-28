// 제품 상세 상단 갤러리 사진 — 제품(slug)별 여러 장. 첫 장이 대표 사진.
// 사진은 모두 같은 4:3 칸에 object-fit: cover로 들어가므로 원본 비율이 달라도 크기가 같게 보임.
// [시공사례] 표시 사진은 메인 시공사례(site.ts CASES)에서 해당 제품으로 분류된 현장 사진 → 클라이언트 확인 필요
import screenShutterImg from '../../assets/product-screen-shutter.png';
import steelShutterImg from '../../assets/product-steel-shutter.png';
import steelBannerImg from '../../assets/banner-steel-shutter.jpg';
import windShutterImg from '../../assets/product-wind-shutter.png';
import securityShutterImg from '../../assets/product-security-shutter.png';
import pipeSingleImg from '../../assets/product-pipe-single.jpg';
import pipeSingleDetailImg from '../../assets/detail-pipe-single.jpg';
import speedDoorImg from '../../assets/product-speed-door.jpg';
import speedDoorRedImg from '../../assets/product-speed-door-red.jpg';
import overheadDoorImg from '../../assets/product-overhead-door.jpg';
import overheadBannerImg from '../../assets/banner-overhead-door.jpg';
import caseScreenNamdongImg from '../../assets/case-screen-incheon-namdong.png';
import caseScreenAnsanImg from '../../assets/case-screen-ansan-seonggok.png';
import caseScreenGongjuImg from '../../assets/case-screen-gongju-univ.png';
import caseSteelFactoryImg from '../../assets/case-steel-factory.png';
import caseSteelWarehouseImg from '../../assets/case-steel-food-warehouse.png';
import caseSteelParkingImg from '../../assets/case-steel-apt-parking.png';
import caseWindGarageImg from '../../assets/case-wind-garage.png';
import caseWindIntakeImg from '../../assets/case-wind-water-intake.png';
import caseWindGeumgokImg from '../../assets/case-wind-geumgok-foodzone.png';
import caseSecurityPipeImg from '../../assets/case-security-pipe.png';
import caseSecurityWaveImg from '../../assets/case-security-wave.png';

export interface GalleryImage {
  src: string;
  alt: string; // 사진 설명 — 스크린리더·썸네일 이름으로 사용
}

export const PRODUCT_GALLERY: Partial<Record<string, GalleryImage[]>> = {
  // product-screen-shutter.png = case-screen-gwangju-tech-hs.png(광주공고)와 같은 사진 → 한 장만
  screen: [
    { src: screenShutterImg, alt: '[시공사례] 광주공고 스크린방화셔터' },
    { src: caseScreenNamdongImg, alt: '[시공사례] 인천남동물류센터 하역장' },
    { src: caseScreenAnsanImg, alt: '[시공사례] 안산성곡물류센터 하역장' },
    { src: caseScreenGongjuImg, alt: '[시공사례] 공주대학교 사범대학' },
  ],
  steel: [
    { src: steelShutterImg, alt: '물류센터 철재방화셔터 설치 모습' },
    { src: steelBannerImg, alt: '물류센터 철재방화셔터 전경' },
    { src: caseSteelFactoryImg, alt: '[시공사례] 자동차 부품공장' },
    { src: caseSteelWarehouseImg, alt: '[시공사례] 식품 물류창고' },
    { src: caseSteelParkingImg, alt: '[시공사례] 아파트 지하주차장' },
  ],
  'al-wind': [
    { src: windShutterImg, alt: '내풍압셔터 설치 모습' },
    { src: caseWindGarageImg, alt: '[시공사례] 차고지 내풍압셔터' },
    { src: caseWindIntakeImg, alt: '[시공사례] 취수장 내풍압셔터' },
  ],
  'al-wind-insulated': [{ src: caseWindGeumgokImg, alt: '[시공사례] 인천 금곡동 푸드존 단열내풍압셔터' }],
  'pipe-single': [
    { src: pipeSingleImg, alt: '지하주차장 출입구 스텐파이프셔터' },
    { src: pipeSingleDetailImg, alt: '스테인리스 파이프·연결 링크 구조' },
    { src: caseSecurityPipeImg, alt: '[시공사례] 파이프셔터' },
  ],
  // product-security-shutter.png = case-security-perforated.png(타공셔터)와 같은 사진 → 한 장만
  'steel-security': [{ src: securityShutterImg, alt: '[시공사례] 타공셔터' }],
  wave: [{ src: caseSecurityWaveImg, alt: '웨이브셔터' }],
  'speed-door': [
    { src: speedDoorRedImg, alt: '스피드도어 정면' },
    { src: speedDoorImg, alt: '물류센터 외벽 스피드도어' },
  ],
  'overhead-door': [
    { src: overheadDoorImg, alt: '오버헤드도어 정면' },
    { src: overheadBannerImg, alt: '물류창고 오버헤드도어 개방 모습' },
  ],
};
