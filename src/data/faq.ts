// 자주 묻는 질문 — 답은 사이트에 이미 있는 사실(인정 규격·지사·문의 방법)에서 씀.
// draft: true = 회사 운영 방침이라 클라이언트 확인 필요 [가안]

export type FaqCategory = 'product' | 'inquiry' | 'service';

export const FAQ_CATEGORIES: { value: FaqCategory; label: string }[] = [
  { value: 'product', label: '제품' },
  { value: 'inquiry', label: '견적·문의' },
  { value: 'service', label: '시공·사후관리' },
];

export interface FaqItem {
  id: string;
  category: FaqCategory;
  q: string;
  a: string; // 줄바꿈(\n) 그대로 표시
  link?: { label: string; href: string };
  draft?: boolean;
}

export const FAQS: FaqItem[] = [
  {
    id: 'certified',
    category: 'product',
    q: '방화셔터 인정제품이란 무엇인가요?',
    a: '방화셔터는 성능 시험을 거쳐 인정 승인을 받은 제품만 쓸 수 있습니다.\n대한방화는 인정 승인을 완료한 제품으로만 설계·시공하며, 현장 용도에 맞는 인정 규격을 먼저 검토해 드립니다.',
  },
  {
    id: 'screen-size',
    category: 'product',
    q: '스크린방화셔터는 얼마나 크게 설치할 수 있나요?',
    a: '최대 폭 12,000 × 높이 8,500mm까지 설치할 수 있습니다.\n기존 8,000 × 4,000mm였던 인정 사이즈를 상향해 2025년 3월 인정서를 발급받았습니다.',
    link: { label: '스크린방화셔터 보기', href: '/products/screen' },
  },
  {
    id: 'steel-size',
    category: 'product',
    q: '철재방화셔터의 인정 규격은 어떻게 되나요?',
    a: '철재방화셔터의 인정 규격은 8,000 × 4,000mm입니다.',
    link: { label: '철재방화셔터 보기', href: '/products/steel' },
  },
  {
    id: 'screen-vs-steel',
    category: 'product',
    q: '스크린방화셔터와 철재방화셔터는 어떻게 다른가요?',
    a: '스크린방화셔터는 내화 원단으로 만들어 가볍고, 천장 공간이 좁은 곳에도 설치할 수 있습니다.\n철재방화셔터는 강판 슬랫으로 개구부를 막는 방식입니다.\n현장 조건(개구부 크기, 천장 공간, 용도)에 따라 알맞은 제품을 안내해 드립니다.',
  },
  {
    id: 'wind',
    category: 'product',
    q: '내풍압셔터는 어디에 쓰나요?',
    a: '강풍과 풍압을 견디도록 보강한 셔터로, 바람을 많이 받는 물류센터·공장 출입구에 주로 설치합니다.',
    link: { label: '내풍압셔터 보기', href: '/products/aluminum/al-wind' },
  },
  {
    id: 'how-quote',
    category: 'inquiry',
    q: '견적은 어떻게 받을 수 있나요?',
    a: '견적문의 게시판에 현장 규격과 용도를 남겨 주시면 담당자가 검토 후 안내해 드립니다.\n급하신 경우 대표번호로 전화 주세요.',
    link: { label: '견적문의 작성', href: '/quote/write' },
  },
  {
    id: 'no-size',
    category: 'inquiry',
    q: '정확한 규격을 몰라도 문의할 수 있나요?',
    a: '네. 규격 칸은 비워 두셔도 됩니다. 현장 사진이나 도면을 첨부해 주시면 검토가 빨라지고, 필요하면 현장 확인 후 안내해 드립니다.',
    draft: true,
  },
  {
    id: 'quote-vs-design',
    category: 'inquiry',
    q: '견적문의와 설계문의는 무엇이 다른가요?',
    a: '견적문의는 설치 비용 견적을 받고 싶을 때, 설계문의는 인정 규격 검토나 설계 도면 상담이 필요할 때 이용해 주세요.\n두 게시판의 작성 양식은 같습니다.',
    link: { label: '설계문의 작성', href: '/design/write' },
  },
  {
    id: 'secret',
    category: 'inquiry',
    q: '문의한 글을 다른 사람이 볼 수 있나요?',
    a: '아니요. 모든 문의는 비밀글로 등록되어 작성자와 담당자만 볼 수 있습니다.\n글을 볼 때는 작성할 때 입력한 비밀번호가 필요합니다.',
  },
  {
    id: 'lost-password',
    category: 'inquiry',
    q: '글 비밀번호를 잊어버렸어요.',
    a: '대표번호로 연락 주시면 작성자 확인 후 안내해 드립니다.',
    draft: true,
  },
  {
    id: 'region',
    category: 'service',
    q: '어느 지역까지 시공하나요?',
    a: '과천 본사와 부산·광주 지사에서 수도권·영남·호남 지역 현장 상담과 시공을 지원합니다.',
    draft: true,
  },
  {
    id: 'replace',
    category: 'service',
    q: '기존 철재 셔터를 스크린방화셔터로 바꿀 수 있나요?',
    a: '가능합니다. 학교 등에서 철재 셔터를 스크린방화셔터로 교체한 시공 사례가 있습니다.\n현장 구조에 따라 달라지니 사진과 함께 문의해 주세요.',
    link: { label: '시공사례 보기', href: '/cases/screen' },
  },
  {
    id: 'maintenance',
    category: 'service',
    q: '시공 후 유지보수도 해 주나요?',
    a: '네. 시공 후 점검과 유지보수 상담을 지원합니다.',
    draft: true,
  },
];
