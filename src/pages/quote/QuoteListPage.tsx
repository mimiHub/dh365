import type { Board } from './boards';
import { useListQuery } from '../../hooks/useListQuery';
import { Button, Icon, Pagination, cx } from '../../components/ui';
import { BoardTable, EmptyState, ListHead, SearchBox, StatusChip, SubHero } from '../../components/page';
import s from './QuoteList.module.css';

const PAGE_SIZE = 10;

/**
 * 문의 목록 — /quote · /design (?q=검색어 &page=번호)
 * 목록 규칙(useListQuery)·머리(ListHead)·검색(SearchBox)·표(BoardTable)는 자료실과 같은 공용 조각.
 * 이 파일에는 '견적문의만의 것'(비밀글 안내, 글쓰기 버튼, 칸 구성)만 남음
 */
export function QuoteListPage({ board }: { board: Board }) {
  const lq = useListQuery({ items: board.items, pageSize: PAGE_SIZE, path: board.path });

  return (
    <>
      <SubHero en={board.en} title={board.title} desc={board.desc} sub="목록" />

      <div className={cx('container', s.body)}>
        <ListHead ref={lq.topRef} title={board.title} total={lq.list.length} q={lq.q} page={lq.page} pages={lq.pages}>
          <SearchBox key={lq.q} id="quote-q" label="제목 검색" placeholder="제목으로 검색" defaultValue={lq.q} onSearch={lq.search} />
          <Button href={`${board.path}/write`} className={s.write}>
            <Icon name="pencil" />
            글쓰기
          </Button>
        </ListHead>

        <p className={s.notice}>
          <Icon name="lock" size={16} strokeWidth={2} />
          모든 {board.title}는 비밀글로 등록되어 작성자와 담당자만 볼 수 있습니다.
        </p>

        {lq.shown.length ? (
          <BoardTable
            caption={`${board.title} 목록 — 번호, 제목, 처리 상태, 글쓴이, 조회수`}
            rows={lq.shown}
            rowKey={(it) => it.id}
            motionKey={`${lq.q}|${lq.page}`}
            // 상세 — 비밀글이면 비밀번호 확인부터. state.from: 상세의 '목록'이 보던 검색·페이지로 돌아오게
            title={(it) => ({ to: `${board.path}/${it.id}`, text: it.title, secret: it.secret, state: { from: lq.here } })}
            columns={[
              { key: 'no', header: '번호', width: 96, cell: (it) => it.id, mobile: 'hide' },
              { key: 'title', header: '제목', cell: () => null },
              { key: 'state', header: '상태', width: 120, cell: (it) => <StatusChip done={it.answered}>{it.answered ? '답변완료' : '접수'}</StatusChip>, mobile: 'badge' },
              { key: 'author', header: '글쓴이', width: 180, cell: (it) => it.author, mobile: 'meta' },
              { key: 'views', header: '조회', width: 88, cell: (it) => it.views, mobile: 'meta' },
            ]}
          />
        ) : (
          <EmptyState noun={board.title} q={lq.q} resetTo={board.path} />
        )}

        <Pagination page={lq.page} pages={lq.pages} onGo={lq.goPage} />
      </div>
    </>
  );
}
