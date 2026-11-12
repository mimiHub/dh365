import type { ReactNode } from 'react';
import { SiteShell } from '@/components/layout/SiteShell';

/** 사용자 사이트 — 머리·바닥·퀵메뉴가 있는 화면들. (/components 카탈로그는 이 틀 바깥) */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
