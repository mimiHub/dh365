import logo from '../../assets/logo.png';
import { COMPANY, FAMILY_SITES, NAV } from '../../data/site';
import s from './Footer.module.css';

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className="container">
        <div className={s.top}>
          <img className={s.logo} src={logo} alt={COMPANY.name} />
          <nav className={s.sitemap} aria-label="사이트맵">
            {NAV.map((n) => (
              <div key={n.label}>
                <a href={n.href} className={s.d1}>{n.label}</a>
                <ul>
                  {n.children?.map((c) => <li key={c.label}><a href={c.href}>{c.label}</a></li>)}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={s.bottom}>
          <address className={s.info}>
            <p><strong>{COMPANY.name}</strong> <span>대표 {COMPANY.ceo}</span> <span>사업자등록번호 {COMPANY.bizNo}</span></p>
            {COMPANY.offices.map((o) => (
              <p key={o.label}><span className={s.label}>{o.label}</span> {o.address}</p>
            ))}
            <p><span>TEL {COMPANY.tel}</span> <span>C.P {COMPANY.mobile}</span> <span>E-mail {COMPANY.email}</span></p>
          </address>
          <div className={s.side}>
            <ul className={s.policy}>
              <li><a href="#">이용약관</a></li>
              <li><a href="#"><strong>개인정보처리방침</strong></a></li>
              <li><a href="#">이메일무단수집거부</a></li>
            </ul>
            <ul className={s.family} aria-label="관련 사이트">
              {FAMILY_SITES.map((f) => (
                <li key={f.href}><a href={f.href} target="_blank" rel="noopener noreferrer">{f.label}<span className="sr-only">(새 창)</span></a></li>
              ))}
            </ul>
          </div>
        </div>
        <p className={s.copy}>Copyright © {COMPANY.name}. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
