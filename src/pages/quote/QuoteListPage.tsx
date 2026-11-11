import { useRef, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { QUOTES } from '../../data/quotes';
import { Button, Pagination, cx } from '../../components/ui';
import { QuoteHero } from './QuoteHero';
import s from './QuoteList.module.css';

const PAGE_SIZE = 10;
const squash = (t: string) => t.replace(/\s+/g, '').toLowerCase(); // 띄어쓰기 무시 검색

/**
 * 견적문의 목록 — /quote (?q=검색어 &page=번호)
 * 시공사례 페이지와 같은 방식: 검색어·페이지를 주소에 담고, 목록은 주소에서 계산
 */
export function QuoteListPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const top = useRef<HTMLDivElement>(null);

  const q = (params.get('q') ?? '').trim();
  const list = q ? QUOTES.filter((it) => squash(it.title).includes(squash(q))) : QUOTES;
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(params.get('page')) || 1), pages);
  const shown = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const go = (next: { q?: string; page?: number }) => {
    const sp = new URLSearchParams();
    const nq = next.q ?? q;
    if (nq) sp.set('q', nq);
    if (next.page && next.page > 1) sp.set('page', String(next.page));
    const qs = sp.toString();
    navigate({ pathname: '/quote', search: qs ? `?${qs}` : '' }, { state: { keepScroll: true } });
  };

  const onSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    go({ q: String(new FormData(e.currentTarget).get('q') ?? '').trim(), page: 1 });
  };

  const goPage = (n: number) => {
    go({ page: n });
    top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <QuoteHero sub="목록" />

      <div className={cx('container', s.body)}>
        <div className={s.toolbar} ref={top}>
          <h2 className={s.summary} aria-live="polite">
            견적문의
            <span className={s.total}>
              {q && <>‘{q}’ 검색 결과 </>}총 <strong>{list.length}</strong>건 · {page} / {pages} 페이지
            </span>
          </h2>

          <div className={s.actions}>
            <form key={q} className={s.search} role="search" onSubmit={onSearch}>
              <label htmlFor="quote-q" className="sr-only">제목 검색</label>
              <input id="quote-q" name="q" type="search" defaultValue={q} placeholder="제목으로 검색" className={s.searchInput} />
              <button type="submit" className={s.searchBtn} aria-label="검색">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="m20 20-4.2-4.2" />
                </svg>
              </button>
            </form>
            <Button href="/quote/write" className={s.write}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
                <path d="m13.5 6.5 4 4" />
              </svg>
              글쓰기
            </Button>
          </div>
        </div>

        <p className={s.notice}>
          <LockIcon />
          모든 견적문의는 비밀글로 등록되어 작성자와 담당자만 볼 수 있습니다.
        </p>

        {shown.length ? (
          // 게시판 = 진짜 표(table) — 열 머리(th)가 있어 스크린리더가 '번호 215, 제목 …'처럼 칸 이름과 함께 읽어 줌
          <table className={s.table}>
            <caption className="sr-only">견적문의 목록 — 번호, 제목, 처리 상태, 글쓴이, 조회수</caption>
            <colgroup>
              <col className={s.colNo} />
              <col />
              <col className={s.colState} />
              <col className={s.colAuthor} />
              <col className={s.colViews} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">번호</th>
                <th scope="col">제목</th>
                <th scope="col">상태</th>
                <th scope="col">글쓴이</th>
                <th scope="col">조회</th>
              </tr>
            </thead>
            {/* key: 검색·페이지가 바뀌면 목록을 새로 그려 등장 모션 재생 */}
            <tbody key={`${q}|${page}`}>
              {shown.map((it, i) => (
                <tr key={it.id} style={{ animationDelay: `${i * 30}ms` }}>
                  <td className={s.no}>{it.id}</td>
                  <td className={s.titleCell}>
                    {/* 상세(비밀번호 확인) 화면이 생기면 <Link to={`/quote/${it.id}`}>로 바꿀 자리 */}
                    <span className={s.title}>
                      {it.secret && (
                        <span className={s.lock}>
                          <LockIcon />
                          <span className="sr-only">비밀글</span>
                        </span>
                      )}
                      <span className={s.titleText}>{it.title}</span>
                    </span>
                  </td>
                  <td className={s.state}>
                    <span className={cx(s.chip, it.answered && s.chipDone)}>{it.answered ? '답변완료' : '접수'}</span>
                  </td>
                  <td className={s.author}>
                    <span className={s.metaLabel}>글쓴이 </span>
                    {it.author}
                  </td>
                  <td className={s.views}>
                    <span className={s.metaLabel}>조회 </span>
                    {it.views}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={s.empty}>
            <p>{q ? <>‘{q}’에 맞는 견적문의가 없습니다.</> : '등록된 견적문의가 없습니다.'}</p>
            {q && (
              <Link to="/quote" state={{ keepScroll: true }} className={s.emptyReset}>
                검색어 지우기
              </Link>
            )}
          </div>
        )}

        <Pagination page={page} pages={pages} onGo={goPage} />
      </div>
    </>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}
