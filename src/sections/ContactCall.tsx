import { COMPANY } from '../data/site';
import { cx } from '../components/ui';
import s from './ContactCall.module.css';

/**
 * 견적상담 전화 블록 — CONTACT / 견적상담 / 큰 대표번호 / C.P·E-mail
 * 메인·제품소개 하단 상담 섹션(Contact)과 견적문의 글쓰기에서 같이 씀 → 한 곳만 고치면 모두 바뀜
 */
export function ContactCall({ titleId, className }: { titleId: string; className?: string }) {
  return (
    <div className={cx(s.call, className)}>
      <p className="dh-eyebrow">CONTACT</p>
      <h2 id={titleId} className={s.title}>견적상담</h2>
      <a href={`tel:${COMPANY.tel}`} className={s.tel}>{COMPANY.tel}</a>
      <dl className={s.meta}>
        <div><dt>C.P</dt><dd><a href={`tel:${COMPANY.mobile}`}>{COMPANY.mobile}</a></dd></div>
        <div><dt>E-mail</dt><dd><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></dd></div>
      </dl>
    </div>
  );
}
