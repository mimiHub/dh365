import { COMPANY } from '../../data/site';
import { ORGANIZATION } from '../../data/about';
import { cx } from '../../components/ui';
import { useReveal } from '../../hooks/useReveal';
import s from './About.module.css';

const addressOf = (name: string) => COMPANY.offices.find((o) => o.label === name)?.address;

/** 회사소개 > 조직도 — 대표이사 아래 사업장 3곳 (부서 조직도를 받으면 사업장 카드 안 roles를 부서로) */
export function Organization() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className={cx('container', s.narrow, s.section, s.first)} aria-labelledby="org-title">
      <p className={cx('dh-eyebrow', 'reveal')}>ORGANIZATION</p>
      <h2 id="org-title" className={cx(s.h2, 'reveal')}>조직도</h2>

      {/* 나무 구조 = 목록 안의 목록 (스크린리더가 '대표이사 아래 3개 항목'으로 읽음)
          등장 순서: 대표 카드 → 연결선이 그려짐 → 사업장 카드 차례로 (tree가 보이면 CSS 지연으로 이어짐) */}
      <ul className={cx(s.tree, 'reveal')}>
        <li>
          <div className={s.head}>
            <span className={s.headRole}>{ORGANIZATION.head.role}</span>
            <strong className={s.headName}>{ORGANIZATION.head.name}</strong>
          </div>
          {/* --n: 칸 수 → 가로선 길이 계산 / li(.unit)는 연결선 자리, 안쪽 .unitCard가 카드 — 둘을 나눠야 선과 카드가 따로 등장 */}
          <ul className={s.units} style={{ ['--n' as string]: ORGANIZATION.units.length }}>
            {ORGANIZATION.units.map((u, i) => (
              <li key={u.name} className={s.unit} style={{ ['--i' as string]: i }}>
                <div className={s.unitCard}>
                  <p className={s.unitPlace}>{u.place}</p>
                  <h3 className={s.unitName}>{u.name}</h3>
                  <ul className={s.roles}>
                    {u.roles.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                  <p className={s.unitAddr}>{addressOf(u.name)}</p>
                </div>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </section>
  );
}
