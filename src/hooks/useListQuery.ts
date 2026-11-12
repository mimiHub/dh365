import { useRef } from 'react';
import { useNavigate, useSearchParams } from '@/lib/router';

// 검색: 띄어쓰기 차이는 무시 ("지하 주차장" = "지하주차장") — 한글 제목은 띄어쓰기가 제각각이라
export const squash = (t: string) => t.replace(/\s+/g, '').toLowerCase();

interface Options<T> {
  items: T[];
  pageSize: number;
  /** 지금 목록 주소 (분류가 있으면 분류까지) — 검색·페이지 이동이 이 주소에 ?q= &page= 를 붙임 */
  path: string;
  /** 검색에 쓸 글자 (기본: title) */
  text?: (item: T) => string;
}

/**
 * 목록 화면 공통 — 검색어·페이지를 주소(?q= &page=)에 담고, 보여 줄 목록은 주소에서 계산.
 * 시공사례·견적문의·설계문의·자료실이 같은 규칙으로 움직이게 한 곳에 모음.
 * (원본 데이터 → 검색 → 페이지 자르기, 모두 '파생 값'이라 state가 필요 없음)
 */
export function useListQuery<T>({ items, pageSize, path, text = (it) => (it as { title: string }).title }: Options<T>) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const topRef = useRef<HTMLDivElement>(null); // 페이지를 넘기면 목록 머리로 스크롤

  const q = (params.get('q') ?? '').trim();
  const list = q ? items.filter((it) => squash(text(it)).includes(squash(q))) : items;
  const pages = Math.max(1, Math.ceil(list.length / pageSize));
  const page = Math.min(Math.max(1, Number(params.get('page')) || 1), pages); // 범위 밖 번호는 가까운 끝으로
  const shown = list.slice((page - 1) * pageSize, page * pageSize);

  const go = (next: { q?: string; page?: number }) => {
    const sp = new URLSearchParams();
    const nq = next.q ?? q;
    if (nq) sp.set('q', nq);
    if (next.page && next.page > 1) sp.set('page', String(next.page));
    const qs = sp.toString();
    navigate({ pathname: path, search: qs ? `?${qs}` : '' }, { state: { keepScroll: true } });
  };

  return {
    q,
    page,
    pages,
    list,
    shown,
    topRef,
    search: (nq: string) => go({ q: nq, page: 1 }),
    goPage: (n: number) => {
      go({ page: n });
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    /** 상세로 갈 때 state.from에 넣어 '목록으로'가 보던 검색·페이지로 돌아오게 */
    here: `${path}${params.toString() ? `?${params.toString()}` : ''}`,
  };
}
