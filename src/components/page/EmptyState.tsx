import { Link } from '@/lib/router';
import s from './EmptyState.module.css';

/** 빈 목록 — 검색 결과가 없으면 '검색어 지우기'까지 */
export function EmptyState({ noun, q, resetTo }: { noun: string; q?: string; resetTo: string }) {
  return (
    <div className={s.empty}>
      <p>{q ? <>‘{q}’에 맞는 {noun}{josa(noun)} 없습니다.</> : <>등록된 {noun}{josa(noun)} 없습니다.</>}</p>
      {q && (
        <Link to={resetTo} replace state={{ keepScroll: true }} className={s.reset}>
          검색어 지우기
        </Link>
      )}
    </div>
  );
}

// 받침 있으면 '이', 없으면 '가' (시공사례가 / 자료가 / 동영상이)
const josa = (word: string) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0 ? '이' : '가';
};
