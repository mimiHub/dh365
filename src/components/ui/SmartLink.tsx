import type { AnchorHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/**
 * 데이터(site.ts)에는 href를 문자열로만 적어 두고, 렌더할 때 종류에 맞는 태그를 고릅니다.
 * - '/…'  : 사이트 내부 페이지 → 라우터 <Link> (새로고침 없이 이동)
 * - '/#id': 메인의 섹션 → <Link>로 메인에 간 뒤 App의 스크롤 처리가 해당 id로 이동
 * - 그 밖('#id', 'tel:', 외부 URL) : 일반 <a>
 */
export function SmartLink({ href, ...rest }: Props) {
  if (href.startsWith('/')) {
    const [pathname, hash] = href.split('#');
    return <Link to={{ pathname: pathname || '/', hash: hash ? `#${hash}` : '' }} {...rest} />;
  }
  return <a href={href} {...rest} />;
}
