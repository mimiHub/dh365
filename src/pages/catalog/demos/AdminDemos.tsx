import { useState } from 'react';
import {
  AdminShell,
  BulkBar,
  Checkbox,
  ConfirmDialog,
  DataTable,
  Field,
  FormActions,
  Modal,
  Panel,
  RadioGroup,
  Select,
  Switch,
  Textarea,
  TextInput,
  type AdminMenuItem,
} from '../../../components/admin';
import { Badge, Button, Icon } from '../../../components/ui';
import { BannerFormScreen, BannerListScreen, DashboardScreen, InquiryScreen, QnaScreen } from '../examples/screens';
import s from '../Catalog.module.css';

// 상태가 있는 데모 — entries/admin.tsx에서 씀

const MENU: AdminMenuItem[] = [
  { key: 'dashboard', label: '대시보드', icon: 'dashboard' },
  { key: 'banner', label: '배너 관리', icon: 'megaphone' },
  { key: 'qna', label: 'Q&A 관리', icon: 'help', badge: 2 },
  { key: 'inquiry', label: '문의 관리', icon: 'inbox', badge: 3 },
];

const ROWS = [
  { id: 3, title: '대형 방화스크린셔터', state: '노출' },
  { id: 2, title: '철재방화셔터', state: '노출' },
  { id: 1, title: '내풍압셔터', state: '숨김' },
];

export function ShellDemo() {
  const [cur, setCur] = useState('dashboard');
  const [form, setForm] = useState(false);
  const screen =
    cur === 'banner' ? (form ? <BannerFormScreen onCancel={() => setForm(false)} /> : <BannerListScreen onCreate={() => setForm(true)} />) : cur === 'qna' ? <QnaScreen /> : cur === 'inquiry' ? <InquiryScreen /> : <DashboardScreen />;
  return (
    <AdminShell
      mode="embed"
      menu={MENU}
      current={cur}
      onSelect={(k) => {
        setCur(k);
        setForm(false);
      }}
      user="관리자 님"
      onLogout={() => undefined}
    >
      {screen}
    </AdminShell>
  );
}

export function TableDemo() {
  const [selected, setSelected] = useState<(string | number)[]>([2]);
  return (
    <Panel padding="none">
      <BulkBar count={selected.length} onClear={() => setSelected([])}>
        <Button size="sm" variant="secondary">숨김</Button>
        <Button size="sm" variant="danger">삭제</Button>
      </BulkBar>
      <DataTable
        caption="데모 배너 목록"
        rows={ROWS}
        rowKey={(r) => r.id}
        selected={selected}
        onSelectChange={setSelected}
        columns={[
          { key: 'id', header: '번호', width: 72, align: 'center', render: (r) => r.id },
          { key: 'title', header: '배너명', render: (r) => <a href="#data-table">{r.title}</a> },
          { key: 'state', header: '상태', width: 96, align: 'center', render: (r) => <Badge tone={r.state === '노출' ? 'solid' : 'neutral'}>{r.state}</Badge> },
        ]}
      />
    </Panel>
  );
}

export function FormDemo() {
  const [on, setOn] = useState(true);
  return (
    <div className={s.formDemo}>
      <Field label="배너명" required help="40자 이내">
        <TextInput placeholder="예) 대형 방화스크린셔터" maxLength={40} />
      </Field>
      <Field label="연결 주소" error="'/' 또는 http로 시작해야 합니다.">
        <TextInput defaultValue="products/screen" />
      </Field>
      <Field label="분류">
        <Select placeholder="선택하세요" options={[{ value: 'product', label: '제품' }, { value: 'case', label: '시공' }]} />
      </Field>
      <Field label="내용">
        <Textarea rows={3} placeholder="내용을 입력하세요" />
      </Field>
      <Field label="링크 열기" group>
        <RadioGroup name="demo-target" defaultValue="self" options={[{ value: 'self', label: '현재 창' }, { value: 'blank', label: '새 창' }]} />
      </Field>
      <Field label="옵션" group>
        <div className={s.row}>
          <Checkbox label="FAQ에 공개" defaultChecked />
          <Checkbox label="메인 노출" />
        </div>
      </Field>
      <Field label="노출">
        <Switch checked={on} onChange={setOn} label={on ? '노출함' : '숨김'} />
      </Field>
      <FormActions>
        <Button variant="secondary" size="sm">취소</Button>
        <Button variant="solid" size="sm">저장</Button>
      </FormActions>
    </div>
  );
}

export function RowFormDemo() {
  return (
    <Panel title="기본 정보">
      <Field label="배너명" layout="row" required>
        <TextInput placeholder="예) 대형 방화스크린셔터" />
      </Field>
      <Field label="노출 기간" layout="row" help="비우면 계속 노출">
        <div className={s.row}>
          <TextInput type="date" aria-label="시작일" />
          <TextInput type="date" aria-label="종료일" />
        </div>
      </Field>
    </Panel>
  );
}

export function ModalDemo() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState('');
  return (
    <div className={s.col}>
      <div className={s.row}>
        <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>모달 열기</Button>
        <Button size="sm" variant="danger" onClick={() => setConfirm(true)}>
          <Icon name="trash" size={16} /> 삭제 확인 열기
        </Button>
      </div>
      {done && <p className={s.note}>{done}</p>}
      <Modal open={open} onClose={() => setOpen(false)} title="배너 미리보기" footer={<Button size="sm" variant="solid" onClick={() => setOpen(false)}>닫기</Button>}>
        <p className={s.note}>Esc · 바깥 클릭 · 닫기 버튼으로 닫힙니다. 열려 있는 동안 Tab은 창 안에서만 돕니다.</p>
      </Modal>
      <ConfirmDialog
        open={confirm}
        tone="danger"
        title="배너 삭제"
        message="선택한 배너 1개를 삭제할까요? 되돌릴 수 없습니다."
        confirmLabel="삭제"
        onConfirm={() => {
          setConfirm(false);
          setDone('삭제했습니다 (데모)');
        }}
        onCancel={() => setConfirm(false)}
      />
    </div>
  );
}
