import { cx } from './cx';

/** 이미지 자리. src가 없으면 셔터 슬랫 패턴 플레이스홀더 + 라벨 */
export function Media({ src, alt = '', label, className }: { src?: string; alt?: string; label?: string; className?: string }) {
  return (
    <div className={cx('dh-media', className)}>
      {src ? <img src={src} alt={alt} loading="lazy" /> : label ? <span className="dh-media-label">{label}</span> : null}
    </div>
  );
}
