// 공지사항 — 현재 dh365.co.kr 공지사항(2026.11 기준, 전체 9건)에서 옮김. 실제로는 백엔드 API 응답으로 바뀔 자리.
// - 원본 7번 '브랜드마케팅을 위한 핵심 전략과 대행사 선택 기준'(글쓴이 화이팅)은 외부 광고성 답글이라 옮기지 않음 → 번호는 원본 그대로 둠
// - 원본 글쓴이는 모두 'SDENC'(관리 계정)라 자료실처럼 화면에서 뺌
// - 등록일·본문은 원본에서 확인 못 함 (고정 공지만 메인 '대한방화 소식'에 쓰던 요약이 있음)

export interface NoticeItem {
  id: number;
  title: string;
  views: number;
  /** 상단 고정 — 목록 맨 위, 번호 대신 '공지' */
  pinned?: boolean;
  /** 댓글 수 */
  comments?: number;
  /** 'YYYY.MM.DD' — 확인되면 채움 */
  date?: string;
  /** 본문 (줄바꿈 그대로 보여 줌) */
  body?: string;
}

export const NOTICES: NoticeItem[] = [
  {
    id: 9,
    pinned: true,
    title: '방화셔터(스크린) 대형화(12m x 8.5m) 인정서 발급 안내',
    views: 1576,
    body: '방화스크린셔터의 인정 사이즈를 기존 8,000 × 4,000mm에서 최대 12,000 × 8,500mm로 상향하여, 2025년 3월 인정서를 발급받았습니다.\n철재방화셔터는 기존 인정 사이즈를 유지합니다.\n\n대형 개구부 현장의 설계·견적 문의는 견적문의 게시판이나 대표번호로 연락 주세요.',
  },
  { id: 8, title: '대형방화셔터 인정서 발급 안내', views: 45 },
  { id: 6, title: '대표이사 과학기술정보통신부장관상 포상', views: 437 },
  { id: 5, title: '방화셔터(스크린) SIZE 12m x 8.5m 상향', views: 826, comments: 1 },
  { id: 4, title: '방화셔터 인정 승인 관련', views: 397 },
  { id: 3, title: '일체형 방화셔터 사용 전면 금지[시행 2020.1.30]', views: 182 },
  { id: 2, title: "갑자기 내려온 방화셔터… 목 눌린 9살 '의식불명'", views: 189 },
  { id: 1, title: '방화셔터 인정제도 의무화', views: 179 },
];

export const noticePath = (id?: number) => (id ? `/notice/${id}` : '/notice');
