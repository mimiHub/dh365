import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { COMPANY } from '../../data/site';
import { Button, cx } from '../../components/ui';
import { QuoteHero } from './QuoteHero';
import { Contact } from '../../sections/Contact';
import screenImg from '../../assets/product-screen-shutter.png';
import steelImg from '../../assets/product-steel-shutter.png';
import aluminumImg from '../../assets/card-aluminum-shutter.jpg';
import speedImg from '../../assets/product-speed-door-red.jpg';
import overheadImg from '../../assets/product-overhead-door.jpg';
import s from './QuoteWrite.module.css';

// 제품 선택지 — 제품소개 5분류 + 기타
const PRODUCTS = [
  { value: 'screen', label: '스크린방화셔터', img: screenImg },
  { value: 'steel', label: '철재방화셔터', img: steelImg },
  { value: 'aluminum', label: '알루미늄셔터', img: aluminumImg },
  { value: 'speed-door', label: '스피드도어', img: speedImg },
  { value: 'overhead-door', label: '오버헤드도어', img: overheadImg },
  { value: 'etc', label: '기타', img: undefined },
];

const SIDO = ['서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원특별자치도', '충청북도', '충청남도', '전북특별자치도', '전라남도', '경상북도', '경상남도', '제주특별자치도'];
const PHONE_PREFIX = ['010', '011', '016', '017', '018', '019', '02', '031', '032', '033', '041', '042', '043', '044', '051', '052', '053', '054', '055', '061', '062', '063', '064', '070'];

const MAX_FILES = 5;
const MAX_FILE_MB = 10;
const MAX_MESSAGE = 2000;

type Field = 'name' | 'phone' | 'email' | 'sido' | 'products' | 'message' | 'password' | 'agree';
type Errors = Partial<Record<Field, string>>;

// 검사 순서 = 화면 순서 → 첫 번째 오류 칸으로 포커스를 보낼 때 이 순서를 씀
const ORDER: Field[] = ['name', 'phone', 'email', 'sido', 'products', 'message', 'password', 'agree'];

/** 입력값 검사 — 화면(컴포넌트)과 분리한 순수 함수: 같은 입력이면 항상 같은 결과 → 테스트·재사용 쉬움 */
function validate(fd: FormData): Errors {
  const e: Errors = {};
  const str = (k: string) => String(fd.get(k) ?? '').trim();
  if (!str('name')) e.name = '업체명 또는 이름을 입력해 주세요.';
  const phone = str('phone').replace(/-/g, '');
  if (!phone) e.phone = '연락처를 입력해 주세요.';
  else if (!/^\d{7,8}$/.test(phone)) e.phone = '앞자리를 뺀 숫자 7~8자리로 입력해 주세요.';
  const email = str('email');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = '이메일 형식을 확인해 주세요.';
  if (!str('sido')) e.sido = '설치 지역(시·도)을 선택해 주세요.';
  if (fd.getAll('products').length === 0) e.products = '제품을 하나 이상 선택해 주세요.';
  if (!str('message')) e.message = '문의 내용을 입력해 주세요.';
  if (str('password').length < 4) e.password = '비밀번호를 4자 이상 입력해 주세요.';
  if (!fd.get('agree')) e.agree = '개인정보 수집·이용에 동의해 주세요.';
  return e;
}

/**
 * 견적문의 글쓰기 — /quote/write
 * 입력칸 대부분은 '비제어'(브라우저가 값을 들고 있음) → 제출할 때 FormData로 한 번에 읽음.
 * 화면에 실시간으로 반영해야 하는 것(글자 수, 첨부 파일 목록, 오류 메시지)만 state로 관리.
 */
