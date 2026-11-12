import type { ComponentType } from 'react';

export type GroupKey = 'ui' | 'page' | 'admin' | 'example';

export const GROUPS: { key: GroupKey; name: string; desc: string; path: string }[] = [
  { key: 'ui', name: '기초 UI', desc: '버튼·배지·아이콘처럼 어디서나 쓰는 가장 작은 조각', path: 'src/components/ui' },
  { key: 'page', name: '사용자 화면 조각', desc: '하위 페이지(자료실·공지사항·회사소개 등)를 조립하는 조각', path: 'src/components/page' },
  { key: 'admin', name: '관리자', desc: '관리자 사이트 화면을 조립하는 조각 — 틀·표·폼·창', path: 'src/components/admin' },
  { key: 'example', name: '조립 예시', desc: '관리자 컴포넌트로 실제 화면을 조립한 예 — 새 화면의 출발점', path: 'src/views/catalog/examples/screens.tsx' },
];

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  desc: string;
}

/** 카탈로그 항목 하나 = 컴포넌트 하나 */
export interface Entry {
  /** 주소 #id */
  id: string;
  name: string;
  group: GroupKey;
  /** 가져오는 곳 — import { name } from '…' */
  from: string;
  desc: string;
  Demo: ComponentType;
  /** 쓰는 법 — 복사해서 바로 쓸 수 있는 코드 */
  code: string;
  props?: PropDoc[];
  /** 데모를 여백 없이 꽉 차게 (관리자 틀·전체 화면 예시) */
  bleed?: boolean;
}
