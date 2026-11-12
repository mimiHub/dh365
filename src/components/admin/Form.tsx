import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cx } from '../ui';
import { FieldContext, useFieldControl } from './fieldContext';
import s from './Form.module.css';

/* ─────────────────────────────────────────────
 * 폼 조각 — <Field>가 label·도움말·오류를 그리고, 안에 넣은 입력칸에
 * id / aria-describedby / aria-invalid / required를 Context로 자동 연결.
 *
 *   <Field label="배너 제목" required help="40자 이내" error={errors.title}>
 *     <TextInput name="title" maxLength={40} />
 *   </Field>
 *
 * → 쓰는 쪽은 id를 짝맞출 필요가 없고, 스크린리더는 '배너 제목, 필수, 40자 이내'로 읽음
 * ───────────────────────────────────────────── */

interface FieldProps {
  label: string;
  children: ReactNode;
  required?: boolean;
  /** 입력 아래 회색 안내 */
  help?: ReactNode;
  /** 있으면 빨간 오류 문구 + 입력칸 빨간 테두리 */
  error?: string;
  /**
   * - stack : 라벨 위, 입력 아래 (기본 · 필터·좁은 칸)
   * - row   : 라벨 왼쪽 140px, 입력 오른쪽 (등록·수정 폼)
   */
  layout?: 'stack' | 'row';
  /** 라벨이 가리킬 입력이 여러 개일 때(라디오·체크박스 묶음) — fieldset/legend로 */
  group?: boolean;
  className?: string;
}

export function Field({ label, children, required = false, help, error, layout = 'stack', group, className }: FieldProps) {
  const id = useId();
  const helpId = help ? `${id}-help` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const describedBy = [errId, helpId].filter(Boolean).join(' ') || undefined;
  const Wrap = group ? 'fieldset' : 'div';

  return (
    <FieldContext.Provider value={{ id, describedBy, invalid: !!error, required }}>
      <Wrap className={cx(s.field, s[layout], className)} aria-describedby={group ? describedBy : undefined}>
        {group ? (
          <>
            {/* legend는 fieldset의 grid 배치에 참여하지 않아(브라우저 특수 렌더링) row 배치가 깨짐
                → 이름은 legend로 스크린리더에 주고, 눈에 보이는 라벨은 grid 칸에 따로 */}
            <legend className="sr-only">
              {label}
              {required && ' (필수)'}
            </legend>
            <span className={s.label} aria-hidden="true">
              {label}
              {required && <span className={s.req}> *</span>}
            </span>
          </>
        ) : (
          <label className={s.label} htmlFor={id}>
            {label}
            {required && (
              <span className={s.req} aria-hidden="true"> *</span>
            )}
          </label>
        )}
        <div className={s.control}>
          {children}
          {error && (
            <p id={errId} className={s.error}>
              {error}
            </p>
          )}
          {help && (
            <p id={helpId} className={s.help}>
              {help}
            </p>
          )}
        </div>
      </Wrap>
    </FieldContext.Provider>
  );
}

export function TextInput({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  const a = useFieldControl(rest);
  return <input {...rest} {...a} className={cx(s.input, className)} />;
}

export function Textarea({ className, rows = 6, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const a = useFieldControl(rest);
  return <textarea rows={rows} {...rest} {...a} className={cx(s.input, s.textarea, className)} />;
}

export interface Option {
  value: string;
  label: string;
}

export function Select({ options, placeholder, className, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { options: Option[]; placeholder?: string }) {
  const a = useFieldControl(rest);
  return (
    <select {...rest} {...a} className={cx(s.input, s.select, className)}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** 체크박스 하나 — 글자까지 눌리도록 label로 감쌈 */
export function Checkbox({ label, className, ...rest }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: ReactNode }) {
  return (
    <label className={cx(s.check, className)}>
      <input type="checkbox" {...rest} />
      <span>{label}</span>
    </label>
  );
}

/** 라디오 묶음 — <Field group>안에 넣으면 legend가 묶음 이름이 됨 */
export function RadioGroup({ name, options, value, defaultValue, onChange, inline = true }: { name: string; options: Option[]; value?: string; defaultValue?: string; onChange?: (v: string) => void; inline?: boolean }) {
  return (
    <div className={cx(s.choices, inline && s.inline)}>
      {options.map((o) => (
        <label key={o.value} className={s.check}>
          <input
            type="radio"
            name={name}
            value={o.value}
            {...(value !== undefined ? { checked: value === o.value } : { defaultChecked: defaultValue === o.value })}
            onChange={() => onChange?.(o.value)}
          />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}

/**
 * 켜고 끄기 — 노출 여부처럼 '바로 적용되는' 설정. role="switch"라 스크린리더가 '켜짐/꺼짐'으로 읽음
 * (저장 버튼을 눌러야 적용되는 값이면 Checkbox가 맞음)
 */
export function Switch({ checked, onChange, label, hideLabel, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; hideLabel?: boolean; disabled?: boolean }) {
  return (
    <button type="button" role="switch" aria-checked={checked} className={s.switch} onClick={() => onChange(!checked)} disabled={disabled}>
      <span className={s.track} aria-hidden="true">
        <span className={s.thumb} />
      </span>
      <span className={cx(hideLabel && 'sr-only')}>{label}</span>
    </button>
  );
}

/** 폼 아래 버튼 줄 — [취소] [저장] 오른쪽 정렬 */
export function FormActions({ children }: { children: ReactNode }) {
  return <div className={s.actions}>{children}</div>;
}
