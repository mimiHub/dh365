import { useState } from 'react';
import { COMPANY } from '../data/site';
import { FAQS, FAQ_CATEGORIES, type FaqCategory } from '../data/faq';
import { Button, SmartLink, Tabs, cx, type TabItem } from '../components/ui';
import { QuoteHero } from './quote/QuoteHero';
import s from './FaqPage.module.css';

type Filter = 'all' | FaqCategory;
const TABS: TabItem<Filter>[] = [{ value: 'all', label: '전체' }, ...FAQ_CATEGORIES];
const HERO = { en: 'FAQ', title: '자주 묻는 질문', desc: '제품·견적·시공에 대해 자주 받는 질문을 모았습니다.' };
const labelOf = (c: FaqCategory) => FAQ_CATEGORIES.find((x) => x.value === c)?.label ?? '';

/**
 * FAQ — /faq (고객센터)
 * 질문을 누르면 답이 펼쳐지는 아코디언. 여러 개를 함께 열 수 있음(비교하며 읽기 좋게).
 */
export function FaqPage() {
  const [filter, setFilter] = useState<Filter>('all');
  // 열린 질문 id 모음 — 배열 대신 Set: '있나?' 확인이 바로 됨. 바꿀 땐 새 Set을 만들어야 React가 변경을 알아챔
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const list = filter === 'all' ? FAQS : FAQS.filter((f) => f.category === filter);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <>
      <QuoteHero board={HERO} />

      <div className={cx('container', s.body)}>
        <Tabs className={s.tabs} items={TABS} value={filter} onChange={setFilter} label="질문 분류" idPrefix="faq" />

        <div id="faq-panel" role="tabpanel" aria-labelledby={`faq-tab-${filter}`}>
          {/* key: 분류를 바꾸면 목록을 새로 그려 등장 모션 재생 */}
          <ul key={filter} className={s.list}>
            {list.map((f, i) => {
              const isOpen = open.has(f.id);
              return (
                <li key={f.id} className={cx(s.item, isOpen && s.open)} style={{ animationDelay: `${i * 30}ms` }}>
                  {/* 버튼 + aria-expanded/aria-controls = 접고 펴는 영역의 표준 패턴 (스크린리더가 '펼쳐짐/접힘'을 읽음) */}
                  <h2 className={s.qWrap}>
                    <button type="button" className={s.q} aria-expanded={isOpen} aria-controls={`faq-a-${f.id}`} id={`faq-q-${f.id}`} onClick={() => toggle(f.id)}>
                      <span className={s.mark} aria-hidden="true">Q</span>
                      <span className={s.qText}>
                        {filter === 'all' && <span className={s.cat}>{labelOf(f.category)}</span>}
                        {f.q}
                      </span>
                      <span className={s.chev} aria-hidden="true" />
                    </button>
                  </h2>
                  {/* 높이 애니메이션: grid-template-rows 0fr → 1fr. height:auto는 transition이 안 되지만 fr은 됨
                      inert: 접힌 답 안의 링크에 Tab이 들어가지 않고 스크린리더도 건너뜀 (화면에서만 숨긴 게 아니라 '없는 것'으로) */}
                  <div id={`faq-a-${f.id}`} role="region" aria-labelledby={`faq-q-${f.id}`} className={s.aWrap} inert={!isOpen}>
                    <div className={s.aInner}>
                      <div className={s.a}>
                        <span className={cx(s.mark, s.markA)} aria-hidden="true">A</span>
                        <div className={s.aBody}>
                          <p>{f.a}</p>
                          {f.link && (
                            <SmartLink href={f.link.href} className={s.aLink}>
                              {f.link.label}
                              <span aria-hidden="true">→</span>
                            </SmartLink>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 답을 못 찾았을 때 — 문의로 이어 줌 */}
        <section className={s.more} aria-labelledby="faq-more-title">
          <div>
            <h2 id="faq-more-title" className={s.moreTitle}>원하는 답을 찾지 못하셨나요?</h2>
            <p className={s.moreDesc}>
              문의를 남기시거나 대표번호 <a href={`tel:${COMPANY.tel}`}>{COMPANY.tel}</a>로 연락 주세요.
            </p>
          </div>
          <div className={s.moreActions}>
            <Button href="/quote/write" arrow>견적문의</Button>
            <Button href="/design/write" variant="secondary">설계문의</Button>
          </div>
        </section>
      </div>
    </>
  );
}
