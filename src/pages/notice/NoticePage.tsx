// 히어로 사진: 노트·만년필 — 'Notes' 글씨와 펜촉이 보이게 세로 62% 지점 기준
import heroImg from '../../assets/notice-hero.jpg';
import { NOTICES, noticePath } from '../../data/notices';
import { useListQuery } from '../../hooks/useListQuery';
import { Icon, Pagination, cx } from '../../components/ui';
import { BoardTable, CommentCount, EmptyState, ListHead, SearchBox, StatusChip, SubHero } from '../../components/page';
import s from './Notice.module.css';

const PAGE_SIZE = 10;
// 고정 공지는 맨 위로 (나머지는 데이터 순서 = 최신순 그대로). sort는 원본을 바꾸므로 복사본에서
const ITEMS = [...NOTICES].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned));

/**
 * 공지사항 — /notice (?q= &page=)  고객센터
 * 자료실·견적문의와 같은 조각(목록 머리·검색·게시판 표·페이지). 다른 점은 표에 넘기는 props뿐:
 * - highlight: 고정 공지 줄 강조
 * - 번호 칸: 고정 공지는 '공지' 칩, 모바일에서도 이름 없이 칩만(mobile 함수)
 * - title.after: 댓글 수
 */
export function NoticePage() {
  const lq = useListQuery({ items: ITEMS, pageSize: PAGE_SIZE, path: noticePath() });

  return (
    <>
      <SubHero en="Notice" title="공지사항" desc="대한방화의 인정 취득·제품·회사 소식을 알려 드립니다." image={heroImg} position="50% 62%" />

      <div className={cx('container', s.body)}>
        <ListHead ref={lq.topRef} title="공지사항" total={lq.list.length} q={lq.q} page={lq.page} pages={lq.pages}>
          <SearchBox key={lq.q} id="notice-q" label="공지 제목 검색" placeholder="제목으로 검색" defaultValue={lq.q} onSearch={lq.search} />
        </ListHead>

        {lq.shown.length ? (
          <BoardTable
            caption="공지사항 목록 — 번호, 제목, 조회수"
            rows={lq.shown}
            rowKey={(it) => it.id}
            motionKey={`${lq.q}|${lq.page}`}
            highlight={(it) => !!it.pinned}
            title={(it) => ({
              to: noticePath(it.id),
              text: it.title,
              state: { from: lq.here },
              icon: <Icon name="file" size={15} />,
              after: <CommentCount count={it.comments ?? 0} />,
            })}
            columns={[
              {
                key: 'no',
                header: '번호',
                width: 96,
                cell: (it) => (it.pinned ? <StatusChip solid>공지</StatusChip> : it.id),
                mobile: (it) => (it.pinned ? 'badge' : 'meta'),
              },
              { key: 'title', header: '제목', cell: () => null },
              { key: 'views', header: '조회', width: 120, cell: (it) => it.views.toLocaleString(), mobile: 'meta' },
            ]}
          />
        ) : (
          <EmptyState noun="공지" q={lq.q} resetTo={noticePath()} />
        )}

        <Pagination page={lq.page} pages={lq.pages} onGo={lq.goPage} />
      </div>
    </>
  );
}
