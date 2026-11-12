import { COMPANY } from '../../data/site';
import { ORGANIZATION } from '../../data/about';
import { cx } from '../../components/ui';
import s from './About.module.css';

const addressOf = (name: string) => COMPANY.offices.find((o) => o.label === name)?.address;

/** 회사소개 > 조직도 — 대표이사 아래 사업장 3곳 (부서 조직도를 받으면 사업장 카드 안 roles를 부서로) */
export function Organization() {
  return (
    <section className={cx('container', s.narrow, s.section, s.first)} aria-labelledby="org-title">
      <p className="dh-eyebrow">ORGANIZATION</p>
      <h2 id="org-title" className={s.h2}>조직도</h2>

      {/* 나무 구조 = 목록 안의 목록 (스크린리더가 '대표이사 아래 3개 항목'으로 읽음) */}
      <ul className={s.tree}>
        <li>
          <div className={s.head}>
            <span className={s.headRole}>{ORGANIZATION.head.role}</span>
            <strong className={s.headName}>{ORGANIZATION.head.name}</strong>
          </div>
          <ul className={s.units}>
            {ORGANIZATION.units.map((u) => (
              <li key={u.name} className={s.unit}>
                <p className={s.unitPlace}>{u.place}</p>
                <h3 className={s.unitName}>{u.name}</h3>
                <ul className={s.roles}>
                  {u.roles.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                <p className={s.unitAddr}>{addressOf(u.name)}</p>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </section>
  );
}
