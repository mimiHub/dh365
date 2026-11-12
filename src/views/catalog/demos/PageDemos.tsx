import { useState } from 'react';
import { useSearchParams } from '@/lib/router';
import { CategoryNav, ListHead, SearchBox } from '../../../components/page';
import s from '../Catalog.module.css';

// 상태가 있는 데모 — entries/page.tsx에서 씀

export function CategoryNavDemo() {
  // 실제 페이지에선 주소(:category)로 현재 칸을 정함. 데모는 ?demo= 로 흉내
  const [params] = useSearchParams();
  const cur = params.get('demo') ?? 'all';
  const items = [
    { key: 'all', name: '전체', to: '/components?demo=all#category-nav', count: 27 },
    { key: 'steel', name: '철재방화셔터', to: '/components?demo=steel#category-nav', count: 5 },
    { key: 'screen', name: '방화스크린셔터', to: '/components?demo=screen#category-nav', count: 8 },
    { key: 'wind', name: '내풍압셔터', to: '/components?demo=wind#category-nav', count: 3 },
  ];
  return (
    <div className={s.navDemo}>
      <CategoryNav items={items} current={cur} label="데모 분류" id="demo-cats" />
      <p className={s.note}>아래: itemWidth="equal" (칸 폭 같게) — 좁은 화면에서 차이가 보입니다</p>
      <CategoryNav items={items.slice(1).map(({ key, name, to }) => ({ key, name, to }))} current={cur} label="데모 분류 2" id="demo-cats-2" itemWidth="equal" />
    </div>
  );
}

export function ListHeadDemo() {
  const [q, setQ] = useState('');
  return (
    <ListHead title="공지사항" total={q ? 1 : 8} q={q} page={1} pages={1}>
      <SearchBox key={q} id="demo-q" label="공지 제목 검색" placeholder="제목으로 검색" defaultValue={q} onSearch={setQ} />
    </ListHead>
  );
}
