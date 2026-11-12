import type { FormEvent, ReactNode } from 'react';
import { Button } from '../ui';
import s from './FilterBar.module.css';

interface Props {
  /** 검색 조건 칸들 — <Field label="상태"><Select …/></Field> 등 */
  children: ReactNode;
  /** 검색 버튼 / 엔터 — 폼 값은 FormData로 읽음(비제어) */
  onSubmit: (data: FormData) => void;
  onReset?: () => void;
}

/** 목록 위 검색 조건 줄 — 칸들이 가로로 흐르다 좁으면 줄바꿈, 오른쪽 끝에 [초기화][검색] */
export function FilterBar({ children, onSubmit, onReset }: Props) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(new FormData(e.currentTarget));
  };
  return (
    <form className={s.bar} role="search" onSubmit={submit} onReset={onReset}>
      <div className={s.fields}>{children}</div>
      <div className={s.actions}>
        {onReset && <Button type="reset" variant="secondary" size="sm">초기화</Button>}
        <Button type="submit" variant="solid" size="sm">검색</Button>
      </div>
    </form>
  );
}
