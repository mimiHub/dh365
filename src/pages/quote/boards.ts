import { QUOTES, type QuoteItem } from '../../data/quotes';

/**
 * 문의 게시판 설정 — 견적문의와 설계문의는 화면(목록·작성·상세)과 폼이 같고, 이름·주소·글만 다름.
 * 다른 점만 여기 모아 두고 페이지 컴포넌트는 board 하나만 받아 그림 → 게시판이 늘어도 설정 한 줄 추가
 */
export interface Board {
  key: 'quote' | 'design';
  title: string; // 견적문의
  en: string; // 히어로 영문
  path: string; // /quote
  desc: string; // 히어로 설명
  items: QuoteItem[];
  emailHint: string;
  purpose: string; // 개인정보 이용 목적
}

export const BOARDS: Record<Board['key'], Board> = {
  quote: {
    key: 'quote',
    title: '견적문의',
    en: 'Estimate',
    path: '/quote',
    desc: '현장 규격과 용도를 남겨 주시면 담당자가 검토 후 견적을 안내해 드립니다.',
    items: QUOTES,
    emailHint: '견적서를 메일로도 받으실 수 있습니다.',
    purpose: '견적 산출 및 상담 안내',
  },
  design: {
    key: 'design',
    title: '설계문의',
    en: 'Design',
    path: '/design',
    desc: '인정 규격 검토와 설계 도면 상담을 도와드립니다.',
    // 현재 사이트의 설계문의 글은 아직 옮기지 못함 (사이트 접근 불가) → 목록 받으면 data에 추가
    items: [],
    emailHint: '검토 자료를 메일로도 받으실 수 있습니다.',
    purpose: '설계 검토 및 상담 안내',
  },
};
