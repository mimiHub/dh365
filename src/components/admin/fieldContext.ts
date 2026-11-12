import { createContext, useContext } from 'react';

/**
 * <Field> → 안쪽 입력칸으로 넘기는 연결 정보.
 * 컴포넌트 파일(Form.tsx)과 따로 둔 이유: 한 파일이 컴포넌트와 일반 값(Context·훅)을 같이 내보내면
 * React Fast Refresh가 파일을 갈아 끼우지 못하고 페이지를 새로고침함
 */
export interface FieldCtx {
  id: string;
  describedBy?: string;
  invalid: boolean;
  required: boolean;
}

export const FieldContext = createContext<FieldCtx | null>(null);

/** Field 안이면 id·aria를 받고, 밖에서 쓰면 넘긴 값 그대로 — 입력 컴포넌트를 만들 때 이것만 펼쳐 넣으면 됨 */
export function useFieldControl(own: { id?: string; required?: boolean }) {
  const f = useContext(FieldContext);
  return {
    id: own.id ?? f?.id,
    required: own.required ?? f?.required,
    'aria-describedby': f?.describedBy,
    'aria-invalid': f?.invalid || undefined,
  };
}
