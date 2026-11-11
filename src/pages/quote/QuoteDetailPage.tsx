import { useRef, useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { MOCK_PASSWORD, quoteDetailOf, type QuoteItem } from '../../data/quotes';
import type { Board } from './boards';
import { Button, cx } from '../../components/ui';
import { QuoteHero } from './QuoteHero';
import s from './QuoteDetail.module.css';

// 한 번 연 비밀글은 이 탭을 닫기 전까지 다시 묻지 않음 (sessionStorage: 탭 단위, 닫으면 사라짐)
const keyOf = (board: Board) => `dh365-${board.key}-unlocked`; // 게시판마다 따로 (견적 215번 ≠ 설계 215번)
const readUnlocked = (KEY: string, id: number) => {
  try {
    return (JSON.parse(sessionStorage.getItem(KEY) ?? '[]') as number[]).includes(id);
  } catch {
    return false; // 저장소를 못 쓰는 환경(사생활 보호 모드 등)이면 매번 물음
  }
};
const saveUnlocked = (KEY: string, id: number) => {
  try {
    const list = JSON.parse(sessionStorage.getItem(KEY) ?? '[]') as number[];
    sessionStorage.setItem(KEY, JSON.stringify([...new Set([...list, id])]));
  } catch {
    /* 저장 못 해도 지금 화면은 열림 */
  }
};

/**
 * 문의 상세 — /quote/:id · /design/:id
 * 비밀글이면 비밀번호 확인 → 맞으면 글 내용·답변.
 * key={id}: 다른 글로 이동하면 컴포넌트를 새로 만들어 '열림' 상태·입력값이 이전 글에서 넘어오지 않게
 */
export function QuoteDetailPage({ board }: { board: Board }) {
  const { id } = useParams();
  const item = board.items.find((q) => q.id === Number(id));
  if (!item) return <Navigate to={board.path} replace />;
  return <QuoteDetail key={item.id} board={board} item={item} />;
}

function QuoteDetail({ board, item }: { board: Board; item: QuoteItem }) {
  const location = useLocation();
  // 목록에서 왔으면 보던 검색·페이지로, 주소로 바로 왔으면 목록 첫 페이지로
  const backTo = (location.state as { from?: string } | null)?.from ?? board.path;
  const [unlocked, setUnlocked] = useState(() => !item.secret || readUnlocked(keyOf(board), item.id));

  return (
    <>
      <QuoteHero board={board} sub="상세" />
      <div className={cx('container', s.body)}>
        {unlocked ? (
          <Post item={item} backTo={backTo} />
        ) : (
          <Gate
            item={item}
            backTo={backTo}
            onOpen={() => {
              saveUnlocked(keyOf(board), item.id);
              setUnlocked(true);
            }}
          />
        )}
      </div>
    </>
  );
}

/** 비밀번호 확인 */
function Gate({ item, backTo, onOpen }: { item: QuoteItem; backTo: string; onOpen: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pw = String(new FormData(e.currentTarget).get('password') ?? '');
    if (!pw) {
      setError('비밀번호를 입력해 주세요.');
      input.current?.focus();
      return;
    }
    // ⚠ 목업용 비교. 실제로는 비밀번호를 서버로 보내 확인하고, 맞을 때만 서버가 글 내용을 내려 줘야 함
    //   (화면 코드에 비밀번호나 글 내용이 들어 있으면 누구나 개발자도구로 볼 수 있음)
    if (pw !== MOCK_PASSWORD) {
      setError('비밀번호가 일치하지 않습니다. 다시 입력해 주세요.');
      input.current?.select(); // 틀린 값을 전체 선택 → 바로 다시 입력
      return;
    }
    onOpen();
  };

  return (
    <section className={s.gate} aria-labelledby="gate-title">
      <span className={s.gateIcon} aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="10.5" width="14" height="10" rx="2" />
          <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
          <path d="M12 14.5v2.5" />
        </svg>
      </span>
      <h2 id="gate-title" className={s.gateTitle}>비밀글입니다</h2>
      <p className={s.gateDesc}>글을 쓸 때 입력한 비밀번호를 입력해 주세요.</p>

      <dl className={s.gatePost}>
        <div>
          <dt>제목</dt>
          <dd>{item.title}</dd>
        </div>
        <div>
          <dt>글쓴이</dt>
          <dd>{item.author}</dd>
        </div>
      </dl>

      <form className={s.gateForm} onSubmit={onSubmit} noValidate>
        <label htmlFor="gate-pw" className="sr-only">비밀번호</label>
        <input
          ref={input}
          id="gate-pw"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          placeholder="비밀번호"
          className={s.gateInput}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'gate-err' : 'gate-hint'}
          onChange={() => error && setError('')}
        />
        <Button type="submit" className={s.gateBtn}>확인</Button>
      </form>
      {error ? (
        <p id="gate-err" className={s.gateError} role="alert">{error}</p>
      ) : (
        <p id="gate-hint" className={s.gateHint}>목업 확인용 비밀번호: {MOCK_PASSWORD}</p>
      )}

      <Link to={backTo} className={s.back}>목록으로</Link>
    </section>
  );
}

