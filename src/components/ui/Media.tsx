import { cx } from './cx';

/**
 * 이미지 자리. src가 없으면 셔터 슬랫 패턴 플레이스홀더 + 라벨
 * position: object-position — 비율이 다른 칸에 잘려 들어갈 때 사진의 어느 쪽을 남길지 (예: '18% 50%')
 */
export function Media({ src, alt = '', label, position, className }: { src?: string; alt?: string; label?: string; position?: string; className?: string }) {
  return (
    <div className={cx('dh-media', className)}>
      {src ? <img src={src} alt={alt} loading="lazy" style={position ? { objectPosition: position } : undefined} /> : label ? <span className="dh-media-label">{label}</span> : null}
    </div>
  );
}
