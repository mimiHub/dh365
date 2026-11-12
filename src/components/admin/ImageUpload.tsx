import { useEffect, useRef, useState, type DragEvent } from 'react';
import { Icon, cx } from '../ui';
import { useFieldControl } from './fieldContext';
import s from './ImageUpload.module.css';

interface Props {
  /** 폼으로 보낼 때 input name (FormData에 파일이 담김) */
  name?: string;
  /** 처음 보여 줄 이미지 주소 — 수정 화면에서 기존 배너 */
  defaultUrl?: string;
  /** 고른 파일을 부모가 따로 다룰 때 (직접 업로드 API 호출 등). 지우면 null */
  onChange?: (file: File | null) => void;
  /** 미리보기 비율 — 배너 '16/5', 썸네일 '4/3' 등 */
  ratio?: string;
  /** 받을 형식 — accept 속성 */
  accept?: string;
  /** 최대 용량(MB) — 넘으면 안내하고 받지 않음 */
  maxMB?: number;
  /** 미리보기 최대 폭(px) — 세로로 긴 비율(모바일 배너 5/6 등)이 너무 커지지 않게 */
  maxWidth?: number;
  /** 접근성 이름 — Field 안이면 label이 대신함 */
  label?: string;
  id?: string;
}

/**
 * 이미지 올리기 — 끌어다 놓기 / 눌러서 고르기, 미리보기, 바꾸기·지우기.
 * 미리보기는 URL.createObjectURL(파일) — 서버에 올리기 전에 브라우저 메모리의 파일을 바로 보여 줌.
 * (다 쓰면 revokeObjectURL로 메모리 해제)
 */
export function ImageUpload({ name, defaultUrl, onChange, ratio = '16 / 9', accept = 'image/png,image/jpeg,image/webp', maxMB = 5, maxWidth = 640, label = '이미지', id }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const field = useFieldControl({ id }); // Field 안이면 label·도움말과 연결
  const [url, setUrl] = useState<string | undefined>(defaultUrl);
  const [fileName, setFileName] = useState<string>();
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string>();

  // 만든 미리보기 주소는 바뀌거나 사라질 때 해제
  useEffect(() => () => {
    if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
  }, [url]);

  const take = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('이미지 파일만 올릴 수 있습니다.');
    if (file.size > maxMB * 1024 * 1024) return setError(`${maxMB}MB 이하 파일만 올릴 수 있습니다.`);
    setError(undefined);
    setUrl(URL.createObjectURL(file));
    setFileName(file.name);
    onChange?.(file);
  };

  // 끌어다 놓은 파일을 실제 input에도 넣어 둠 → 폼 전송(FormData)에 그대로 담김
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file && input.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      input.current.files = dt.files;
    }
    take(file);
  };

  const clear = () => {
    setUrl(undefined);
    setFileName(undefined);
    if (input.current) input.current.value = '';
    onChange?.(null);
  };

  return (
    <div className={s.wrap} style={{ maxWidth }}>
      <div
        className={cx(s.drop, drag && s.drag, url && s.filled)}
        style={{ aspectRatio: ratio }}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
      >
        {url ? (
          <img src={url} alt={`${label} 미리보기`} className={s.preview} />
        ) : (
          <button type="button" className={s.empty} onClick={() => input.current?.click()}>
            <Icon name="upload" size={24} />
            <span className={s.emptyTitle}>이미지를 끌어다 놓거나 눌러서 선택</span>
            <span className={s.emptyHint}>PNG·JPG·WEBP, {maxMB}MB 이하</span>
          </button>
        )}
        <input ref={input} {...field} name={name} type="file" accept={accept} className="sr-only" tabIndex={-1} aria-label={field.id === id ? label : undefined} onChange={(e) => take(e.target.files?.[0])} />
      </div>

      {url && (
        <div className={s.bar}>
          <span className={s.name}>
            <Icon name="image" size={16} />
            {fileName ?? '등록된 이미지'}
          </span>
          <span className={s.tools}>
            <button type="button" onClick={() => input.current?.click()}>바꾸기</button>
            <button type="button" onClick={clear} className={s.remove}>지우기</button>
          </span>
        </div>
      )}
      {error && (
        <p className={s.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
