import { useState } from 'react';
import { Pagination, SliderNav, Tabs } from '../../../components/ui';
import s from '../Catalog.module.css';

// 상태가 있는 데모 — 카탈로그 항목(entries/ui.tsx)에서 Demo로 씀. 컴포넌트만 내보내는 파일 (Fast Refresh)

export function TabsDemo() {
  const [v, setV] = useState<'all' | 'steel' | 'screen'>('all');
  return (
    <div className={s.col}>
      <Tabs label="제품 분류" idPrefix="demo-tabs" value={v} onChange={setV} items={[{ value: 'all', label: '전체' }, { value: 'steel', label: '철재방화셔터' }, { value: 'screen', label: '방화스크린셔터' }]} />
      <p className={s.note}>선택: {v}</p>
    </div>
  );
}

export function PaginationDemo() {
  const [p, setP] = useState(3);
  return <Pagination page={p} pages={12} onGo={setP} />;
}

export function SliderNavDemo() {
  const [i, setI] = useState(0);
  return <SliderNav current={i} total={5} itemLabel="사진" onPrev={() => setI(i - 1)} onNext={() => setI(i + 1)} prevDisabled={i === 0} nextDisabled={i === 4} />;
}
