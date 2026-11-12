import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { Icon } from '../../components/ui';
import { CodeBlock } from './CodeBlock';
import { PropsTable } from './PropsTable';
import { GROUPS, type Entry } from './types';
import { UI_ENTRIES } from './entries/ui';
import { PAGE_ENTRIES } from './entries/page';
import { ADMIN_ENTRIES, EXAMPLE_ENTRIES } from './entries/admin';
import s from './Catalog.module.css';

const ALL: Entry[] = [...UI_ENTRIES, ...PAGE_ENTRIES, ...ADMIN_ENTRIES, ...EXAMPLE_ENTRIES];

/**
 * 컴포넌트 카탈로그 — /components
 * 개발자가 보고 가져다 쓰는 곳: 컴포넌트마다 [설명 · 가져오는 곳 · 실제 데모 · 코드(복사) · props 표].
 * 사이트 메뉴에는 없고 주소로만 들어옴 (검색엔진 수집 막음)
 *
 * 새 컴포넌트를 만들면 entries/*.tsx 배열에 항목 하나만 추가
 */
export function ComponentsPage() {
  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // 검색엔진에 안 잡히게 + 탭 제목
  useEffect(() => {
    const prevTitle = document.title;
    document.title = '컴포넌트 카탈로그 — 대한방화';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.title = prevTitle;
      meta.remove();
    };
  }, []);

  // 주소에 #id가 있으면 그 항목으로 (처음 열 때 — 데모가 그려진 다음)
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, []);

  const shown = useMemo(() => {
    const k = q.trim().toLowerCase();
    return k ? ALL.filter((e) => `${e.name} ${e.desc}`.toLowerCase().includes(k)) : ALL;
  }, [q]);

  return (
    <div className={s.page}>
      <header className={s.top}>
        <Link to="/" className={s.brand}>
          <img src={logo} alt="대한방화" />
        </Link>
        <span className={s.topTitle}>컴포넌트 카탈로그</span>
        <span className={s.topCount}>{ALL.length}개</span>
        <button type="button" className={s.menuBtn} aria-expanded={menuOpen} aria-controls="catalog-nav" onClick={() => setMenuOpen((v) => !v)}>
          <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
          <span className="sr-only">목차</span>
        </button>
      </header>

      <div className={s.layout}>
        <aside id="catalog-nav" className={`${s.side} ${menuOpen ? s.sideOpen : ''}`} aria-label="컴포넌트 목차">
          <label htmlFor="catalog-q" className="sr-only">컴포넌트 찾기</label>
          <div className={s.find}>
            <Icon name="search" size={16} />
            <input id="catalog-q" type="search" placeholder="컴포넌트 찾기" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <nav>
            {GROUPS.map((g) => {
              const items = shown.filter((e) => e.group === g.key);
              if (!items.length) return null;
              return (
                <div key={g.key} className={s.navGroup}>
                  <p className={s.navTitle}>{g.name}</p>
                  <ul>
                    {items.map((e) => (
                      <li key={e.id}>
                        <a href={`#${e.id}`} onClick={() => setMenuOpen(false)}>{e.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        </aside>

        <main className={s.main}>
          <section className={s.intro} aria-labelledby="catalog-title">
            <h1 id="catalog-title">대한방화 컴포넌트 카탈로그</h1>
            <p>
              사용자 사이트와 관리자 사이트를 같은 조각으로 만들기 위한 모음입니다. 모양이 다르거나 성격이 다른 부분은 <strong>props</strong>로 바꿉니다.
              데모는 실제 컴포넌트를 그린 것이고, 코드는 복사해 바로 쓸 수 있습니다.
            </p>
            <ul className={s.rules}>
              <li>색·간격은 <code>src/design-system/tokens.css</code>의 변수만 사용 (<code>var(--accent)</code> 등)</li>
              <li>컴포넌트 파일은 컴포넌트만 내보내기 — 상수·훅은 별도 파일 (Fast Refresh)</li>
              <li>새 컴포넌트를 만들면 <code>src/pages/catalog/entries/</code>에 항목 추가</li>
            </ul>
          </section>

          {!shown.length && <p className={s.none}>‘{q}’에 맞는 컴포넌트가 없습니다.</p>}

          {GROUPS.map((g) => {
            const items = shown.filter((e) => e.group === g.key);
            if (!items.length) return null;
            return (
              <section key={g.key} className={s.group} aria-labelledby={`group-${g.key}`}>
                <div className={s.groupHead}>
                  <h2 id={`group-${g.key}`}>{g.name}</h2>
                  <p>
                    {g.desc} · <code>{g.path}</code>
                  </p>
                </div>
                {items.map((e) => (
                  <EntryCard key={e.id} entry={e} />
                ))}
              </section>
            );
          })}
        </main>
      </div>
    </div>
  );
}

function EntryCard({ entry: e }: { entry: Entry }) {
  const { Demo } = e;
  const names = e.name.split(/\s*\+\s*/).filter((n) => /^[A-Z]/.test(n) && !n.includes(' '));
  const importLine = e.group === 'example' ? null : `import { ${names.join(', ')} } from '${e.from}';`;
  return (
    <article id={e.id} className={s.entry} aria-labelledby={`${e.id}-title`}>
      <div className={s.entryHead}>
        <h3 id={`${e.id}-title`}>
          <a href={`#${e.id}`} className={s.anchor} aria-label={`${e.name} 링크`}>#</a>
          {e.name}
        </h3>
        <p>{e.desc}</p>
        {importLine && <code className={s.import}>{importLine}</code>}
      </div>
      <div className={`${s.demo} ${e.bleed ? s.bleed : ''}`}>
        <Demo />
      </div>
      <CodeBlock code={e.code} label="쓰는 법" />
      {e.props && e.props.length > 0 && <PropsTable props={e.props} caption={`${e.name} props`} />}
    </article>
  );
}
