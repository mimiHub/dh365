// 견적문의 게시판 — 현재 dh365.co.kr 견적문의 목록 1페이지(2026.11 기준)를 옮김. 실제로는 백엔드 API 응답으로 바뀔 자리.
// 글쓴이는 가운데 글자를 가려 표시(개인 이름) — 업체·기관명은 그대로. 원본 사이트는 전체 이름이 노출되어 있음 → 리뉴얼 때 마스킹 권장

export interface QuoteItem {
  id: number; // 글 번호
  title: string;
  author: string;
  views: number;
  answered: boolean; // 관리자 답변(댓글) 여부 — 원본의 댓글 수 표시를 '답변완료'로 바꿔 보여 줌
  secret: boolean; // 비밀글 (작성자·관리자만 열람)
}

export const QUOTES: QuoteItem[] = [
  { id: 215, title: '철재방화셔터및망입유리', author: '장*균', views: 1, answered: false, secret: true },
  { id: 214, title: '주얼리매장 웨이브샷다 설치비용 문의.', author: '김*훈', views: 1, answered: false, secret: true },
  { id: 213, title: '상가 전동셔터 견적문의', author: '정*재', views: 1, answered: false, secret: true },
  { id: 212, title: '내풍압셔터 견적문의드립니다.', author: '최*길', views: 3, answered: false, secret: true },
  { id: 211, title: '제약회사 물류시설 내 설치를 목적으로 철제 셔터 견적 문의드립니다.', author: '김*영', views: 1, answered: false, secret: true },
  { id: 210, title: '비용 문의드립니다', author: '(주)디제이스틸텍', views: 2, answered: false, secret: true },
  { id: 209, title: '방화셔터 (도어포함) 견적, 상세 요청', author: '김*윤', views: 3, answered: false, secret: true },
  { id: 208, title: '내풍압셔터 견적문의', author: '모던산업', views: 4, answered: false, secret: true },
  { id: 207, title: '방범셔터 견적 문의드립니다.', author: '금융기관', views: 5, answered: false, secret: true },
  { id: 206, title: '소방 방화 스크린 및 도면 일람표에 나온사항 일체 견적문의 드립니다', author: '김*우', views: 3, answered: true, secret: true },
  { id: 205, title: '은행 방화문 교체', author: '김*석', views: 3, answered: true, secret: true },
  { id: 204, title: '철제 셔터 견적 요청드립니다.', author: '최*원', views: 3, answered: false, secret: true },
  { id: 203, title: '내풍압셔터 견적 문의 드립니다.', author: '이*구', views: 3, answered: false, secret: true },
  { id: 202, title: '방화스크린 견적', author: '이*길', views: 8, answered: true, secret: true },
  { id: 201, title: '방화셔터 견적서 요청드립니다.', author: '오*인', views: 10, answered: true, secret: true },
];
