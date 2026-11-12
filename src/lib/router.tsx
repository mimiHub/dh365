'use client';

import { forwardRef, useEffect, type AnchorHTMLAttributes } from 'react';
import NextLink from 'next/link';
import {
  useParams as useNextParams,
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from 'next/navigation';

/**
 * react-router-dom → Next.js(App Router) 호환 층.
 * 화면 코드는 react-router 시절의 API(Link·Navigate·useLocation·useNavigate·useParams·useSearchParams)를 그대로 쓰고,
 * 실제 이동은 Next 라우터가 함. Next 라우터에는 없는 location.state만 여기서 흉내 냄.
 *
 * - state: 이동 직전에 '어느 주소로 가며 어떤 state를 들고 갔는지' 기억 → 그 주소에 도착한 화면이 useLocation().state로 읽음
 *   (react-router와 달리 새로고침·뒤로가기로 돌아오면 비어 있음 — 쓰는 곳은 모두 없을 때 기본값이 있음)
 * - 스크롤: Next의 자동 스크롤은 끄고(scroll: false) SiteShell이 직접 처리 (keepScroll·#해시 규칙 유지)
 */

type To = string | { pathname?: string; search?: string; hash?: string };
interface NavigateOptions {
  replace?: boolean;
  state?: unknown;
}

const toHref = (to: To) => (typeof to === 'string' ? to : `${to.pathname ?? ''}${to.search ?? ''}${to.hash ?? ''}`);
const pathOf = (href: string) => href.split(/[?#]/)[0] || '/';

// 번들러가 이 파일을 여러 조각(chunk)에 나눠 넣어도 같은 값을 보도록 전역(window)에 둠
type Pending = { path: string; state: unknown } | null;
const store = globalThis as typeof globalThis & { __dhNavState?: Pending };
const remember = (href: string, state: unknown) => {
  store.__dhNavState = state === undefined ? null : { path: pathOf(href), state };
};

/** 지금 주소로 오면서 들고 온 state (없으면 null) */
export function readState(pathname: string): unknown {
  const pending = store.__dhNavState;
  return pending && pending.path === pathname ? pending.state : null;
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: To; replace?: boolean; state?: unknown };

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ to, replace, state, onClick, ...rest }, ref) {
  const href = toHref(to);
  return (
    <NextLink
      ref={ref}
      href={href}
      replace={replace}
      // '/#about' 같은 해시 링크는 Next가 그 섹션으로 스크롤 (같은 페이지 안 이동 포함)
      scroll={href.includes('#')}
      onClick={(e) => {
        remember(href, state);
        onClick?.(e);
      }}
      {...rest}
    />
  );
});

export function useNavigate() {
  const router = useRouter();
  return (to: To, opts: NavigateOptions = {}) => {
    const href = toHref(to);
    remember(href, opts.state);
    if (opts.replace) router.replace(href, { scroll: false });
    else router.push(href, { scroll: false });
  };
}

/** 렌더 중 다른 주소로 보냄 (잘못된 분류·글 번호 등) */
export function Navigate({ to, replace }: { to: To; replace?: boolean }) {
  const navigate = useNavigate();
  const href = toHref(to);
  useEffect(() => {
    navigate(href, { replace });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [href, replace]);
  return null;
}

export function useLocation() {
  const pathname = usePathname();
  return { pathname, state: readState(pathname) };
}

/** 주소의 :param — 없으면 undefined (react-router와 같은 모양으로 문자열만) */
export function useParams(): Record<string, string | undefined> {
  const params = useNextParams() ?? {};
  const out: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(params)) out[k] = Array.isArray(v) ? v[0] : v ? decodeURIComponent(v) : undefined;
  return out;
}

export function useSearchParams() {
  return [useNextSearchParams()] as const;
}
