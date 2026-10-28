import { Hero } from '../sections/Hero';
import { About } from '../sections/About';
import { Stats } from '../sections/Stats';
import { Products } from '../sections/Products';
import { Cases } from '../sections/Cases';
import { News } from '../sections/News';
import { Contact } from '../sections/Contact';

/** 메인 — 섹션 순서는 코아드 구성(비주얼 → 소개·강점 → 회사 밴드 → 제품 → 소식 → 상담)을 대한방화 메뉴에 맞춘 것 */
export function Home() {
  return (
    <>
      <Hero />
      <About />
      <Stats />
      <Products />
      <Cases />
      <News />
      <Contact />
    </>
  );
}
