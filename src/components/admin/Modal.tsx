import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Button, Icon, cx } from '../ui';
import s from './Modal.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** 아래 버튼 줄 */
  footer?: ReactNode;
  /** 폭 — sm 420 / md 640 / lg 880 */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 모달 — 브라우저 기본 <dialog>의 showModal()을 씀.
 * 직접 만들면 챙겨야 하는 것(뒤 화면 막기, 포커스 가두기, Esc로 닫기, 닫으면 원래 버튼으로 포커스 복귀)을
 * 브라우저가 해 줌. 열림 여부는 부모 state(open)가 결정(제어 컴포넌트)
 */
export function Modal({ open, onClose, title, children, footer, size = 'md' }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cx(s.dialog, s[size])}
      aria-labelledby={titleId}
      // Esc·폼 method=dialog 등으로 브라우저가 닫았을 때도 부모 state를 맞춤
      onClose={onClose}
      // 바깥(어두운 막) 클릭으로 닫기 — 클릭 대상이 dialog 자신이면 막 영역
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={s.box}>
        <div className={s.head}>
          <h2 id={titleId} className={s.title}>{title}</h2>
          <button type="button" className={s.close} aria-label="닫기" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className={s.body}>{children}</div>
        {footer && <div className={s.foot}>{footer}</div>}
      </div>
    </dialog>
  );
}

interface ConfirmProps {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  /** danger: 삭제처럼 되돌릴 수 없는 일 — 확인 버튼이 빨강 */
  tone?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

/** 확인 창 — '정말 삭제할까요?' 같은 한 번 더 묻기. Modal을 조립한 것 */
export function ConfirmDialog({ open, title, message, confirmLabel = '확인', tone = 'default', onConfirm, onCancel }: ConfirmProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onCancel}>취소</Button>
          <Button variant={tone === 'danger' ? 'danger' : 'solid'} size="sm" onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      <p className={s.message}>{message}</p>
    </Modal>
  );
}
