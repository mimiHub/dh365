import { Alert, Field, FilterBar, ImageUpload, PageHeader, Panel, Select, StatCard, TextInput } from '../../../components/admin';
import { Button, Icon } from '../../../components/ui';
import { BannerFormScreen, BannerListScreen, DashboardScreen, InquiryScreen, QnaScreen } from '../examples/screens';
import { FormDemo, ModalDemo, RowFormDemo, ShellDemo, TableDemo } from '../demos/AdminDemos';
import type { Entry } from '../types';
import s from '../Catalog.module.css';

const FROM = '../components/admin';

export const ADMIN_ENTRIES: Entry[] = [
  {
    id: 'admin-shell',
    name: 'AdminShell',
    group: 'admin',
    from: FROM,
    desc: '관리자 화면 틀 — 왼쪽 메뉴 + 위 막대 + 본문. 1024px 이하에선 메뉴가 서랍(☰)으로. 아래 데모의 메뉴를 눌러 조립 예시 화면들을 둘러보세요.',
    bleed: true,
    Demo: ShellDemo,
    code: `'use client';
import { AdminShell } from '${FROM}';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// 관리자 라우트의 공통 틀 — src/app/admin/layout.tsx 에서 <AdminLayout>{children}</AdminLayout>
const MENU = [
  { key: 'dashboard', label: '대시보드', icon: 'dashboard', href: '/admin' },
  { key: 'banner', label: '배너 관리', icon: 'megaphone', href: '/admin/banners' },
  { key: 'qna', label: 'Q&A 관리', icon: 'help', href: '/admin/qna', badge: unanswered },
  { key: 'inquiry', label: '문의 관리', icon: 'inbox', href: '/admin/inquiries', badge: newCount },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const current = MENU.find((m) => m.href !== '/admin' && pathname.startsWith(m.href))?.key ?? 'dashboard';
  return (
    <AdminShell menu={MENU} current={current} user={me.name} onLogout={logout}>
      {children}
    </AdminShell>
  );
}`,
    props: [
      { name: 'menu', type: 'AdminMenuItem[]', required: true, desc: '{ key, label, icon, href?, badge? } — badge는 빨간 숫자' },
      { name: 'current', type: 'string', required: true, desc: '현재 메뉴 key' },
      { name: 'onSelect', type: '(key) => void', desc: 'href 없는 메뉴를 눌렀을 때 (데모·탭 방식)' },
      { name: 'user / onLogout', type: 'string / () => void', desc: '위 막대 오른쪽' },
      { name: 'mode', type: `'page' | 'embed'`, default: `'page'`, desc: 'embed: 다른 페이지 안 미리보기용 (고정 높이)' },
    ],
  },
  {
    id: 'page-header',
    name: 'PageHeader + Panel',
    group: 'admin',
    from: FROM,
    desc: '관리자 화면 머리(위치·제목·설명·버튼)와 흰 상자. 본문은 Panel을 쌓아서 구성.',
    Demo: () => (
      <div className={s.adminBg}>
        <PageHeader title="배너 관리" breadcrumb={['사이트 관리', '배너']} desc="메인 첫 화면 슬라이드 배너입니다." actions={<Button size="sm"><Icon name="plus" size={16} /> 배너 등록</Button>} />
        <Panel title="기본 정보" desc="사이트에 보이는 문구" actions={<Button size="sm" variant="secondary">미리보기</Button>}>
          <p className={s.note}>Panel 내용 — 폼, 글, 표 등</p>
        </Panel>
      </div>
    ),
    code: `import { PageHeader, Panel } from '${FROM}';

<PageHeader title="배너 관리" breadcrumb={['사이트 관리', '배너']}
  actions={<Button size="sm" href="/admin/banners/new">배너 등록</Button>} />
<Panel title="기본 정보">…</Panel>
<Panel padding="none">{/* 표는 여백 없이 */}<DataTable … /></Panel>`,
    props: [
      { name: 'PageHeader.title', type: 'string', required: true, desc: '화면 제목 (h1)' },
      { name: 'PageHeader.breadcrumb / desc / actions', type: 'string[] / ReactNode / ReactNode', desc: '위치 / 설명 / 오른쪽 버튼' },
      { name: 'Panel.title / desc / actions', type: 'string / ReactNode / ReactNode', desc: '상자 머리' },
      { name: 'Panel.padding', type: `'md' | 'none'`, default: `'md'`, desc: 'none: 표를 가장자리까지' },
    ],
  },
  {
    id: 'stat-card',
    name: 'StatCard',
    group: 'admin',
    from: FROM,
    desc: '대시보드 숫자 카드. 변화량 색(tone)은 부호가 아니라 의미로 — 미답변 +1은 bad.',
    Demo: () => (
      <div className={s.grid3}>
        <StatCard label="새 문의" value={3} unit="건" icon="inbox" delta="+2" tone="good" />
        <StatCard label="미답변 Q&A" value={2} unit="건" icon="help" delta="+1" tone="bad" />
        <StatCard label="이번 달 방문" value={12840} icon="eye" />
      </div>
    ),
    code: `import { StatCard } from '${FROM}';

<StatCard label="새 문의" value={3} unit="건" icon="inbox" delta="+2" tone="good" />`,
    props: [
      { name: 'label / value', type: 'string / number | string', required: true, desc: '숫자는 천 단위 콤마 자동' },
      { name: 'unit / icon', type: 'string / IconName', desc: '단위 / 아이콘' },
      { name: 'delta / tone', type: `string / 'good' | 'bad' | 'neutral'`, desc: '지난주 대비 변화와 그 색' },
    ],
  },
  {
    id: 'filter-bar',
    name: 'FilterBar',
    group: 'admin',
    from: FROM,
    desc: '목록 위 검색 조건 줄. 안에 Field들을 넣고, 검색 시 FormData로 값을 받음(비제어).',
    Demo: () => (
      <Panel padding="none">
        <FilterBar onSubmit={() => undefined} onReset={() => undefined}>
          <Field label="상태">
            <Select name="state" placeholder="전체" options={[{ value: 'new', label: '접수' }, { value: 'done', label: '답변완료' }]} />
          </Field>
          <Field label="검색어">
            <TextInput name="q" placeholder="제목·업체명" />
          </Field>
        </FilterBar>
      </Panel>
    ),
    code: `import { FilterBar, Field, Select, TextInput } from '${FROM}';

<FilterBar
  onSubmit={(data) => setSearchParams({ state: String(data.get('state')), q: String(data.get('q')) })}
  onReset={() => setSearchParams({})}>
  <Field label="상태"><Select name="state" placeholder="전체" options={STATES} /></Field>
  <Field label="검색어"><TextInput name="q" /></Field>   {/* 마지막 칸이 남는 폭을 차지 */}
</FilterBar>`,
    props: [
      { name: 'children', type: 'ReactNode', required: true, desc: 'Field들 — 마지막 칸이 넓게' },
      { name: 'onSubmit', type: '(data: FormData) => void', required: true, desc: '검색 버튼·엔터' },
      { name: 'onReset', type: '() => void', desc: '있으면 [초기화] 버튼' },
    ],
  },
  {
    id: 'data-table',
    name: 'DataTable + BulkBar',
    group: 'admin',
    from: FROM,
    desc: '관리자 목록 표. selected·onSelectChange를 주면 체크박스(전체 선택·일부 선택 표시 포함). 고르면 BulkBar로 일괄 작업.',
    Demo: TableDemo,
    code: `import { DataTable, BulkBar, type DataColumn } from '${FROM}';

const [selected, setSelected] = useState<(string | number)[]>([]);
const columns: DataColumn<Banner>[] = [
  { key: 'id', header: '번호', width: 72, align: 'center', render: (b) => b.id },
  { key: 'title', header: '배너명', render: (b) => <Link to={\`/admin/banners/\${b.id}\`}>{b.title}</Link> },
  { key: 'visible', header: '노출', width: 88, align: 'center',
    render: (b) => <Switch checked={b.visible} onChange={(v) => toggle(b.id, v)} label={\`\${b.title} 노출\`} hideLabel /> },
];

<BulkBar count={selected.length} onClear={() => setSelected([])}>
  <Button size="sm" variant="danger" onClick={askDelete}>삭제</Button>
</BulkBar>
<DataTable caption="배너 목록" columns={columns} rows={rows} rowKey={(b) => b.id}
  selected={selected} onSelectChange={setSelected} />`,
    props: [
      { name: 'columns', type: 'DataColumn<T>[]', required: true, desc: '{ key, header, width?, align?, render }' },
      { name: 'rows / rowKey', type: 'T[] / (row) => key', required: true, desc: '데이터와 줄 고유값' },
      { name: 'caption', type: 'string', required: true, desc: '표 설명 (스크린리더)' },
      { name: 'selected / onSelectChange', type: 'key[] / (keys) => void', desc: '둘 다 주면 체크박스 켜짐 (제어 컴포넌트)' },
      { name: 'onRowClick', type: '(row) => void', desc: '줄 클릭 (안의 링크·버튼 클릭은 제외)' },
      { name: 'density / empty', type: `'md' | 'sm' / ReactNode`, default: `'md'`, desc: '줄 높이 56/44px / 비었을 때 문구' },
      { name: 'BulkBar.count / onClear', type: 'number / () => void', required: true, desc: '0이면 숨김' },
    ],
  },
  {
    id: 'form',
    name: 'Field + 입력 컴포넌트',
    group: 'admin',
    from: FROM,
    desc: 'Field가 라벨·필수·도움말·오류를 그리고, 안의 입력칸에 id·aria를 Context로 자동 연결 — 쓰는 쪽은 id를 맞출 필요가 없습니다.',
    Demo: FormDemo,
    code: `import { Field, TextInput, Textarea, Select, RadioGroup, Checkbox, Switch, FormActions } from '${FROM}';

<form onSubmit={submit} noValidate>
  <Field label="배너명" required help="40자 이내" error={errors.title}>
    <TextInput name="title" maxLength={40} />
  </Field>
  <Field label="분류"><Select name="cat" placeholder="선택하세요" options={CATS} /></Field>
  <Field label="링크 열기" group>                 {/* 묶음은 group → fieldset/legend */}
    <RadioGroup name="target" defaultValue="self" options={[…]} />
  </Field>
  <Field label="노출"><Switch checked={on} onChange={setOn} label="노출함" /></Field>
  <FormActions><Button type="submit" variant="solid">저장</Button></FormActions>
</form>

// 직접 만든 입력 컴포넌트도 Field와 연결하려면
const a11y = useFieldControl({ id: props.id });   // → <input {...a11y} />`,
    props: [
      { name: 'Field.label', type: 'string', required: true, desc: '라벨 (group이면 legend)' },
      { name: 'Field.required / help / error', type: 'boolean / ReactNode / string', desc: 'error가 있으면 빨간 테두리 + aria-invalid' },
      { name: 'Field.layout', type: `'stack' | 'row'`, default: `'stack'`, desc: 'row: 라벨 왼쪽 (등록·수정 폼)' },
      { name: 'Field.group', type: 'boolean', desc: '라디오·체크박스 묶음' },
      { name: 'TextInput / Textarea / Select', type: 'input·textarea·select 속성', desc: 'Select는 options, placeholder 추가' },
      { name: 'Switch', type: '{ checked, onChange, label, hideLabel? }', desc: '바로 적용되는 켜고 끄기 (role=switch)' },
    ],
  },
  {
    id: 'form-row',
    name: 'Field layout="row"',
    group: 'admin',
    from: FROM,
    desc: '등록·수정 화면용 — 라벨 왼쪽 140px, 줄마다 구분선. 모바일에선 위아래로.',
    Demo: RowFormDemo,
    code: `<Panel title="기본 정보">
  <Field label="배너명" layout="row" required><TextInput name="title" /></Field>
  <Field label="노출 기간" layout="row" help="비우면 계속 노출">…</Field>
</Panel>`,
  },
  {
    id: 'image-upload',
    name: 'ImageUpload',
    group: 'admin',
    from: FROM,
    desc: '배너·썸네일 이미지 올리기 — 끌어다 놓기/선택, 미리보기, 바꾸기·지우기, 형식·용량 검사. name을 주면 폼 FormData에 파일이 담김.',
    Demo: () => (
      <Field label="PC 배너 이미지" help="1920 × 600px 권장">
        <ImageUpload name="image" ratio="16 / 5" />
      </Field>
    ),
    code: `import { Field, ImageUpload } from '${FROM}';

<Field label="PC 이미지" required help="1920 × 600px 권장" error={errors.image}>
  <ImageUpload name="image" ratio="16 / 5" defaultUrl={banner?.imageUrl} />
</Field>
// 직접 업로드하려면 onChange={(file) => upload(file)}`,
    props: [
      { name: 'name', type: 'string', desc: '폼 전송 시 파일 필드 이름' },
      { name: 'defaultUrl', type: 'string', desc: '수정 화면의 기존 이미지' },
      { name: 'onChange', type: '(file: File | null) => void', desc: '고르거나 지웠을 때' },
      { name: 'ratio', type: 'string', default: `'16 / 9'`, desc: '미리보기 비율' },
      { name: 'accept / maxMB', type: 'string / number', default: `png·jpg·webp / 5`, desc: '받을 형식 / 최대 용량' },
      { name: 'maxWidth', type: 'number', default: '640', desc: '미리보기 최대 폭 — 세로로 긴 비율은 작게 (모바일 배너 240 등)' },
    ],
  },
  {
    id: 'modal',
    name: 'Modal + ConfirmDialog',
    group: 'admin',
    from: FROM,
    desc: '브라우저 기본 <dialog> 사용 — 뒤 화면 막기·포커스 가두기·Esc 닫기·포커스 복귀를 브라우저가 처리. 삭제 확인은 ConfirmDialog tone="danger".',
    Demo: ModalDemo,
    code: `import { Modal, ConfirmDialog } from '${FROM}';

const [open, setOpen] = useState(false);
<Modal open={open} onClose={() => setOpen(false)} title="배너 미리보기" size="lg"
  footer={<Button size="sm" onClick={() => setOpen(false)}>닫기</Button>}>…</Modal>

<ConfirmDialog open={confirm} tone="danger" title="배너 삭제"
  message="선택한 배너를 삭제할까요?" confirmLabel="삭제"
  onConfirm={remove} onCancel={() => setConfirm(false)} />`,
    props: [
      { name: 'open / onClose', type: 'boolean / () => void', required: true, desc: '열림은 부모 state가 결정' },
      { name: 'title', type: 'string', required: true, desc: '창 제목' },
      { name: 'size / footer', type: `'sm' | 'md' | 'lg' / ReactNode`, default: `'md'`, desc: '폭 420/640/880 / 아래 버튼' },
      { name: 'ConfirmDialog.tone', type: `'default' | 'danger'`, default: `'default'`, desc: 'danger면 확인 버튼 빨강' },
    ],
  },
  {
    id: 'alert',
    name: 'Alert',
    group: 'admin',
    from: FROM,
    desc: '안내 상자 — 저장 완료, 오류 요약, 주의. danger·warning은 스크린리더가 바로 읽음.',
    Demo: () => (
      <div className={s.col}>
        <Alert tone="success" title="저장했습니다">메인 화면에 바로 반영됩니다.</Alert>
        <Alert tone="info">노출 기간이 지난 배너는 자동으로 숨겨집니다.</Alert>
        <Alert tone="warning">이미지가 권장 크기보다 작습니다.</Alert>
        <Alert tone="danger" title="입력 내용을 확인해 주세요" onClose={() => undefined}>배너명을 입력해 주세요.</Alert>
      </div>
    ),
    code: `import { Alert } from '${FROM}';

<Alert tone="success" title="저장했습니다" onClose={() => setNotice(null)}>…</Alert>`,
    props: [
      { name: 'tone', type: `'info' | 'success' | 'warning' | 'danger'`, default: `'info'`, desc: '종류' },
      { name: 'title', type: 'string', desc: '굵은 첫 줄' },
      { name: 'onClose', type: '() => void', desc: '있으면 닫기 버튼' },
    ],
  },
];

