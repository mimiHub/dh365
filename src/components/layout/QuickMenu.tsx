import { COMPANY } from '../../data/site';
import { useScrolled } from '../../hooks/useScrolled';
import { useStopAtFooter } from '../../hooks/useStopAtFooter';
import { cx } from '../ui';
import { ChatWidget } from './ChatWidget';
import s from './QuickMenu.module.css';

/**
 * 우측 고정 도크 — [퀵메뉴 박스] 아래에 [채팅상담]을 세로로 묶음.
 * 두 요소를 따로 fixed로 띄우면 서로 위치를 계산해 맞춰야 하지만(화면 높이마다 어긋남),
 * 한 컨테이너 안에 flex로 쌓으면 간격이 항상 일정합니다.
 * 퀵메뉴 박스는 히어로를 지나면 등장, 채팅상담은 항상 보임.
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
      <ChatWidget />
    </div>
  );
}
