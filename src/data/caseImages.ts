// 시공사례 사진 — 메인 시공사례 섹션과 시공사례 페이지가 같이 씀 (한 곳에서 관리)
const caseSteelFactoryImg = '/images/case-steel-factory.png';
const caseSteelFoodWarehouseImg = '/images/case-steel-food-warehouse.png';
const caseSteelAptParkingImg = '/images/case-steel-apt-parking.png';
const caseSteelAsanBaebangImg = '/images/case-steel-asan-baebang.jpg';
const caseSteelDaeguGolfImg = '/images/case-steel-daegu-golf.jpg';
const caseScreenIncheonNamdongImg = '/images/case-screen-incheon-namdong.png';
const caseScreenAnsanSeonggokImg = '/images/case-screen-ansan-seonggok.png';
const caseScreenWirelessControllerImg = '/images/case-screen-wireless-controller.png';
const caseScreenIncheonUnivImg = '/images/case-screen-incheon-univ.png';
const caseScreenGumiSagokEsImg = '/images/case-screen-gumi-sagok-es.png';
const caseScreenGongjuUnivImg = '/images/case-screen-gongju-univ.png';
const caseScreenGwangjuTechHsImg = '/images/case-screen-gwangju-tech-hs.png';
const caseScreenYeomjakEsImg = '/images/case-screen-yeomjak-es.png';
const caseSmokeFoodCourtImg = '/images/case-smoke-food-court.png';
const caseSmokeLifeHqImg = '/images/case-smoke-life-hq.png';
const caseSmokeEmployeeCafeteriaImg = '/images/case-smoke-employee-cafeteria.png';
const caseWiredInstallSiteImg = '/images/case-wired-install-site.png';
const caseWiredSupiaHallImg = '/images/case-wired-supia-hall.png';
const caseWiredUniversityImg = '/images/case-wired-university.png';
const caseWindH2StationImg = '/images/case-wind-h2-station.png';
const caseWindGeumgokFoodzoneImg = '/images/case-wind-geumgok-foodzone.png';
const caseWindWaterIntakeImg = '/images/case-wind-water-intake.png';
const caseWindAluminumHighspeedImg = '/images/case-wind-aluminum-highspeed.png';
const caseWindGarageImg = '/images/case-wind-garage.png';
const caseSecurityPerforatedImg = '/images/case-security-perforated.png';
const caseSecurityWaveImg = '/images/case-security-wave.png';
const caseSecurityPipeImg = '/images/case-security-pipe.png';

// 시공사례별 사진. 실제 이미지가 있는 사례(id 기준)만 채우고, 나머지는 Media가 플레이스홀더로 표시합니다.
export const CASE_IMAGES: Partial<Record<number, string>> = {
  2: caseSteelFactoryImg, // 자동차 부품공장 철재방화셔터
  9: caseSteelFoodWarehouseImg, // OO식품 물류창고 철제방화셔터
  13: caseSteelAptParkingImg, // 아파트 지하주차장 철제방화셔터
  27: caseSteelAsanBaebangImg, // 아산시 배방읍 세교리 근린생활 지하주차장
  28: caseSteelDaeguGolfImg, // 대구 골프연습장 철재방화셔터(인정제품)
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
