import { Badge, Button, Icon, Media, MoreLink, SectionHeading, StatItem, type IconName } from '../../../components/ui';
import { PaginationDemo, SliderNavDemo, TabsDemo } from '../demos/UiDemos';
const sampleImg = '/images/product-steel-shutter.png';
import type { Entry } from '../types';
import s from '../Catalog.module.css';

const FROM = '../components/ui';

const ICONS: IconName[] = ['search', 'lock', 'clip', 'video', 'download', 'file', 'pencil', 'close', 'check', 'left', 'right', 'chat', 'plus', 'trash', 'image', 'upload', 'dashboard', 'megaphone', 'help', 'inbox', 'menu', 'eye', 'info', 'alert', 'logout', 'copy'];

export const UI_ENTRIES: Entry[] = [
  {
    id: 'button',
    name: 'Button',
    group: 'ui',
    from: FROM,
    desc: 'href가 있으면 링크(<a>), 없으면 버튼(<button>). 이동은 링크, 동작은 버튼으로 구분됩니다.',
    Demo: () => (
      <div className={s.col}>
        <div className={s.row}>
          <Button>primary</Button>
          <Button variant="solid">solid</Button>
          <Button variant="secondary">secondary</Button>
          <Button variant="danger">danger</Button>
          <Button arrow>화살표</Button>
          <Button disabled>disabled</Button>
        </div>
        <div className={s.row}>
          <Button size="sm">sm</Button>
          <Button>md</Button>
          <Button size="lg">lg</Button>
        </div>
        <div className={s.dark}>
          <Button variant="ghost">ghost — 사진·네이비 위</Button>
        </div>
      </div>
    ),
    code: `import { Button } from '${FROM}';

<Button href="/quote/write" arrow>견적문의</Button>      {/* 링크 */}
<Button variant="solid" onClick={save}>저장</Button>     {/* 버튼 */}
<Button type="submit" variant="solid" size="sm">검색</Button>
<Button variant="danger" size="sm" onClick={remove}>삭제</Button>`,
    props: [
      { name: 'variant', type: `'primary' | 'solid' | 'secondary' | 'ghost' | 'danger'`, default: `'primary'`, desc: 'primary 블루 / solid 네이비 / secondary 테두리 / ghost 어두운 배경 위 / danger 삭제 등' },
      { name: 'size', type: `'sm' | 'md' | 'lg'`, default: `'md'`, desc: '높이 38 / 48 / 56px' },
      { name: 'href', type: 'string', desc: "있으면 링크. '/…'는 라우터 이동, 그 밖은 일반 <a>" },
      { name: 'arrow', type: 'boolean', desc: '오른쪽 화살표 (호버 시 이동)' },
      { name: '...rest', type: 'button / a 속성', desc: 'onClick, type, disabled, target 등 그대로 전달' },
    ],
  },
  {
    id: 'badge',
    name: 'Badge',
    group: 'ui',
    from: FROM,
    desc: '상태·분류 표시용 작은 꼬리표. 레드(fire)는 대기·경고처럼 꼭 눈에 띄어야 할 때만.',
    Demo: () => (
      <div className={s.row}>
        <Badge>neutral</Badge>
        <Badge tone="accent">accent</Badge>
        <Badge tone="solid">solid</Badge>
        <Badge tone="outline">outline</Badge>
        <Badge tone="fire">fire</Badge>
      </div>
    ),
    code: `import { Badge } from '${FROM}';

<Badge tone="solid">답변완료</Badge>
<Badge tone="fire">대기</Badge>`,
    props: [{ name: 'tone', type: `'neutral' | 'accent' | 'solid' | 'outline' | 'fire'`, default: `'neutral'`, desc: '색' }],
  },
  {
    id: 'icon',
    name: 'Icon',
    group: 'ui',
    from: FROM,
    desc: '선 아이콘 모음. 장식용이라 기본 aria-hidden — 아이콘만 있는 버튼은 버튼에 aria-label을 다세요. 새 아이콘은 Icon.tsx의 PATHS에 추가.',
    Demo: () => (
      <ul className={s.icons}>
        {ICONS.map((n) => (
          <li key={n}>
            <Icon name={n} size={22} />
            <code>{n}</code>
          </li>
        ))}
      </ul>
    ),
    code: `import { Icon } from '${FROM}';

<Icon name="trash" size={16} />
<button aria-label="닫기"><Icon name="close" /></button>`,
    props: [
      { name: 'name', type: 'IconName', required: true, desc: '위 목록의 이름' },
      { name: 'size', type: 'number', default: '18', desc: '가로·세로 px' },
      { name: 'strokeWidth', type: 'number', default: '1.8', desc: '선 굵기' },
    ],
  },
  {
    id: 'tabs',
    name: 'Tabs',
    group: 'ui',
    from: FROM,
    desc: '같은 화면 안에서 내용만 바꾸는 탭(role=tab). 주소가 바뀌는 분류 이동이면 CategoryNav를 쓰세요. 좌우 방향키 지원.',
    Demo: TabsDemo,
    code: `import { Tabs } from '${FROM}';

const [v, setV] = useState('all');
<Tabs label="제품 분류" idPrefix="product" value={v} onChange={setV}
  items={[{ value: 'all', label: '전체' }, { value: 'steel', label: '철재방화셔터' }]} />
<div role="tabpanel" id="product-panel" aria-labelledby={\`product-tab-\${v}\`}>…</div>`,
    props: [
      { name: 'items', type: '{ value, label }[]', required: true, desc: '탭 목록' },
      { name: 'value / onChange', type: 'V / (v) => void', required: true, desc: '선택 상태는 부모가 가짐(제어 컴포넌트)' },
      { name: 'label', type: 'string', required: true, desc: 'tablist 이름 (스크린리더)' },
      { name: 'idPrefix', type: 'string', required: true, desc: '탭 ↔ 패널 aria 연결용 id 앞부분' },
    ],
  },
  {
    id: 'pagination',
    name: 'Pagination',
    group: 'ui',
    from: FROM,
    desc: '페이지 번호. 사용자 화면·관리자 목록 공용.',
    Demo: PaginationDemo,
    code: `import { Pagination } from '${FROM}';

<Pagination page={page} pages={totalPages} onGo={setPage} />`,
    props: [
      { name: 'page / pages', type: 'number', required: true, desc: '현재 페이지 / 전체 페이지 수' },
      { name: 'onGo', type: '(n: number) => void', required: true, desc: '번호를 눌렀을 때' },
      { name: 'windowSize', type: 'number', default: '5', desc: '한 번에 보여 줄 번호 개수' },
    ],
  },
  {
    id: 'slider-nav',
    name: 'SliderNav',
    group: 'ui',
    from: FROM,
    desc: '[01 / 05 ‹ ›] — 슬라이드·갤러리·넘치는 분류 패널의 이전/다음.',
    Demo: SliderNavDemo,
    code: `import { SliderNav } from '${FROM}';

<SliderNav current={i} total={5} itemLabel="사진"
  onPrev={() => setI(i - 1)} onNext={() => setI(i + 1)}
  prevDisabled={i === 0} nextDisabled={i === 4} />`,
    props: [
      { name: 'current / total', type: 'number', required: true, desc: '현재(0부터) / 전체' },
      { name: 'onPrev / onNext', type: '() => void', required: true, desc: '버튼 동작' },
      { name: 'itemLabel', type: 'string', required: true, desc: "버튼 이름 — '이전 사진'처럼 읽힘" },
      { name: 'controls', type: 'string', desc: '움직이는 목록의 id (aria-controls)' },
    ],
  },
  {
    id: 'media',
    name: 'Media',
    group: 'ui',
    from: FROM,
    desc: '이미지 자리. src가 없으면 셔터 슬랫 패턴 + 라벨로 자리를 잡아 둠(시안 단계).',
    Demo: () => (
      <div className={s.grid2}>
        <Media className={s.media} label="이미지 준비 중" />
        <Media className={s.media} src={sampleImg} alt="철재방화셔터" />
      </div>
    ),
    code: `import { Media } from '${FROM}';

<Media src={img} alt="철재방화셔터 시공 사진" position="50% 30%" />
<Media label="IMAGE" />   {/* 자리만 */}`,
    props: [
      { name: 'src / alt', type: 'string', desc: '이미지와 대체 글' },
      { name: 'label', type: 'string', desc: 'src가 없을 때 가운데 글자' },
      { name: 'position', type: 'string', desc: 'object-position — 잘릴 때 남길 부분' },
    ],
  },
  {
    id: 'section-heading',
    name: 'SectionHeading',
    group: 'ui',
    from: FROM,
    desc: '섹션 제목 묶음 — 영문 작은 글 / 큰 제목(<em> 강조) / 설명.',
    Demo: () => <SectionHeading eyebrow="OUR PRODUCTS" title={<>현장에 맞는 <em>방화셔터</em></>} description="철재·스크린·내풍압 셔터를 설계부터 시공까지." />,
    code: `import { SectionHeading } from '${FROM}';

<SectionHeading eyebrow="OUR PRODUCTS" title={<>현장에 맞는 <em>방화셔터</em></>} description="…" align="center" />`,
    props: [
      { name: 'eyebrow', type: 'string', desc: '위 영문' },
      { name: 'title', type: 'ReactNode', required: true, desc: '<em>으로 감싼 부분은 블루' },
      { name: 'align', type: `'left' | 'center'`, default: `'left'`, desc: '정렬' },
      { name: 'as', type: `'h1' | 'h2' | 'h3'`, default: `'h2'`, desc: '제목 태그 단계' },
    ],
  },
  {
    id: 'stat-item',
    name: 'StatItem',
    group: 'ui',
    from: FROM,
    desc: '사용자 화면의 큰 숫자. 관리자 대시보드는 StatCard를 쓰세요.',
    Demo: () => (
      <div className={s.row}>
        <StatItem value="12,000" unit="mm" label="방화스크린셔터 인정 폭" />
        <StatItem value="3" unit="곳" label="본사 · 부산 · 광주 지사" />
      </div>
    ),
    code: `import { StatItem } from '${FROM}';

<StatItem value="12,000" unit="mm" label="방화스크린셔터 인정 폭" />`,
    props: [
      { name: 'value', type: 'ReactNode', required: true, desc: '숫자' },
      { name: 'unit', type: 'string', desc: '단위' },
      { name: 'label', type: 'ReactNode', required: true, desc: '설명' },
    ],
  },
  {
    id: 'more-link',
    name: 'MoreLink',
    group: 'ui',
    from: FROM,
    desc: '‘VIEW MORE ——’ 글자 링크. 섹션 끝 더보기.',
    Demo: () => <MoreLink href="#more-link">VIEW MORE</MoreLink>,
    code: `import { MoreLink } from '${FROM}';

<MoreLink href="/notice">MORE</MoreLink>`,
    props: [
      { name: 'href', type: 'string', default: `'#'`, desc: '이동할 주소' },
      { name: 'children', type: 'ReactNode', default: `'VIEW MORE'`, desc: '글자' },
    ],
  },
];
