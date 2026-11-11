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

// ── 상세 화면용 목업 ──
// 원본 글은 비밀글이라 내용을 알 수 없음 → 화면 확인용 예시. 실제로는 비밀번호 확인 API가 맞을 때만 서버가 내용을 내려 줌
export const MOCK_PASSWORD = '1234';

export interface QuoteDetail {
  contact: string; // 가린 연락처
  email: string;
  region: string;
  products: string[];
  size: string;
  files: string[];
  body: string;
  answer?: { by: string; body: string };
}

// 제목의 낱말로 제품을 짐작 (예시 내용이 제목과 어긋나지 않게)
const productsOf = (title: string) => {
  const found = [
    [/스크린/, '스크린방화셔터'],
    [/철재|철제/, '철재방화셔터'],
    [/내풍압/, '내풍압셔터'],
    [/방범|웨이브|샷다/, '방범셔터'],
    [/망입/, '망입유리'],
  ].filter(([re]) => (re as RegExp).test(title)).map(([, name]) => name as string);
  return found.length ? found : ['기타'];
};

export const quoteDetailOf = (q: QuoteItem): QuoteDetail => ({
  contact: '010-****-5678',
  email: '',
  region: '경기도 화성시',
  products: productsOf(q.title),
  size: '폭 4,000 × 높이 3,500mm · 2개소',
  files: ['현장사진_01.jpg', '평면도.pdf'],
  body: `${q.title}\n\n현장 도면과 사진을 첨부했습니다. 설치 가능 여부와 대략적인 견적, 시공 가능한 일정을 안내 부탁드립니다.`,
  answer: q.answered
    ? { by: '(주)대한방화 담당자', body: '안녕하세요, (주)대한방화입니다.\n문의하신 내용 확인했습니다. 첨부해 주신 도면 기준으로 견적서를 작성해 남겨 주신 연락처로 안내드렸습니다.\n현장 실측이 필요하면 담당자가 일정 조율 연락을 드리겠습니다.' }
    : undefined,
});
