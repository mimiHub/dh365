import { SmartLink, cx } from '../components/ui';
import { useReveal } from '../hooks/useReveal';
import { ContactCall } from './ContactCall';
import s from './Contact.module.css';

const CARDS = [
  { en: 'ESTIMATE', title: '견적문의', desc: '현장 규격과 용도를 남겨주시면 견적을 안내드립니다.', href: '/quote/write' },
  // 설계문의 — 문의 접수는 견적문의 폼 하나로 받으므로 같은 작성 화면으로 연결
  { en: 'DESIGN', title: '설계문의', desc: '인정 규격 검토와 설계 도면 상담을 도와드립니다.', href: '/quote/write' },
  { en: 'LOCATION', title: '오시는길', desc: '과천 본사 · 부산지사 · 광주지사', href: '#contact' },
];

/** 상담 CTA — 큰 전화번호 + 문의 카드 3개(견적문의·설계문의·오시는길) */
export function Contact() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="contact" className={cx('section', s.contact)} ref={ref} aria-labelledby="contact-title">
      <div className={cx('container', s.inner)}>
        <ContactCall titleId="contact-title" className="reveal" />
        <ul className={s.cards}>
          {CARDS.map((c, i) => (
            <li key={c.title} className="reveal" style={{ ['--reveal-delay' as string]: `${i * 80}ms` }}>
              <SmartLink href={c.href} className={s.card}>
                <span className={s.en}>{c.en}</span>
                <strong className={s.cTitle}>{c.title}</strong>
                <span className={s.desc}>{c.desc}</span>
                <span className={s.go} aria-hidden="true">→</span>
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
