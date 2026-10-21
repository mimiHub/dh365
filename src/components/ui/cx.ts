/** className 조합 헬퍼: cx('a', cond && 'b') → 'a b' */
export const cx = (...v: Array<string | false | null | undefined>) => v.filter(Boolean).join(' ');
