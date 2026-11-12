'use client';

// 히어로 사진: 노트·만년필 — 'Notes' 글씨와 펜촉이 보이게 세로 62% 지점 기준
const heroImg = '/images/notice-hero.jpg';
import { Navigate, useLocation, useParams } from '@/lib/router';
import { NOTICES, noticePath } from '../../data/notices';
import { Button, cx } from '../../components/ui';
import { PostHeader, PostNav, StatusChip, SubHero } from '../../components/page';
import s from './Notice.module.css';

const ITEMS = [...NOTICES].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned)); // 목록과 같은 순서 → 이전·다음이 목록과 맞음

/** 공지사항 상세 — /notice/:id */
export function NoticeDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const idx = ITEMS.findIndex((it) => it.id === Number(id));
  const item = ITEMS[idx];
  if (!item) return <Navigate to={noticePath()} replace />;

  const backTo = (location.state as { from?: string } | null)?.from ?? noticePath();
  const newer = ITEMS[idx - 1];
  const older = ITEMS[idx + 1];
  const meta = [item.date, `조회 ${item.views.toLocaleString()}`, item.comments ? `댓글 ${item.comments}` : undefined].filter(Boolean) as string[];

  return (
    <>
      <SubHero en="Notice" title="공지사항" sub="상세" image={heroImg} position="50% 62%" />
      <div className={cx('container', s.detailBody)}>
        <article aria-labelledby="post-title">
          <PostHeader
            badges={item.pinned ? <StatusChip solid>공지</StatusChip> : undefined}
            no={item.pinned ? undefined : item.id}
            title={item.title}
            meta={meta}
          />

          {item.body ? (
            <p className={s.text}>{item.body}</p>
          ) : (
            <p className={s.sample}>원본 본문을 아직 옮기지 못했습니다. 실제 본문은 서버에서 불러옵니다.</p>
          )}

          <PostNav
            label="이전·다음 공지"
            newer={newer && { to: noticePath(newer.id), title: newer.title }}
            older={older && { to: noticePath(older.id), title: older.title }}
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