/** 글 내용 + 답변 */
function Post({ item, backTo }: { item: QuoteItem; backTo: string }) {
  const d = quoteDetailOf(item);
  const rows: [string, string][] = [
    ['업체명/이름', item.author],
    ['연락처', d.contact],
    ['이메일', d.email || '—'],
    ['설치지역', d.region],
    ['제품', d.products.join(', ')],
    ['설치 규격', d.size],
  ];

  return (
    <article className={s.post} aria-labelledby="post-title">
      <header className={s.postHead}>
        <div className={s.postTop}>
          <span className={cx(s.chip, item.answered && s.chipDone)}>{item.answered ? '답변완료' : '접수'}</span>
          <span className={s.no}>No. {item.id}</span>
        </div>
        <h2 id="post-title" className={s.postTitle}>{item.title}</h2>
        <p className={s.postMeta}>
          <span>글쓴이 {item.author}</span>
          <span>조회 {item.views}</span>
        </p>
      </header>

      <p className={s.sample}>목업 예시 내용입니다. 실제 글 내용은 비밀번호 확인 후 서버에서 불러옵니다.</p>

      <dl className={s.info}>
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
        <div>
          <dt>첨부자료</dt>
          <dd>
            <ul className={s.files}>
              {d.files.map((f) => (
                <li key={f}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m20 11.5-8.2 8.2a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>동영상</dt>
          <dd>
            {d.video ? (
              <ul className={s.files}>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="5" width="13" height="14" rx="2" />
                    <path d="m16 10 5-3v10l-5-3" />
                  </svg>
                  {d.video}
                </li>
              </ul>
            ) : (
              '—'
            )}
          </dd>
        </div>
      </dl>

      <section className={s.content} aria-label="문의 내용">
        <h3 className={s.contentTitle}>문의 내용</h3>
        {/* pre-line: 글쓴이가 넣은 줄바꿈을 그대로 보여 줌 (HTML로 넣지 않아 안전) */}
        <p className={s.contentBody}>{d.body}</p>
      </section>

      {d.answer ? (
        <section className={s.answer} aria-labelledby="answer-title">
          <h3 id="answer-title" className={s.answerTitle}>
            <span className={s.answerBadge}>답변</span>
            {d.answer.by}
          </h3>
          <p className={s.contentBody}>{d.answer.body}</p>
        </section>
      ) : (
        <p className={s.waiting}>담당자가 내용을 확인하고 있습니다. 답변이 등록되면 남겨 주신 연락처로도 안내해 드립니다.</p>
      )}

      <div className={s.actions}>
        <Button href={backTo} variant="secondary">목록으로</Button>
      </div>
    </article>
  );
}
