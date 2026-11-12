import { Navigate, useParams } from 'react-router-dom';
import buildingsImg from '../../assets/about-buildings.jpg';
import { CategoryNav, SubHero } from '../../components/page';
import { Greeting } from './Greeting';
import { Organization } from './Organization';
import { Location } from './Location';
import s from './About.module.css';

/** 회사소개 세 화면 — 주소 /about/:section. 메뉴(site.ts NAV)와 분류 패널이 같은 목록을 씀 */
export const ABOUT_SECTIONS = [
  { key: 'greeting', name: '인사말', to: '/about/greeting', Body: Greeting },
  { key: 'organization', name: '조직도', to: '/about/organization', Body: Organization },
  { key: 'location', name: '오시는길', to: '/about/location', Body: Location },
] as const;

/**
 * 회사소개 — /about/:section (없거나 모르는 값이면 인사말로)
 * 인사말·조직도·오시는길은 히어로·분류 패널이 같고 본문만 다름 → 본문만 갈아 끼움
 */
export function AboutPage() {
  const { section } = useParams();
  const cur = ABOUT_SECTIONS.find((it) => it.key === section);
  if (!cur) return <Navigate to={ABOUT_SECTIONS[0].to} replace />;
  const { Body } = cur;

  return (
    <>
      <SubHero
        en="About us"
        title="회사소개"
        desc="방화셔터 설계·시공 전문기업, (주)대한방화입니다."
        image={buildingsImg}
        position="50% 72%"
        sub={cur.name}
        withNav
      />
      <div className={s.page}>
        <CategoryNav items={ABOUT_SECTIONS.map(({ key, name, to }) => ({ key, name, to }))} current={cur.key} label="회사소개 메뉴" id="about-nav" />
        {/* key: 화면을 바꾸면 등장 모션을 다시 */}
        <div key={cur.key} className={s.body}>
          <Body />
        </div>
      </div>
    </>
  );
}
