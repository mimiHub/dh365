import { cx } from './cx';
import s from './SliderNav.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

interface Props {
  current: number; // 0부터
  total: number;
  onPrev: () => void;
  onNext: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  /** 화살표가 조작하는 영역의 id (aria-controls) */
  controls?: string;
  /** 버튼 이름 — 무엇을 넘기는지 (예: '제품', '사진') */
  itemLabel: string;
  className?: string;
}

/**
 * 슬라이더 컨트롤 — [01 / 06] [‹] [›]
 * 랜딩 제품 슬라이더와 제품 상세 갤러리가 같이 씀 → 디자인·동작을 한 곳에서 관리.
 * 끝에 닿으면 버튼을 흐리게 비활성(눌러도 안 움직이는 버튼임을 보여줌)
 */
export function SliderNav({ current, total, onPrev, onNext, prevDisabled, nextDisabled, controls, itemLabel, className }: Props) {
  return (
    <div className={cx(s.nav, className)}>
      {/* 스크린리더에는 숫자 변화를 읽히지 않음 — 내용(카드·사진) 자체로 탐색됨 */}
      <p className={s.count} aria-hidden="true">
        <strong>{pad(current + 1)}</strong> / {pad(total)}
      </p>
      <button type="button" className={s.arrow} onClick={onPrev} disabled={prevDisabled} aria-label={`이전 ${itemLabel}`} aria-controls={controls}>
        <Chevron dir="left" />
      </button>
      <button type="button" className={s.arrow} onClick={onNext} disabled={nextDisabled} aria-label={`다음 ${itemLabel}`} aria-controls={controls}>
        <Chevron dir="right" />
      </button>
    </div>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d={dir === 'left' ? 'M12.5 4.5 7 10l5.5 5.5' : 'M7.5 4.5 13 10l-5.5 5.5'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
