import { useState, type FormEvent } from 'react';
import { Badge, Button, Icon, Pagination } from '../../../components/ui';
import {
  Alert,
  BulkBar,
  ConfirmDialog,
  DataTable,
  Field,
  FilterBar,
  FormActions,
  ImageUpload,
  PageHeader,
  Panel,
  RadioGroup,
  Select,
  StatCard,
  Switch,
  Textarea,
  TextInput,
  type DataColumn,
} from '../../../components/admin';
import { BANNERS, INQUIRIES, QNAS, type Banner, type Inquiry, type InquiryState, type Qna } from './mock';
import s from './screens.module.css';

/* ─────────────────────────────────────────────
 * 관리자 화면 조립 예시 — 개발자가 실제 화면을 만들 때 출발점.
 * 화면마다 '컴포넌트 조합'만 보면 되도록, 서버 통신 자리는 주석으로 표시하고 상태는 useState로 흉내 냄
 * ───────────────────────────────────────────── */

const STATE_TONE: Record<InquiryState, 'neutral' | 'accent' | 'solid'> = { 접수: 'neutral', 검토중: 'accent', 답변완료: 'solid' };

/** 대시보드 — 숫자 카드 + 최근 문의 */
export function DashboardScreen() {
  const waiting = INQUIRIES.filter((q) => q.state !== '답변완료');
  return (
    <>
      <PageHeader title="대시보드" desc="오늘 처리할 문의와 사이트 현황입니다." />
      <div className={s.stats}>
        <StatCard label="새 문의" value={3} unit="건" icon="inbox" delta="+2" tone="good" />
        <StatCard label="미답변 Q&A" value={QNAS.filter((q) => !q.answer).length} unit="건" icon="help" delta="+1" tone="bad" />
        <StatCard label="노출 중 배너" value={BANNERS.filter((b) => b.visible).length} unit="개" icon="megaphone" />
        <StatCard label="이번 달 방문" value={12840} icon="eye" delta="+8%" tone="good" />
      </div>
      <Panel title="처리할 문의" desc="접수·검토중 상태" padding="none" actions={<Button size="sm" variant="secondary">전체 보기</Button>}>
        <DataTable
          caption="처리할 문의 목록"
          rows={waiting}
          rowKey={(r) => r.id}
          density="sm"
          columns={[
            { key: 'type', header: '구분', width: 80, align: 'center', render: (r) => <Badge tone="outline">{r.type}</Badge> },
            { key: 'title', header: '제목', render: (r) => r.title },
            { key: 'company', header: '업체', width: 160, render: (r) => r.company },
            { key: 'state', header: '상태', width: 100, align: 'center', render: (r) => <Badge tone={STATE_TONE[r.state]}>{r.state}</Badge> },
          ]}
        />
      </Panel>
    </>
  );
}

