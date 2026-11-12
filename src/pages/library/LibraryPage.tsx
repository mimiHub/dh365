// 히어로 사진: 문서 보관 서가 — 번호표와 손잡이가 보이게 세로 32% 지점 기준
import heroImg from '../../assets/library-hero.jpg';
import { Navigate, useParams } from 'react-router-dom';
import { LIBRARY, LIBRARY_CATEGORIES, libraryPath, type LibraryKey } from '../../data/library';
import { useListQuery } from '../../hooks/useListQuery';
import { Icon, Pagination, cx } from '../../components/ui';
import { BoardTable, CategoryNav, EmptyState, ListHead, SearchBox, SubHero } from '../../components/page';
import s from './Library.module.css';

const PAGE_SIZE = 10;
const NAV = LIBRARY_CATEGORIES.map((c) => ({ key: c.key, name: c.name, to: libraryPath(c.key), count: LIBRARY.filter((it) => it.category === c.key).length }));

/**
 * 자료실 — /library/:category (?q= &page=)
 * 시공사례와 같은 조각(분류 패널·목록 머리·검색), 견적문의와 같은 게시판 표.
 * 원본 사이트처럼 '전체'는 없고 분류 4개 — /library는 첫 분류로
 */
export function LibraryPage() {
  const { category } = useParams();
  const cat = LIBRARY_CATEGORIES.find((c) => c.key === category);
  const key = (cat?.key ?? 'spec') as LibraryKey;
  const items = LIBRARY.filter((it) => it.category === key);
  const lq = useListQuery({ items, pageSize: PAGE_SIZE, path: libraryPath(key) });

  if (!cat) return <Navigate to={libraryPath('spec')} replace />;

  return (
    <>
      <SubHero image={heroImg} position="50% 32%" en="Library" title="자료실" desc="시방서·상세도와 보도자료, 관련법규, 동영상 자료를 모았습니다." withNav />

      <div className={s.band}>
        <CategoryNav items={NAV} current={key} label="자료실 분류" id="library-cats" />

        <div className={cx('container', s.body)}>
          <ListHead ref={lq.topRef} title={<em>{cat.name}</em>} total={lq.list.length} q={lq.q} page={lq.page} pages={lq.pages}>
            {/* key: 분류·검색어가 바뀌면 입력칸을 새로 그려 주소의 검색어와 맞춤 */}
            <SearchBox key={`${key}|${lq.q}`} id="library-q" label="자료 제목 검색" placeholder="자료 제목으로 검색" defaultValue={lq.q} onSearch={lq.search} />
          </ListHead>
          <p className={s.desc}>{cat.desc}</p>

          {lq.shown.length ? (
            <BoardTable
              caption={`${cat.name} 목록 — 번호, 제목, 조회수`}
              rows={lq.shown}
              rowKey={(it) => it.id}
              motionKey={`${key}|${lq.q}|${lq.page}`}
              title={(it) => ({
                to: libraryPath(key, it.id),
                text: it.title,
                state: { from: lq.here },
                icon: <Icon name={key === 'video' ? 'video' : 'file'} size={15} />,
              })}
              columns={[
                { key: 'no', header: '번호', width: 96, cell: (it) => it.id, mobile: 'meta' },
                { key: 'title', header: '제목', cell: () => null },
                { key: 'views', header: '조회', width: 120, cell: (it) => it.views.toLocaleString(), mobile: 'meta' },
              ]}
            />
          ) : (
            <EmptyState noun="자료" q={lq.q} resetTo={libraryPath(key)} />
          )}

          <Pagination page={lq.page} pages={lq.pages} onGo={lq.goPage} />
        </div>
      </div>
    </>
  );
}