export const EXAMPLE_ENTRIES: Entry[] = [
  {
    id: 'ex-dashboard',
    name: '대시보드',
    group: 'example',
    from: '../views/catalog/examples/screens',
    desc: 'StatCard 4개 + 처리할 문의 표.',
    Demo: () => (
      <div className={s.adminBg}>
        <DashboardScreen />
      </div>
    ),
    code: `// src/views/catalog/examples/screens.tsx — DashboardScreen
<PageHeader title="대시보드" />
<div className="stats">
  <StatCard label="새 문의" value={3} unit="건" icon="inbox" delta="+2" tone="good" />
  …
</div>
<Panel title="처리할 문의" padding="none"><DataTable … density="sm" /></Panel>`,
  },
  {
    id: 'ex-banner-list',
    name: '배너 관리 — 목록',
    group: 'example',
    from: '../views/catalog/examples/screens',
    desc: '검색 조건, 체크해서 일괄 노출·숨김·삭제(확인 창), 줄마다 노출 스위치. 줄을 체크해 보세요.',
    Demo: () => (
      <div className={s.adminBg}>
        <BannerListScreen />
      </div>
    ),
    code: `// BannerListScreen — PageHeader + Panel(FilterBar + BulkBar + DataTable) + ConfirmDialog
<Panel padding="none">
  <FilterBar onSubmit={…} onReset={…}>…</FilterBar>
  <BulkBar count={selected.length} onClear={…}>
    <Button size="sm" variant="secondary" onClick={() => setVisible(selected, true)}>노출</Button>
    <Button size="sm" variant="danger" onClick={() => setConfirm(true)}>삭제</Button>
  </BulkBar>
  <DataTable … selected={selected} onSelectChange={setSelected} />
</Panel>
<ConfirmDialog open={confirm} tone="danger" … />`,
  },
  {
    id: 'ex-banner-form',
    name: '배너 관리 — 등록·수정',
    group: 'example',
    from: '../views/catalog/examples/screens',
    desc: '배너명·큰 글·작은 글·연결 주소, PC/모바일 이미지, 노출 기간·순서·노출. 빈 채로 저장을 눌러 오류 표시를 확인해 보세요.',
    Demo: () => (
      <div className={s.adminBg}>
        <BannerFormScreen />
      </div>
    ),
    code: `// BannerFormScreen — 오류는 Field error + 위쪽 Alert 요약
const submit = (e) => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);           // 이미지 파일도 함께 담김
  const next = {};
  if (!data.get('title')) next.title = '배너명을 입력해 주세요.';
  setErrors(next);
  if (!Object.keys(next).length) await api.post('/banners', data);
};
<Field label="배너명" layout="row" required error={errors.title}><TextInput name="title" /></Field>
<Field label="PC 이미지" layout="row" required error={errors.image}><ImageUpload name="image" ratio="16 / 5" /></Field>`,
  },
  {
    id: 'ex-qna',
    name: 'Q&A 관리',
    group: 'example',
    from: '../views/catalog/examples/screens',
    desc: '왼쪽 목록에서 질문을 고르면 오른쪽에서 답변 작성 + FAQ 공개 스위치.',
    Demo: () => (
      <div className={s.adminBg}>
        <QnaScreen />
      </div>
    ),
    code: `// QnaScreen — 2단: Panel(DataTable onRowClick) | Panel(질문 + Field/Textarea + Switch)
<DataTable … onRowClick={choose} density="sm" />
<Panel title={\`질문 #\${pick.id}\`}>
  <Field label="답변" required><Textarea value={draft} onChange={…} rows={7} /></Field>
  <Switch checked={pick.public} onChange={setPublic} label="사이트 FAQ에 공개" />
  <Button size="sm" variant="solid" onClick={save} disabled={!draft.trim()}>답변 저장</Button>
</Panel>`,
  },
  {
    id: 'ex-inquiry',
    name: '문의 관리',
    group: 'example',
    from: '../views/catalog/examples/screens',
    desc: '견적·설계 문의 — 구분·상태·기간 검색, 일괄 상태 변경, 엑셀 내려받기, 페이지.',
    Demo: () => (
      <div className={s.adminBg}>
        <InquiryScreen />
      </div>
    ),
    code: `// InquiryScreen
<FilterBar …>
  <Field label="구분"><Select name="type" placeholder="전체" options={…} /></Field>
  <Field label="상태"><Select name="state" placeholder="전체" options={…} /></Field>
  <Field label="기간"><TextInput type="date" name="from" /></Field>
  <Field label="검색어"><TextInput name="q" /></Field>
</FilterBar>
<BulkBar …><Button size="sm" variant="secondary" onClick={() => setState('답변완료')}>답변완료로</Button></BulkBar>
<DataTable … />
<Pagination page={page} pages={pages} onGo={setPage} />`,
  },
];