/** 배너 관리 — 목록: 검색 조건 / 일괄 노출·숨김·삭제 / 노출 스위치 / 순서 */
export function BannerListScreen({ onCreate }: { onCreate?: () => void }) {
  const [rows, setRows] = useState<Banner[]>(BANNERS);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [confirm, setConfirm] = useState(false);
  const [notice, setNotice] = useState<string>();

  const setVisible = (ids: (string | number)[], visible: boolean) => {
    // 실제: await api.patch('/banners', { ids, visible }) 후 목록 다시 불러오기
    setRows((r) => r.map((b) => (ids.includes(b.id) ? { ...b, visible } : b)));
  };
  const remove = () => {
    setRows((r) => r.filter((b) => !selected.includes(b.id)));
    setNotice(`배너 ${selected.length}개를 삭제했습니다.`);
    setSelected([]);
    setConfirm(false);
  };

  const columns: DataColumn<Banner>[] = [
    { key: 'order', header: '순서', width: 64, align: 'center', render: (b) => b.order },
    { key: 'image', header: '이미지', width: 120, render: (b) => <img src={b.image} alt="" className={s.thumb} /> },
    {
      key: 'title',
      header: '배너명 / 문구',
      render: (b) => (
        <span className={s.two}>
          <a href="#banner-form">{b.title}</a>
          <span className={s.sub}>{b.heading}</span>
        </span>
      ),
    },
    { key: 'period', header: '노출 기간', width: 232, render: (b) => `${b.start} ~ ${b.end}` },
    { key: 'visible', header: '노출', width: 88, align: 'center', render: (b) => <Switch checked={b.visible} onChange={(v) => setVisible([b.id], v)} label={`${b.title} 노출`} hideLabel /> },
  ];

  return (
    <>
      <PageHeader
        title="배너 관리"
        breadcrumb={['사이트 관리', '배너']}
        desc="메인 첫 화면 슬라이드 배너입니다. 순서가 낮을수록 먼저 나옵니다."
        actions={
          <Button size="sm" onClick={onCreate}>
            <Icon name="plus" size={16} /> 배너 등록
          </Button>
        }
      />
      {notice && (
        <div className={s.gap}>
          <Alert tone="success" onClose={() => setNotice(undefined)}>{notice}</Alert>
        </div>
      )}
      <Panel padding="none">
        <FilterBar onSubmit={() => undefined} onReset={() => undefined}>
          <Field label="노출 여부">
            <Select name="visible" placeholder="전체" options={[{ value: 'on', label: '노출' }, { value: 'off', label: '숨김' }]} />
          </Field>
          <Field label="배너명">
            <TextInput name="q" placeholder="배너명으로 검색" />
          </Field>
        </FilterBar>
        <BulkBar count={selected.length} onClear={() => setSelected([])}>
          <Button size="sm" variant="secondary" onClick={() => setVisible(selected, true)}>노출</Button>
          <Button size="sm" variant="secondary" onClick={() => setVisible(selected, false)}>숨김</Button>
          <Button size="sm" variant="danger" onClick={() => setConfirm(true)}>
            <Icon name="trash" size={16} /> 삭제
          </Button>
        </BulkBar>
        <DataTable caption="배너 목록" columns={columns} rows={rows} rowKey={(b) => b.id} selected={selected} onSelectChange={setSelected} />
      </Panel>
      <ConfirmDialog
        open={confirm}
        tone="danger"
        title="배너 삭제"
        message={`선택한 배너 ${selected.length}개를 삭제할까요? 삭제한 배너는 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        onConfirm={remove}
        onCancel={() => setConfirm(false)}
      />
    </>
  );
}

/** 배너 등록·수정 — Field(row) 폼 + 이미지 올리기 + 오류 표시 */
export function BannerFormScreen({ onCancel }: { onCancel?: () => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [visible, setVisible] = useState(true);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (!String(data.get('title') ?? '').trim()) next.title = '배너명을 입력해 주세요.';
    if (!(data.get('image') as File | null)?.size) next.image = '배너 이미지를 올려 주세요.';
    setErrors(next);
    setSaved(!Object.keys(next).length);
    // 실제: 오류가 없으면 await api.post('/banners', data) — FormData 그대로 보내면 파일도 함께 전송
  };

  return (
    <>
      <PageHeader title="배너 등록" breadcrumb={['사이트 관리', '배너', '등록']} />
      {saved && (
        <div className={s.gap}>
          <Alert tone="success" title="저장했습니다">메인 화면에 바로 반영됩니다.</Alert>
        </div>
      )}
      {Object.keys(errors).length > 0 && (
        <div className={s.gap}>
          <Alert tone="danger" title="입력 내용을 확인해 주세요">{Object.values(errors).join(' ')}</Alert>
        </div>
      )}
      <form id="banner-form" onSubmit={submit} noValidate>
        <Panel title="기본 정보">
          <Field label="배너명" layout="row" required help="관리용 이름 — 사이트에는 나오지 않습니다." error={errors.title}>
            <TextInput name="title" maxLength={40} placeholder="예) 대형 방화스크린셔터" />
          </Field>
          <Field label="큰 글" layout="row" help="배너 위 제목 — 두 줄까지 권장">
            <Textarea name="heading" rows={2} placeholder="폭 12,000mm까지,&#10;대형 방화스크린셔터" />
          </Field>
          <Field label="작은 글" layout="row">
            <TextInput name="sub" placeholder="2025년 3월 인정서 발급" />
          </Field>
          <Field label="연결 주소" layout="row" help="'/'로 시작하면 사이트 안 페이지, http로 시작하면 바깥 사이트">
            <TextInput name="link" placeholder="/products/screen" />
          </Field>
          <Field label="링크 열기" layout="row" group>
            <RadioGroup name="target" defaultValue="self" options={[{ value: 'self', label: '현재 창' }, { value: 'blank', label: '새 창' }]} />
          </Field>
        </Panel>
        <Panel title="이미지">
          <Field label="PC 이미지" layout="row" required help="1920 × 600px 권장" error={errors.image}>
            <ImageUpload name="image" ratio="16 / 5" />
          </Field>
          <Field label="모바일 이미지" layout="row" help="없으면 PC 이미지를 잘라서 씁니다. 750 × 900px 권장">
            <ImageUpload name="imageMobile" ratio="5 / 6" maxWidth={240} />
          </Field>
        </Panel>
        <Panel title="노출 설정">
          <Field label="노출 기간" layout="row">
            <div className={s.range}>
              <TextInput type="date" name="start" aria-label="시작일" />
              <span aria-hidden="true">~</span>
              <TextInput type="date" name="end" aria-label="종료일" />
            </div>
          </Field>
          <Field label="순서" layout="row" help="숫자가 작을수록 먼저">
            <TextInput type="number" name="order" min={1} defaultValue={1} className={s.short} />
          </Field>
          <Field label="노출" layout="row">
            <Switch checked={visible} onChange={setVisible} label={visible ? '노출함' : '숨김'} />
          </Field>
        </Panel>
        <FormActions>
          <Button variant="secondary" onClick={onCancel}>취소</Button>
          <Button type="submit" variant="solid">저장</Button>
        </FormActions>
      </form>
    </>
  );
}

/** Q&A 관리 — 목록에서 고르면 오른쪽(모바일은 아래)에 질문 + 답변 작성 */
export function QnaScreen() {
  const [rows, setRows] = useState<Qna[]>(QNAS);
  const [pick, setPick] = useState<Qna>(QNAS[1]);
  const [draft, setDraft] = useState(pick.answer ?? '');
  const [done, setDone] = useState(false);

  const choose = (q: Qna) => {
    setPick(q);
    setDraft(q.answer ?? '');
    setDone(false);
  };
  const save = () => {
    // 실제: await api.put(`/qna/${pick.id}/answer`, { answer: draft, public: pick.public })
    const next = { ...pick, answer: draft };
    setRows((r) => r.map((q) => (q.id === pick.id ? next : q)));
    setPick(next);
    setDone(true);
  };

  return (
    <>
      <PageHeader title="Q&A 관리" breadcrumb={['고객 관리', 'Q&A']} desc="답변을 등록하고, 자주 묻는 질문은 사이트 FAQ에 공개할 수 있습니다." />
      <div className={s.split}>
        <Panel title="질문 목록" padding="none">
          <DataTable
            caption="Q&A 목록"
            rows={rows}
            rowKey={(q) => q.id}
            density="sm"
            onRowClick={choose}
            columns={[
              { key: 'cat', header: '분류', width: 96, render: (q) => <Badge tone="outline">{q.category}</Badge> },
              {
                key: 'q',
                header: '질문',
                render: (q) => (
                  <button type="button" className={s.linkBtn} onClick={() => choose(q)} aria-current={q.id === pick.id || undefined}>
                    {q.question}
                  </button>
                ),
              },
              { key: 'state', header: '답변', width: 88, align: 'center', render: (q) => (q.answer ? <Badge tone="solid">완료</Badge> : <Badge tone="fire">대기</Badge>) },
            ]}
          />
        </Panel>
        <Panel title={`질문 #${pick.id}`} desc={`${pick.author} · ${pick.date}`}>
          <p className={s.question}>{pick.question}</p>
          <Field label="답변" required>
            <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={7} placeholder="답변을 입력하세요" />
          </Field>
          <div className={s.qnaFoot}>
            <Switch
              checked={pick.public}
              onChange={(v) => {
                const next = { ...pick, public: v };
                setPick(next);
                setRows((r) => r.map((q) => (q.id === pick.id ? next : q)));
              }}
              label="사이트 FAQ에 공개"
            />
            <Button size="sm" variant="solid" onClick={save} disabled={!draft.trim()}>답변 저장</Button>
          </div>
          {done && (
            <div className={s.gapTop}>
              <Alert tone="success">답변을 저장했습니다.</Alert>
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}

/** 문의 관리 — 상태 필터 + 상태 변경 + 페이지 */
export function InquiryScreen() {
  const [rows, setRows] = useState<Inquiry[]>(INQUIRIES);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [page, setPage] = useState(1);

  const setState = (state: InquiryState) => {
    // 실제: await api.patch('/inquiries', { ids: selected, state })
    setRows((r) => r.map((q) => (selected.includes(q.id) ? { ...q, state } : q)));
    setSelected([]);
  };

  return (
    <>
      <PageHeader
        title="문의 관리"
        breadcrumb={['고객 관리', '견적·설계문의']}
        actions={
          <Button size="sm" variant="secondary">
            <Icon name="download" size={16} /> 엑셀 내려받기
          </Button>
        }
      />
      <Panel padding="none">
        <FilterBar onSubmit={() => undefined} onReset={() => undefined}>
          <Field label="구분">
            <Select name="type" placeholder="전체" options={[{ value: 'quote', label: '견적' }, { value: 'design', label: '설계' }]} />
          </Field>
          <Field label="상태">
            <Select name="state" placeholder="전체" options={[{ value: '접수', label: '접수' }, { value: '검토중', label: '검토중' }, { value: '답변완료', label: '답변완료' }]} />
          </Field>
          <Field label="기간">
            <TextInput type="date" name="from" />
          </Field>
          <Field label="검색어">
            <TextInput name="q" placeholder="제목·업체명" />
          </Field>
        </FilterBar>
        <BulkBar count={selected.length} onClear={() => setSelected([])}>
          <Button size="sm" variant="secondary" onClick={() => setState('검토중')}>검토중으로</Button>
          <Button size="sm" variant="secondary" onClick={() => setState('답변완료')}>답변완료로</Button>
        </BulkBar>
        <DataTable
          caption="견적·설계 문의 목록"
          rows={rows}
          rowKey={(q) => q.id}
          selected={selected}
          onSelectChange={setSelected}
          columns={[
            { key: 'id', header: '번호', width: 72, align: 'center', render: (q) => q.id },
            { key: 'type', header: '구분', width: 72, align: 'center', render: (q) => <Badge tone="outline">{q.type}</Badge> },
            { key: 'title', header: '제목', render: (q) => <a href={`#inquiry-${q.id}`}>{q.title}</a> },
            { key: 'company', header: '업체 / 연락처', width: 200, render: (q) => <span className={s.two}>{q.company}<span className={s.sub}>{q.phone}</span></span> },
            { key: 'date', header: '접수일', width: 120, align: 'center', render: (q) => q.date },
            { key: 'state', header: '상태', width: 104, align: 'center', render: (q) => <Badge tone={STATE_TONE[q.state]}>{q.state}</Badge> },
          ]}
        />
      </Panel>
      <Pagination page={page} pages={3} onGo={setPage} />
    </>
  );
}
