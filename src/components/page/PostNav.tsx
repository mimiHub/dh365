import { Link } from '@/lib/router';
import { Icon, cx } from '../ui';
import s from './PostNav.module.css';

export interface PostLink {
  to: string;
  title: string;
}

interface Props {
  /** 목록에서 위 글(더 최근) */
  newer?: PostLink;
  /** 목록에서 아래 글(더 이전) */
  older?: PostLink;
  /** 상세의 '목록으로'가 돌아갈 주소 — 옮겨 다녀도 처음 보던 목록 페이지를 기억 */
  from: string;
  /** nav 이름 (스크린리더) — 예: '이전·다음 공지' */
  label?: string;
}

/**
 * 이전·다음 글 — 목록으로 돌아가지 않고 이어서 보기. 자료실·공지사항 상세 공용.
 * 목록이 최신순이라 '다음 글' = 목록에서 위, '이전 글' = 아래
 */
export function PostNav({ newer, older, from, label = '이전·다음 글' }: Props) {
  return (
    <nav className={s.nav} aria-label={label}>
      <Row label="다음 글" dir="up" link={newer} from={from} />
      <Row label="이전 글" dir="down" link={older} from={from} />
    </nav>
  );
}

function Row({ label, dir, link, from }: { label: string; dir: 'up' | 'down'; link?: PostLink; from: string }) {
  const head = (
    <span className={s.label}>
      <span className={s.arrow} style={{ transform: `rotate(${dir === 'up' ? -90 : 90}deg)` }}>
        <Icon name="right" size={14} />
      </span>
      {label}
    </span>
  );
  // 없는 쪽은 링크가 아니라 글자로 (누를 수 없는 것을 링크로 만들지 않음)
  if (!link) {
    return (
      <div className={cx(s.row, s.none)}>
        {head}
        <span className={s.title}>{label}이 없습니다.</span>
      </div>
    );
  }
  return (
    // replace: 이전·다음으로 여러 번 옮겨 다녀도 뒤로가기 한 번이면 목록으로
    <Link to={link.to} replace state={{ from }} className={s.row}>
      {head}
      <span className={s.title}>{link.title}</span>
    </Link>
  );
}
