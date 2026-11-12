import { useState, type MouseEvent } from 'react';
import { Icon } from '../../components/ui';
import s from './Catalog.module.css';

/** 코드 + 복사 버튼. 클립보드 API는 https·localhost에서만 동작 → 실패하면 선택 상태로 남겨 직접 복사하게 */
export function CodeBlock({ code, label = '코드' }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      const pre = e.currentTarget.parentElement?.querySelector('code');
      if (pre) window.getSelection()?.selectAllChildren(pre);
    }
  };

  return (
    <div className={s.code}>
      <div className={s.codeHead}>
        <span>{label}</span>
        <button type="button" className={s.copy} onClick={copy}>
          <Icon name={copied ? 'check' : 'copy'} size={14} />
          <span aria-live="polite">{copied ? '복사됨' : '복사'}</span>
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
