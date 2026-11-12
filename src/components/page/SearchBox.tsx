import type { FormEvent } from 'react';
import { Icon, cx } from '../ui';
import s from './SearchBox.module.css';

interface Props {
  id: string;
  label: string; // 스크린리더용 이름 (예: 현장명 검색)
  placeholder: string;
  defaultValue: string;
  onSearch: (q: string) => void;
  className?: string;
}

/**
 * 검색창 — 비제어 입력(defaultValue) + 제출 때 FormData로 읽기. 글자마다 렌더할 필요가 없는 검색에 알맞음.
 * 주소의 검색어가 바뀌면 부모가 key를 바꿔 새로 그려 defaultValue를 다시 맞춤
 */
export function SearchBox({ id, label, placeholder, defaultValue, onSearch, className }: Props) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(String(new FormData(e.currentTarget).get('q') ?? '').trim());
  };
  return (
    <form className={cx(s.search, className)} role="search" onSubmit={submit}>
      <label htmlFor={id} className="sr-only">{label}</label>
      <input id={id} name="q" type="search" defaultValue={defaultValue} placeholder={placeholder} className={s.input} />
      <button type="submit" className={s.btn} aria-label="검색">
        <Icon name="search" size={20} />
      </button>
    </form>
  );
}
