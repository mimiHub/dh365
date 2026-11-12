import { Greeting } from './Greeting';
import { Organization } from './Organization';
import { Location } from './Location';

/**
 * 회사소개 세 화면 — 주소 /about/:section. 분류 패널과 본문이 같은 목록을 씀.
 * 컴포넌트 파일(AboutPage.tsx)과 따로 둔 이유: 한 파일이 컴포넌트와 '일반 값'을 같이 내보내면
 * Vite의 Fast Refresh가 그 파일을 갈아 끼우지 못하고 페이지 전체를 새로고침함 ("export is incompatible")
 */
export const ABOUT_SECTIONS = [
  { key: 'greeting', name: '인사말', to: '/about/greeting', Body: Greeting },
  { key: 'organization', name: '조직도', to: '/about/organization', Body: Organization },
  { key: 'location', name: '오시는길', to: '/about/location', Body: Location },
] as const;
