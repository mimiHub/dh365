// 카탈로그 예시 화면용 목업 데이터 — 실제 관리자 사이트에서는 API 응답으로 바뀔 자리 (모양 참고용)
import heroScreen from '../../../assets/product-screen-shutter.png';
import heroSteel from '../../../assets/product-steel-shutter.png';
import heroWind from '../../../assets/product-wind-shutter.png';

export interface Banner {
  id: number;
  title: string;
  /** 배너 위 큰 글 / 작은 글 */
  heading: string;
  sub: string;
  image: string;
  link: string;
  /** 노출 기간 */
  start: string;
  end: string;
  visible: boolean;
  order: number;
}

export const BANNERS: Banner[] = [
  { id: 3, title: '대형 방화스크린셔터', heading: '폭 12,000mm까지, 대형 방화스크린셔터', sub: '2025년 3월 인정서 발급', image: heroScreen, link: '/products/screen', start: '2026-03-01', end: '2026-12-31', visible: true, order: 1 },
  { id: 2, title: '철재방화셔터', heading: '한번 시공하면 끝까지 책임집니다', sub: '국내 대형 건설사 협업', image: heroSteel, link: '/products/steel', start: '2026-01-01', end: '2026-12-31', visible: true, order: 2 },
  { id: 1, title: '내풍압셔터', heading: '강풍·풍압에도 끄떡없는 내풍압셔터', sub: '물류센터·공장 출입구', image: heroWind, link: '/cases/wind', start: '2025-06-01', end: '2025-12-31', visible: false, order: 3 },
];

export interface Qna {
  id: number;
  category: '제품' | '시공' | '인정·법규' | '기타';
  question: string;
  answer?: string;
  author: string;
  date: string;
  /** 사이트 FAQ에 공개 */
  public: boolean;
}

export const QNAS: Qna[] = [
  { id: 14, category: '인정·법규', question: '방화스크린셔터 인정 사이즈가 어떻게 되나요?', author: '김*수', date: '2026-11-10', public: true, answer: '방화스크린셔터는 최대 12,000 × 8,500mm까지 인정을 받았습니다(2025년 3월 인정서 발급).' },
  { id: 13, category: '시공', question: '기존 셔터 철거 후 교체 시공도 가능한가요?', author: '이*영', date: '2026-11-09', public: false },
  { id: 12, category: '제품', question: '스크린셔터와 철재셔터 중 어떤 걸 골라야 하나요?', author: '박*호', date: '2026-11-07', public: true, answer: '설치 위치의 개구부 크기·용도·마감에 따라 다릅니다. 현장 정보를 남겨 주시면 검토해 드립니다.' },
  { id: 11, category: '기타', question: '부산 지역도 사후관리가 되나요?', author: '정*민', date: '2026-11-05', public: false },
];

export type InquiryState = '접수' | '검토중' | '답변완료';

export interface Inquiry {
  id: number;
  type: '견적' | '설계';
  title: string;
  company: string;
  phone: string;
  date: string;
  state: InquiryState;
}

export const INQUIRIES: Inquiry[] = [
  { id: 215, type: '견적', title: '물류센터 내풍압셔터 6개소 견적 요청', company: '(주)한빛로지스', phone: '010-****-1234', date: '2026-11-12', state: '접수' },
  { id: 214, type: '설계', title: '지하주차장 방화구획 셔터 인정 규격 문의', company: 'OO건축사사무소', phone: '010-****-5678', date: '2026-11-11', state: '검토중' },
  { id: 213, type: '견적', title: '공장 출입구 스피드도어 교체', company: '대성정밀', phone: '010-****-2468', date: '2026-11-10', state: '답변완료' },
  { id: 212, type: '견적', title: '상가 방범셔터 2개소', company: '개인', phone: '010-****-1357', date: '2026-11-08', state: '답변완료' },
];
