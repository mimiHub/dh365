'use client';

import { Hero } from '../sections/Hero';
import { About } from '../sections/About';
import { Stats } from '../sections/Stats';
import { Products } from '../sections/Products';
import { Cases } from '../sections/Cases';
import { News } from '../sections/News';
import { Contact } from '../sections/Contact';

/** 메인 — 비주얼 → 제품 → 소개·강점 → 회사 밴드 → 시공사례 → 소식 → 상담
 *  방문자가 가장 먼저 찾는 '어떤 제품이 있나'를 비주얼 바로 다음에 둠 (모바일 4번째 화면 → 2번째 화면) */
export function Home() {
  return (
    <>
      <Hero />
      <Products />
      <About />
      <Stats />
      <Cases />
      <News />
      <Contact />
    </>
  );
}
