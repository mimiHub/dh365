import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { QuickMenu } from './components/layout/QuickMenu';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Stats } from './sections/Stats';
import { Products } from './sections/Products';
import { Cases } from './sections/Cases';
import { News } from './sections/News';
import { Contact } from './sections/Contact';

/** 메인 — 섹션 순서는 코아드 구성(비주얼 → 소개·강점 → 회사 밴드 → 제품 → 소식 → 상담)을 대한방화 메뉴에 맞춘 것 */
export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">본문 바로가기</a>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Stats />
        <Products />
        <Cases />
        <News />
        <Contact />
      </main>
      <Footer />
      <QuickMenu />
    </>
  );
}
