// 자료실 — 현재 dh365.co.kr 자료실(2026.11 기준)에서 옮김.
// 시방서·일람표 및 설계도면 12건만 확인됨. 보도자료·관련법규·동영상자료는 글 목록 미확보 → 빈 목록
// 원본 글쓴이는 모두 'SDENC'(관리 계정)라 방문자에게 의미가 없어 화면에서는 뺌

export type LibraryKey = 'spec' | 'press' | 'law' | 'video';

export const LIBRARY_CATEGORIES: { key: LibraryKey; name: string; desc: string }[] = [
  { key: 'spec', name: '시방서·일람표 및 설계도면', desc: '설계·감리에 필요한 시방서와 상세도, 인정서를 내려받으세요.' },
  { key: 'press', name: '보도자료', desc: '대한방화 관련 보도자료입니다.' },
  { key: 'law', name: '관련법규', desc: '방화셔터 설치와 관련된 법규·기준 자료입니다.' },
  { key: 'video', name: '동영상자료', desc: '제품 작동과 시공 현장 영상입니다.' },
];

export interface LibraryItem {
  id: number;
  category: LibraryKey;
  title: string;
  views: number;
}

export const LIBRARY: LibraryItem[] = [
  { id: 12, category: 'spec', title: '투시형 철재방화셔터 상세도', views: 730 },
  { id: 11, category: 'spec', title: '방화셔터(스크린) 설치상세도 및 셔터 일람표 참고도면', views: 1967 },
  { id: 10, category: 'spec', title: '방화셔터 설치를 위한 가이드레일 설치 개념도', views: 1142 },
  { id: 9, category: 'spec', title: '방화셔터 배관배선 구분도', views: 540 },
  { id: 8, category: 'spec', title: '방화셔터 인정서', views: 576 },
  { id: 7, category: 'spec', title: '연동제어기 결선 상세도', views: 583 },
  { id: 6, category: 'spec', title: '독씰(DOCK SEAL) 시방서 및 상세도', views: 280 },
  { id: 5, category: 'spec', title: '독레벨러(DOCK LEVELER) 시방서 및 상세도', views: 298 },
  { id: 4, category: 'spec', title: '오버헤드도어 시방서 및 상세도', views: 471 },
  { id: 3, category: 'spec', title: '무기둥스크린방화셔터 시방서 및 상세도', views: 993 },
  { id: 2, category: 'spec', title: '철재방화셔터 시방서 및 상세도[2022]', views: 1290 },
  { id: 1, category: 'spec', title: '스크린방화셔터 시방서 및 상세도[2022]', views: 1142 },
];

export const libraryPath = (key: LibraryKey, id?: number) => `/library/${key}${id ? `/${id}` : ''}`;