export function QuoteWritePage() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const [msgLen, setMsgLen] = useState(0);
  const [done, setDone] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs = validate(fd);
    setErrors(errs);
    const first = ORDER.find((k) => errs[k]);
    if (first) {
      // 첫 오류 칸으로 포커스 — 화면을 보는 사람은 위치를, 스크린리더 사용자는 오류 문구(aria-describedby)를 바로 알 수 있게
      const el = e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
      return;
    }
    // 실제 전송(API)은 백엔드 연동 때 — 지금은 접수 완료 화면만
    setDone(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 고친 칸의 오류는 바로 지움 (다시 제출할 때까지 빨간 문구가 남아 있지 않게) — change 이벤트는 form까지 올라오므로(버블링) 한 곳에서 처리
  const onChange = (e: FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name as Field;
    if (!errors[name]) return;
    setErrors((prev) => {
      const next = { ...prev }; // state는 직접 고치지 않고 복사본을 고쳐서 새 객체로 교체
      delete next[name];
      return next;
    });
  };

  const addFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = ''; // 같은 파일을 지웠다가 다시 고를 수 있게 비움
    const tooBig = picked.filter((f) => f.size > MAX_FILE_MB * 1024 * 1024);
    const ok = picked.filter((f) => f.size <= MAX_FILE_MB * 1024 * 1024);
    const next = [...files, ...ok].slice(0, MAX_FILES);
    setFiles(next);
    setFileError(
      tooBig.length ? `${MAX_FILE_MB}MB를 넘는 파일은 제외했습니다: ${tooBig.map((f) => f.name).join(', ')}` : files.length + ok.length > MAX_FILES ? `파일은 최대 ${MAX_FILES}개까지 첨부할 수 있습니다.` : '',
    );
  };

  const removeFile = (i: number) => setFiles((fs) => fs.filter((_, j) => j !== i));

  const err = (k: Field) =>
    errors[k] ? (
      <p id={`err-${k}`} className={s.error}>
        {errors[k]}
      </p>
    ) : null;
  // 오류가 있을 때만 aria-invalid + 오류 문구 연결
  const a11y = (k: Field, hint?: string) => ({
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': [errors[k] && `err-${k}`, hint].filter(Boolean).join(' ') || undefined,
  });

  return (
    <>
      <QuoteHero sub="글쓰기" />

      <div className={cx('container', s.body)}>

        {done ? (
          <div className={s.done} role="status">
            <span className={s.doneIcon} aria-hidden="true">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            </span>
            <h2 className={s.doneTitle}>견적문의가 접수되었습니다</h2>
            <p className={s.doneDesc}>담당자가 내용을 검토한 뒤 남겨 주신 연락처로 안내해 드리겠습니다.<br />급하신 경우 {COMPANY.tel}로 전화 주세요.</p>
            <Button href="/quote" variant="secondary">목록으로</Button>
          </div>
        ) : (
          <form ref={formRef} className={s.form} onSubmit={onSubmit} onChange={onChange} noValidate aria-labelledby="quote-form-title">
            <div className={s.formHead}>
              <h2 id="quote-form-title" className={s.formTitle}>견적문의 작성</h2>
              <p className={s.required}>
                <span className={s.star} aria-hidden="true">*</span> 표시는 필수 입력입니다
              </p>
            </div>

            {/* 한 줄 = 라벨 | 입력. 라벨-입력 연결은 htmlFor/id, 여러 칸 묶음은 fieldset/legend */}
            <div className={s.row}>
              <label htmlFor="q-name" className={s.label}>
                업체명/이름<Req />
              </label>
              <div className={s.field}>
                <input id="q-name" name="name" maxLength={30} autoComplete="organization" placeholder="업체명 또는 담당자 이름" className={s.input} {...a11y('name')} />
                {err('name')}
              </div>
            </div>

            <fieldset className={s.row}>
              <legend className={s.label}>
                연락처<Req />
              </legend>
              <div className={s.field}>
                <div className={s.split}>
                  <label htmlFor="q-phone-prefix" className="sr-only">앞자리</label>
                  <select id="q-phone-prefix" name="phonePrefix" className={cx(s.input, s.select, s.prefix)} defaultValue="010">
                    {PHONE_PREFIX.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                  <label htmlFor="q-phone" className="sr-only">나머지 번호</label>
                  <input id="q-phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-local" placeholder="‘-’ 없이 숫자만 입력" className={s.input} {...a11y('phone')} />
                </div>
                {err('phone')}
              </div>
            </fieldset>

            <div className={s.row}>
              <label htmlFor="q-email" className={s.label}>이메일</label>
              <div className={s.field}>
                <input id="q-email" name="email" type="email" autoComplete="email" placeholder="example@company.com" className={s.input} {...a11y('email', 'hint-email')} />
                <p id="hint-email" className={s.hint}>견적서를 메일로도 받으실 수 있습니다.</p>
                {err('email')}
              </div>
            </div>

            <fieldset className={s.row}>
              <legend className={s.label}>
                설치지역<Req />
              </legend>
              <div className={s.field}>
                <div className={s.split2}>
                  <label htmlFor="q-sido" className="sr-only">시·도</label>
                  <select id="q-sido" name="sido" className={cx(s.input, s.select)} defaultValue="" {...a11y('sido')}>
                    <option value="" disabled>시·도 선택</option>
                    {SIDO.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                  <label htmlFor="q-sigungu" className="sr-only">시·군·구</label>
                  <input id="q-sigungu" name="sigungu" placeholder="시·군·구 (예: 과천시)" className={s.input} />
                </div>
                {err('sido')}
              </div>
            </fieldset>

            <fieldset className={s.row} {...(errors.products ? { 'aria-describedby': 'err-products' } : {})}>
              <legend className={s.label}>
                제품선택<Req />
                <span className={s.labelSub}>복수 선택 가능</span>
              </legend>
              <div className={s.field}>
                {/* 진짜 체크박스를 카드 안에 두고 모양만 바꿈 → 키보드(Tab·Space)·스크린리더가 그대로 동작 */}
                <ul className={s.products}>
                  {PRODUCTS.map((p) => (
                    <li key={p.value}>
                      <label className={s.product}>
                        <input type="checkbox" name="products" value={p.value} className={s.productCheck} />
                        <span className={cx(s.productImg, !p.img && s.productEtc)}>
                          {p.img ? (
                            <img src={p.img} alt="" />
                          ) : (
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                              <circle cx="5" cy="12" r="1.2" />
                              <circle cx="12" cy="12" r="1.2" />
                              <circle cx="19" cy="12" r="1.2" />
                            </svg>
                          )}
                          <span className={s.productTick} aria-hidden="true">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m5 12.5 4.5 4.5L19 7.5" />
                            </svg>
                          </span>
                        </span>
                        <span className={s.productName}>{p.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                {err('products')}
              </div>
            </fieldset>

            <fieldset className={s.row}>
              <legend className={s.label}>
                설치 규격
                <span className={s.labelSub}>아시는 만큼만</span>
              </legend>
              <div className={s.field}>
                <div className={s.size}>
                  <label className={s.unit}>
                    <span className="sr-only">폭</span>
                    <input name="width" inputMode="numeric" placeholder="폭" className={s.input} />
                    <span aria-hidden="true">mm</span>
                  </label>
                  <span className={s.times} aria-hidden="true">×</span>
                  <label className={s.unit}>
                    <span className="sr-only">높이</span>
                    <input name="height" inputMode="numeric" placeholder="높이" className={s.input} />
                    <span aria-hidden="true">mm</span>
                  </label>
                  <label className={cx(s.unit, s.qty)}>
                    <span className="sr-only">수량</span>
                    <input name="qty" type="number" min={1} inputMode="numeric" placeholder="수량" className={s.input} />
                    <span aria-hidden="true">개소</span>
                  </label>
                </div>
                <p className={s.hint}>규격을 모르시면 비워 두셔도 됩니다. 현장 확인 후 안내해 드립니다.</p>
              </div>
            </fieldset>

            <div className={s.row}>
              <span className={s.label} id="files-label">첨부자료</span>
              <div className={s.field}>
                <div className={s.fileBox}>
                  {/* 실제 file input은 숨기고 label이 버튼 역할 — 모양을 자유롭게 바꾸는 표준 방법 */}
                  <input ref={fileInput} id="q-files" type="file" multiple accept="image/*,.pdf,.dwg,.dxf,.hwp,.doc,.docx,.xls,.xlsx" className="sr-only" onChange={addFiles} aria-describedby="hint-files" disabled={files.length >= MAX_FILES} />
                  <label htmlFor="q-files" className={cx(s.fileBtn, files.length >= MAX_FILES && s.fileBtnOff)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m20 11.5-8.2 8.2a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8" />
                    </svg>
                    파일 선택
                  </label>
                  <span id="hint-files" className={s.fileHint}>
                    도면·현장 사진 등 · 최대 {MAX_FILES}개, 개당 {MAX_FILE_MB}MB
                  </span>
                </div>
                {files.length > 0 && (
                  <ul className={s.fileList} aria-label="첨부한 파일">
                    {files.map((f, i) => (
                      <li key={`${f.name}-${i}`} className={s.fileItem}>
                        <span className={s.fileName}>{f.name}</span>
                        <span className={s.fileSize}>{(f.size / 1024 / 1024).toFixed(1)}MB</span>
                        <button type="button" className={s.fileRemove} onClick={() => removeFile(i)} aria-label={`${f.name} 삭제`}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                            <path d="M6 6l12 12M18 6 6 18" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {fileError && <p className={s.error}>{fileError}</p>}
              </div>
            </div>

            <div className={s.row}>
              <label htmlFor="q-message" className={s.label}>
                문의사항<Req />
              </label>
              <div className={s.field}>
                <textarea
                  id="q-message"
                  name="message"
                  rows={6}
                  maxLength={MAX_MESSAGE}
                  placeholder={'설치 장소(용도), 희망 일정, 기존 셔터 교체 여부 등을 적어 주세요.'}
                  className={cx(s.input, s.textarea)}
                  onChange={(e) => setMsgLen(e.target.value.length)}
                  {...a11y('message', 'hint-message')}
                />
                <p id="hint-message" className={s.counter} aria-live="polite">
                  {msgLen.toLocaleString()} / {MAX_MESSAGE.toLocaleString()}
                </p>
                {err('message')}
              </div>
            </div>

            <div className={s.row}>
              <label htmlFor="q-password" className={s.label}>
                비밀번호<Req />
              </label>
              <div className={s.field}>
                <input id="q-password" name="password" type="password" autoComplete="new-password" placeholder="4자 이상" className={cx(s.input, s.short)} {...a11y('password', 'hint-password')} />
                <p id="hint-password" className={s.hint}>비밀글로 등록됩니다. 글을 확인·수정할 때 필요합니다.</p>
                {err('password')}
              </div>
            </div>

            {/* 개인정보 동의 — 전문은 접었다 펴기(details/summary: JS 없이 동작하는 기본 아코디언) */}
            <div className={s.agreeBox}>
              <label className={s.agree}>
                <input type="checkbox" name="agree" className={s.agreeCheck} {...a11y('agree')} />
                <span>
                  개인정보 수집·이용에 동의합니다<Req />
                </span>
              </label>
              <details className={s.policy}>
                <summary>내용 보기</summary>
                {/* [가안] 실제 문구는 회사 개인정보처리방침에 맞춰 확인 필요 */}
                <dl>
                  <dt>수집 항목</dt>
                  <dd>업체명/이름, 연락처, 이메일, 설치지역, 첨부자료</dd>
                  <dt>이용 목적</dt>
                  <dd>견적 산출 및 상담 안내</dd>
                  <dt>보유 기간</dt>
                  <dd>상담 완료 후 1년 (관계 법령에 따라 보존이 필요한 경우 그 기간)</dd>
                </dl>
                <p>동의를 거부하실 수 있으나, 거부 시 견적문의 접수가 어렵습니다.</p>
              </details>
              {err('agree')}
            </div>

            <div className={s.submitRow}>
              <Button href="/quote" variant="secondary" size="lg">취소</Button>
              <Button type="submit" size="lg" arrow>견적문의 등록</Button>
            </div>
          </form>
        )}
      </div>

      {/* 견적상담 — 제품소개 하단과 같은 섹션 (대표번호 + 문의 카드 3열) */}
      <Contact />
    </>
  );
}

function Req() {
  return (
    <>
      <span className={s.star} aria-hidden="true">*</span>
      <span className="sr-only">(필수)</span>
    </>
  );
}
