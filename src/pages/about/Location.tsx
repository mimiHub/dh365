import { useState } from 'react';
import { COMPANY } from '../../data/site';
import { Icon, cx } from '../../components/ui';
import { InfoList } from '../../components/page';
import { useReveal } from '../../hooks/useReveal';
import s from './About.module.css';

/**
 * 구글 지도 — 퍼가기(embed) 주소. ?q=주소&output=embed 방식은 API 키 없이 동작
 * (키가 필요한 공식 Maps Embed API로 바꾸려면 src만 https://www.google.com/maps/embed/v1/place?key=…&q=… 로)
 */
const mapEmbed = (q: string) => `https://maps.google.com/maps?q=${encodeURIComponent(q)}&hl=ko&z=16&output=embed`;
const mapView = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const mapRoute = (q: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;

/** 회사소개 > 오시는길 — 사업장 카드를 고르면 왼쪽 구글 지도가 그 위치로 */
export function Location() {
  const [sel, setSel] = useState(0);
  const ref = useReveal<HTMLElement>();
  const office = COMPANY.offices[sel];

  return (
    <section ref={ref} className={cx('container', s.narrow, s.section, s.first)} aria-labelledby="loc-title">
      <p className={cx('dh-eyebrow', 'reveal')}>LOCATION</p>
      <h2 id="loc-title" className={cx(s.h2, 'reveal')}>오시는길</h2>

      <div className={s.location}>
        <div className={cx(s.map, s.fromLeft, 'reveal')}>
          {/* key: 사업장을 바꾸면 iframe을 새로 만들어 확실히 새 위치를 불러옴. title = 스크린리더가 읽는 지도 이름 */}
          <iframe key={office.label} src={mapEmbed(office.mapQuery)} title={`${office.label} 위치 — 구글 지도`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        </div>

        <ul className={s.offices}>
          {COMPANY.offices.map((o, i) => (
            <li
              key={o.label}
              className={cx(s.office, i === 0 && s.officeMain, i === sel && s.officeOn, s.fromRight, 'reveal')}
              style={{ ['--reveal-delay' as string]: `${120 + i * 110}ms` }}
            >
              {/* 카드 안에 링크가 있어서 카드 전체를 버튼으로 만들 수 없음(버튼 안에 링크 금지) → 이름·주소 부분만 버튼 */}
              <button type="button" className={s.officePick} aria-pressed={i === sel} onClick={() => setSel(i)}>
                <span className={s.officeName}>
                  {o.label}
                  {i === 0 && <span className={s.officeTag}>HEAD OFFICE</span>}
                  <span className={s.officeOnMark} aria-hidden="true">
                    <Icon name="check" size={14} strokeWidth={2.4} />
                    지도 보는 중
                  </span>
                </span>
                <span className={s.officeAddr}>{o.address}</span>
              </button>
              <p className={s.mapLinks}>
                <a href={mapView(o.mapQuery)} target="_blank" rel="noopener noreferrer">
                  구글 지도에서 보기<span className="sr-only"> — {o.label} (새 창)</span>
                  <Icon name="right" size={14} />
                </a>
                <a href={mapRoute(o.mapQuery)} target="_blank" rel="noopener noreferrer">
                  길찾기<span className="sr-only"> — {o.label} (새 창)</span>
                  <Icon name="right" size={14} />
                </a>
              </p>
            </li>
          ))}
        </ul>
      </div>

      <h3 className={s.h3}>연락처</h3>
      <InfoList
        cols={2}
        rows={[
          { label: '대표전화', value: <a href={`tel:${COMPANY.tel}`}>{COMPANY.tel}</a> },
          { label: '휴대전화', value: <a href={`tel:${COMPANY.mobile}`}>{COMPANY.mobile}</a> },
          { label: '이메일', value: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> },
          { label: '사업자번호', value: COMPANY.bizNo },
        ]}
      />
    </section>
  );
}
