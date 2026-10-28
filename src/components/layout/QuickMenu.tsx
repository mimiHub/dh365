import { COMPANY } from '../../data/site';
import { useScrolled } from '../../hooks/useScrolled';
import { useStopAtFooter } from '../../hooks/useStopAtFooter';
import { cx } from '../ui';
import s from './QuickMenu.module.css';

/**
 * 우측 고정 도크 — 퀵메뉴 박스(견적상담·견적문의·TOP). 히어로를 지나면 등장.
 * 페이지 맨 아래에서는 푸터가 화면에 들어온 만큼 도크를 같이 들어 올려 푸터 내용을 가리지 않게 함.
 */
export function QuickMenu() {
  const show = useScrolled(400);
  const lift = useStopAtFooter();
  return (
    <div className={s.dock} style={{ ['--dock-lift' as string]: `${lift}px` }}>
      <aside className={cx(s.quick, show && s.show)} aria-label="빠른 메뉴" inert={!show}>
        <a href={`tel:${COMPANY.tel}`} className={s.call}>
          <span className={s.callLabel}>견적상담</span>
          <span className={s.callNum}>{COMPANY.tel.split('-').slice(0, 1)}<br />{COMPANY.tel.split('-').slice(1).join('-')}</span>
        </a>
        <a href="#contact" className={s.btn}>견적문의</a>
        <a href="#top" className={cx(s.btn, s.top)}>TOP</a>
      </aside>
    </div>
  );
}
