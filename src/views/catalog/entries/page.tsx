import { AttachmentList, BoardTable, CommentCount, CtaBand, EmptyState, InfoList, PostHeader, PostNav, StatusChip, SubHero } from '../../../components/page';
import { CategoryNavDemo, ListHeadDemo } from '../demos/PageDemos';
import { Button, Icon } from '../../../components/ui';
import type { Entry } from '../types';
import s from '../Catalog.module.css';

const FROM = '../components/page';

const ROWS = [
  { id: 9, title: '방화셔터(스크린) 대형화(12m x 8.5m) 인정서 발급 안내', views: 1576, pinned: true, comments: 0 },
  { id: 5, title: '방화셔터(스크린) SIZE 12m x 8.5m 상향', views: 826, comments: 1 },
  { id: 4, title: '방화셔터 인정 승인 관련', views: 397, comments: 0 },
];

export const PAGE_ENTRIES: Entry[] = [
  {
    id: 'sub-hero',
    name: 'SubHero',
    group: 'page',
    from: FROM,
    desc: '하위 페이지 위 큰 배너 — 사진을 네이비로 눌러 흰 글자 대비 확보. 아래에 분류 패널이 걸치면 withNav.',
    bleed: true,
    Demo: () => (
      <div className={s.heroDemo}>
        <SubHero en="Notice" title="공지사항" desc="대한방화의 인정 취득·제품·회사 소식을 알려 드립니다." />
      </div>
    ),
    code: `import { SubHero } from '${FROM}';
const heroImg = '/images/notice-hero.jpg';

<SubHero en="Notice" title="공지사항" desc="…" image={heroImg} position="50% 62%" />
<SubHero en="Library" title="자료실" withNav />   {/* 아래 CategoryNav가 걸칠 때 */}`,
    props: [
      { name: 'en / title', type: 'string', required: true, desc: '위 영문 / 제목(h1)' },
      { name: 'desc', type: 'string', desc: '설명 한 줄' },
      { name: 'image', type: 'string', default: '상담 사진', desc: '배경 사진' },
      { name: 'position', type: 'string', default: `'50% 40%'`, desc: '사진에서 남길 부분 (object-position)' },
      { name: 'withNav', type: 'boolean', desc: '아래 분류 패널이 걸칠 자리만큼 높이·여백' },
      { name: 'sub', type: 'string', desc: "스크린리더에만 붙는 부제 ('목록', '상세')" },
    ],
  },
  {
    id: 'category-nav',
    name: 'CategoryNav',
    group: 'page',
    from: FROM,
    desc: '분류 이동 패널 — 분류마다 주소가 있는 페이지 이동(링크 + aria-current). 넘치면 가로 스크롤 + SliderNav 자동.',
    Demo: CategoryNavDemo,
    code: `import { CategoryNav } from '${FROM}';

<CategoryNav id="library-cats" label="자료실 분류" current={key}
  items={[{ key: 'spec', name: '시방서', to: '/library/spec', count: 12 }, …]} />

<CategoryNav … itemWidth="equal" />   {/* 칸 폭 같게 (회사소개) */}`,
    props: [
      { name: 'items', type: '{ key, name, to, count? }[]', required: true, desc: 'count가 있으면 이름 아래 건수' },
      { name: 'current', type: 'string', required: true, desc: '선택된 key' },
      { name: 'label / id', type: 'string', required: true, desc: 'nav 이름 / 목록 id' },
      { name: 'itemWidth', type: `'auto' | 'equal'`, default: `'auto'`, desc: '좁은 화면에서 칸 폭 — 글자만큼 / 모두 같게' },
    ],
  },
  {
    id: 'list-head',
    name: 'ListHead + SearchBox',
    group: 'page',
    from: FROM,
    desc: '목록 머리 [제목 · 총 N건 · 페이지] ……… [검색]. 검색어는 주소(?q=)에 담는 것을 권장 — useListQuery 훅 참고.',
    Demo: ListHeadDemo,
    code: `import { ListHead, SearchBox } from '${FROM}';
import { useListQuery } from '../hooks/useListQuery';

const lq = useListQuery({ items, pageSize: 10, path: '/notice' });
<ListHead ref={lq.topRef} title="공지사항" total={lq.list.length} q={lq.q} page={lq.page} pages={lq.pages}>
  <SearchBox key={lq.q} id="notice-q" label="공지 제목 검색" placeholder="제목으로 검색"
    defaultValue={lq.q} onSearch={lq.search} />
</ListHead>`,
    props: [
      { name: 'title', type: 'ReactNode', required: true, desc: '<em>은 블루' },
      { name: 'total / q / page / pages', type: 'number / string', desc: '건수·검색어·페이지 표시' },
      { name: 'children', type: 'ReactNode', desc: '오른쪽 도구(검색창·글쓰기 버튼)' },
      { name: 'SearchBox.onSearch', type: '(q: string) => void', required: true, desc: '제출 시 다듬은 검색어' },
    ],
  },
  {
    id: 'board-table',
    name: 'BoardTable',
    group: 'page',
    from: FROM,
    desc: '사용자 화면 게시판 표. 모바일에선 CSS만으로 카드형 줄로 바뀜. 칸마다 mobile: meta/hide/badge. 관리자 목록은 DataTable을 쓰세요.',
    Demo: () => (
      <BoardTable
        caption="데모 공지 목록"
        rows={ROWS}
        rowKey={(r) => r.id}
        highlight={(r) => !!r.pinned}
        title={(r) => ({ to: '#board-table', text: r.title, icon: <Icon name="file" size={15} />, after: <CommentCount count={r.comments} /> })}
        columns={[
          { key: 'no', header: '번호', width: 96, cell: (r) => (r.pinned ? <StatusChip solid>공지</StatusChip> : r.id), mobile: (r) => (r.pinned ? 'badge' : 'meta') },
          { key: 'title', header: '제목', cell: () => null },
          { key: 'views', header: '조회', width: 120, cell: (r) => r.views.toLocaleString(), mobile: 'meta' },
        ]}
      />
    ),
    code: `import { BoardTable, StatusChip, CommentCount } from '${FROM}';

<BoardTable caption="공지사항 목록" rows={rows} rowKey={(r) => r.id}
  highlight={(r) => r.pinned}
  title={(r) => ({ to: \`/notice/\${r.id}\`, text: r.title, after: <CommentCount count={r.comments} /> })}
  columns={[
    { key: 'no', header: '번호', width: 96, cell: (r) => r.pinned ? <StatusChip solid>공지</StatusChip> : r.id,
      mobile: (r) => (r.pinned ? 'badge' : 'meta') },
    { key: 'title', header: '제목', cell: () => null },   // 'title' 자리에 제목 링크가 들어감
    { key: 'views', header: '조회', width: 120, cell: (r) => r.views, mobile: 'meta' },
  ]} />`,
    props: [
      { name: 'columns', type: 'BoardColumn<T>[]', required: true, desc: "{ key, header, width?, cell, mobile? } — key 'title' 자리에 제목" },
      { name: 'title', type: '(row) => { to, text, icon?, after?, secret? }', required: true, desc: '제목 링크' },
      { name: 'highlight', type: '(row) => boolean', desc: '강조 줄 (고정 공지)' },
      { name: 'mobile (칸)', type: `'meta' | 'hide' | 'badge' | (row) => …`, desc: '모바일 카드에서 그 칸 처리' },
      { name: 'StatusChip', type: '{ done?, solid? }', desc: '회색 / 연블루(done) / 네이비(solid) 칩' },
    ],
  },
  {
    id: 'empty-state',
    name: 'EmptyState',
    group: 'page',
    from: FROM,
    desc: "빈 목록 — 이/가는 받침에 따라 자동 ('자료가', '동영상이'). 검색 중이면 '검색어 지우기'.",
    Demo: () => <EmptyState noun="공지" q="인정서" resetTo="/components#empty-state" />,
    code: `import { EmptyState } from '${FROM}';

<EmptyState noun="자료" q={q} resetTo="/library/spec" />`,
    props: [
      { name: 'noun', type: 'string', required: true, desc: '무엇이 없는지' },
      { name: 'q', type: 'string', desc: '검색어 — 있으면 검색 결과 문구' },
      { name: 'resetTo', type: 'string', required: true, desc: '검색어 지우기 주소' },
    ],
  },
  {
    id: 'post-header',
    name: 'PostHeader + PostNav',
    group: 'page',
    from: FROM,
    desc: '글 상세 머리(칩·번호·제목·정보)와 이전·다음 글.',
    Demo: () => (
      <div>
        <PostHeader badges={<StatusChip solid>공지</StatusChip>} title="방화셔터(스크린) 대형화(12m x 8.5m) 인정서 발급 안내" meta={['2025.03.12', '조회 1,576']} titleId="demo-post-title" />
        <PostNav label="데모 이전·다음" from="/components" newer={{ to: '#post-header', title: '대형방화셔터 인정서 발급 안내' }} />
      </div>
    ),
    code: `import { PostHeader, PostNav, StatusChip } from '${FROM}';

<PostHeader badges={<StatusChip done>보도자료</StatusChip>} no={12} title={post.title} meta={['2025.03.12', '조회 120']} />
<PostNav newer={{ to: '/notice/9', title: '…' }} older={undefined} from={backTo} />`,
    props: [
      { name: 'PostHeader.meta', type: 'ReactNode[]', required: true, desc: '제목 아래 정보 (| 로 구분)' },
      { name: 'PostHeader.badges / no', type: 'ReactNode / number', desc: '위 칩 / 글 번호' },
      { name: 'PostNav.newer / older', type: '{ to, title }', desc: '없는 쪽은 "…이 없습니다"' },
      { name: 'PostNav.from', type: 'string', required: true, desc: "'목록으로'가 돌아갈 주소 (옮겨 다녀도 유지)" },
    ],
  },
  {
    id: 'attachment-list',
    name: 'AttachmentList',
    group: 'page',
    from: FROM,
    desc: '첨부파일 목록 — 파일 하나당 [이름 · 크기 · 내려받기].',
    Demo: () => <AttachmentList items={[{ name: '스크린방화셔터 시방서(2022).pdf', size: '2.4MB' }, { name: '스크린방화셔터 상세도.dwg', size: '1.1MB' }]} />,
    code: `import { AttachmentList } from '${FROM}';

<AttachmentList items={[{ name: '시방서.pdf', size: '2.4MB', href: '/files/spec.pdf' }]} />`,
    props: [
      { name: 'items', type: '{ name, size?, href?, kind? }[]', required: true, desc: 'href 없으면 목업 표시' },
      { name: 'label', type: 'string', default: `'첨부파일'`, desc: '목록 이름' },
    ],
  },
  {
    id: 'info-list',
    name: 'InfoList',
    group: 'page',
    from: FROM,
    desc: '라벨·값 목록(<dl>) — 회사 개요, 문의 상세 정보, 관리자 상세 화면에도.',
    Demo: () => (
      <div className={s.grid2}>
        <InfoList rows={[{ label: '대표전화', value: '031-388-0023' }, { label: '이메일', value: 'dh365@dh365.co.kr' }]} />
        <InfoList variant="card" rows={[{ label: '대표이사', value: '신동원' }, { label: '사업장', value: '본사 · 부산지사 · 광주지사' }]} />
      </div>
    ),
    code: `import { InfoList } from '${FROM}';

<InfoList cols={2} rows={[{ label: '대표전화', value: <a href="tel:…">031-388-0023</a> }]} />
<InfoList variant="card" rows={…} />`,
    props: [
      { name: 'rows', type: '{ label, value }[]', required: true, desc: 'value는 ReactNode (링크 가능)' },
      { name: 'variant', type: `'table' | 'card'`, default: `'table'`, desc: '선 있는 표 / 연회색 카드' },
      { name: 'cols', type: '1 | 2', default: '1', desc: 'PC 2열' },
    ],
  },
  {
    id: 'cta-band',
    name: 'CtaBand',
    group: 'page',
    from: FROM,
    desc: '페이지 끝 행동 유도 띠 (네이비).',
    Demo: () => (
      <CtaBand
        title="현장에 맞는 방화셔터, 대한방화와 상의하세요"
        desc="견적·설계 문의를 남기시거나 대표번호로 연락 주세요."
        actions={
          <>
            <Button arrow>견적문의</Button>
            <Button variant="secondary">설계문의</Button>
          </>
        }
      />
    ),
    code: `import { CtaBand } from '${FROM}';

<CtaBand title="…" desc="…" actions={<><Button href="/quote/write" arrow>견적문의</Button><Button href="/design/write" variant="secondary">설계문의</Button></>} />`,
    props: [
      { name: 'title', type: 'string', required: true, desc: '제목' },
      { name: 'desc', type: 'ReactNode', desc: '설명' },
      { name: 'actions', type: 'ReactNode', required: true, desc: '버튼들 (secondary는 흰 테두리로 자동)' },
    ],
  },
];
