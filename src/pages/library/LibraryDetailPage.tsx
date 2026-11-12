import { Navigate, useLocation, useParams } from 'react-router-dom';
import { LIBRARY, LIBRARY_CATEGORIES, libraryPath } from '../../data/library';
import { Button, Media, cx } from '../../components/ui';
import { AttachmentList, PostHeader, PostNav, StatusChip, SubHero } from '../../components/page';
import s from './Library.module.css';

/**
 * 자료실 상세 — /library/:category/:id
 * 원본 글의 본문·첨부는 아직 못 옮김 → 화면 확인용 예시 (실제는 서버에서)
 */
export function LibraryDetailPage() {
  const { category, id } = useParams();
  const location = useLocation();
  const cat = LIBRARY_CATEGORIES.find((c) => c.key === category);
  const items = LIBRARY.filter((it) => it.category === cat?.key);
  const idx = items.findIndex((it) => it.id === Number(id));
  const item = items[idx];
  if (!cat || !item) return <Navigate to={cat ? libraryPath(cat.key) : '/library'} replace />;

  const backTo = (location.state as { from?: string } | null)?.from ?? libraryPath(cat.key);
  // 목록이 최신순이라 '이전 글' = 목록에서 아래(번호 작은 것), '다음 글' = 위
  const newer = items[idx - 1];
  const older = items[idx + 1];
  const isVideo = cat.key === 'video';

  return (
    <>
      <SubHero en="Library" title="자료실" sub={cat.name} />
      <div className={cx('container', s.detailBody)}>
        <article aria-labelledby="post-title">
          <PostHeader badges={<StatusChip done>{cat.name}</StatusChip>} no={item.id} title={item.title} meta={[`조회 ${item.views.toLocaleString()}`]} />

          <p className={s.sample}>목업 예시 내용입니다. 실제 본문과 첨부파일은 서버에서 불러옵니다.</p>

          {isVideo && (
            <section className={s.section} aria-label="동영상">
              <Media className={s.video} label="VIDEO — 동영상" />
            </section>
          )}

          <section className={s.section} aria-labelledby="files-title">
            <h3 id="files-title" className={s.sectionTitle}>첨부파일</h3>
            <AttachmentList
              items={[
                { name: `${item.title}.pdf`, size: '2.4MB' },
                { name: `${item.title}.dwg`, size: '1.1MB' },
              ]}
            />
          </section>

          <section className={s.section} aria-label="내용">
            <p className={s.text}>{`${item.title} 자료입니다.\n설계·감리 검토용으로 내려받아 사용하세요. 현장 조건에 맞는 상세 검토는 설계문의로 남겨 주세요.`}</p>
          </section>

          <PostNav
            label="이전·다음 자료"
            newer={newer && { to: libraryPath(cat.key, newer.id), title: newer.title }}
            older={older && { to: libraryPath(cat.key, older.id), title: older.title }}
            from={backTo}
          />

          <div className={s.actions}>
            <Button href={backTo} variant="secondary">목록으로</Button>
          </div>
        </article>
      </div>
    </>
  );
}
