# (주)대한방화 리뉴얼 — 메인 시안

Next.js(App Router) + React + TypeScript. 대한방화 디자인 시스템 토큰과 컴포넌트를 그대로 가져와 코아드(coaddoor.com) 메인 구성을 대한방화 메뉴·콘텐츠에 맞춰 만든 시안입니다.

```bash
npm install
npm run dev            # 개발 서버 (http://localhost:3000)
npm run build          # 배포용 빌드 → .next/
npm run start          # 빌드 결과 실행
npm run lint           # ESLint
npm run tokens         # tokens.json 수정 후 tokens.css 재생성
```

## 폴더 구조

```
public/images/         사진·로고 — 코드에서는 '/images/파일명' 문자열로 씀
src/
├─ app/                Next.js 라우트 (주소 = 폴더). page.tsx는 views의 화면을 불러오기만 함
│  ├─ layout.tsx       <html>·전역 CSS·기본 메타
│  ├─ (site)/          사용자 사이트 (머리·바닥 있는 화면들 — layout.tsx의 SiteShell)
│  └─ components/      컴포넌트 카탈로그 (사이트 틀 바깥)
├─ views/              화면 컴포넌트 (예전 src/pages — Next의 pages 라우터와 이름이 겹쳐 바꿈)
├─ lib/router.tsx      react-router 시절 API(Link·useNavigate·useParams…)를 Next 라우터로 이어 주는 층
├─ design-system/      디자인 시스템에서 가져온 것 (직접 수정 X — 원본을 고치고 다시 가져옴)
│  ├─ tokens.json      원본 토큰
│  ├─ tokens.css       ← scripts/build-tokens.mjs 가 생성
│  └─ components.css   dh- 컴포넌트 스타일
├─ components/
│  ├─ ui/              디자인 시스템 컴포넌트의 TSX 버전 (Button, Tabs, SectionHeading …)
│  ├─ page/            사용자 하위 페이지 조각 (SubHero, CategoryNav, BoardTable …)
│  ├─ admin/           관리자 사이트 조각 (AdminShell, DataTable, Field, Modal …)
│  └─ layout/          SiteShell(공통 틀), Header, Footer, QuickMenu
├─ sections/           메인 섹션 = 컴포넌트 + 섹션 전용 *.module.css
├─ views/catalog/      컴포넌트 카탈로그(/components) — 데모·코드·props 문서
├─ data/site.ts        메뉴·회사정보·제품·공지 등 콘텐츠 (마크업과 분리)
├─ hooks/              useReveal(스크롤 등장), useScrolled(헤더 전환)
└─ styles/global.css   리셋, .container, 반응형 공통
```

## 스타일 규칙 — 왜 두 가지 방식을 섞었나

- **공용 컴포넌트 = 전역 클래스 `dh-*`** (`components.css`). 백엔드 템플릿(그누보드 등)에서도 React 없이 같은 클래스로 같은 모양을 내야 하므로 이름이 고정된 전역 클래스를 씁니다.
- **섹션 전용 스타일 = CSS Modules** (`Hero.module.css`). 빌드 시 클래스명이 고유하게 바뀌어 섹션끼리 충돌하지 않습니다. 이 섹션에서만 쓰는 스타일은 여기에.
- 색·간격·라운드는 항상 `var(--토큰)`. 하드코딩은 사진 위 흰 글자처럼 테마와 무관한 값만.

## 섹션 구성 (코아드 → 대한방화)

| 코아드 | 대한방화 | 비고 |
|---|---|---|
| 메인 비주얼(영상) | Hero 슬라이드 3장 | 일시정지 버튼 포함, 사진/영상 교체 자리 `.visual` |
| SAFER, SMARTER, STRONGER + 강점 3탭 | BEST QUALITY/SERVICE/ENGINEER + 강점 3개 | 회사 기존 4대 가치에서 |
| 글로벌 네트워크 (네이비) | 대형 방화스크린셔터 인정 규격 (Navy 섹션) | 실제 공지 내용 기반 |
| PRODUCT 슬라이더 | 제품 6종 슬라이더 | scroll-snap, 라이브러리 없음 |
| — | 시공사례 탭 + 그리드 | 현재 사이트 메뉴 |
| COAD NEWS (TV + News) | 공지사항 + 자료실 4종 | Navy 섹션 |
| 견적상담 + FAQ/쇼룸 | 견적상담 전화 + 견적/설계/오시는길 | |
| 우측 퀵메뉴 | 견적상담·견적문의·TOP | |

## 시안 단계에서 확인할 것

- `data/site.ts`의 `[가안]`: 제품 설명, 강점 문구, 시공사례 제목, 공지 날짜는 시안용 문구입니다.
- 이미지: 사진이 없는 자리는 슬랫 패턴 플레이스홀더(`<Media label="…">`). `src`만 넣으면 사진으로 바뀝니다.
- 화이트 로고 원본 없음 → 헤더 투명 상태·푸터는 CSS 필터로 임시 처리.
- 제품 데이터 `data/products.ts`의 `todo`: 카탈로그끼리 수치가 안 맞거나 내용이 없는 항목(화면에는 표시하지 않음). 클라이언트 확인 요청서(PDF)로 정리해 전달.

## 라우팅

Next.js App Router — 주소마다 `src/app/` 아래 폴더 하나 + `page.tsx`. `page.tsx`는 `src/views/`의 화면을 불러오기만 합니다.

| 주소 | 라우트 폴더 (`src/app/(site)/`) | 화면 (`src/views/`) |
|---|---|---|
| `/` | `page.tsx` | `Home.tsx` |
| `/about`, `/about/:section` | `about/`, `about/[section]/` | `about/AboutPage.tsx` — 없거나 모르는 값이면 인사말로 |
| `/products/:category`, `/products/:category/:slug` | `products/[category]/`, `…/[slug]/` | `ProductPage.tsx` — slug 생략 시 카테고리 첫 제품 |
| `/cases`, `/cases/:category` | `cases/`, `cases/[category]/` | `CasesPage.tsx` |
| `/quote`, `/quote/write`, `/quote/:id` | `quote/…` | `quote/*Page.tsx` (board = 견적문의) |
| `/design`, `/design/write`, `/design/:id` | `design/…` | `quote/*Page.tsx` (board = 설계문의) |
| `/faq` | `faq/` | `FaqPage.tsx` |
| `/library`, `/library/:category`, `/library/:category/:id` | `library/…` | `library/*Page.tsx` |
| `/notice`, `/notice/:id` | `notice/…` | `notice/*Page.tsx` |
| `/components` | `src/app/components/` (사이트 틀 바깥) | `catalog/ComponentsPage.tsx` — 개발자용. 메뉴에 없고 검색엔진 수집 막음 |
| 그 밖 | `src/app/not-found.tsx` | 메인을 보여 줌 (404 화면 정해지면 교체) |

- 화면 코드는 react-router 시절 API를 `@/lib/router`에서 그대로 가져다 씁니다 (`Link to=`, `useNavigate`, `useParams`, `useLocation().state`, `<Navigate>`). 실제 이동은 Next 라우터.
- 검색어·페이지(`?q= &page=`)를 읽는 목록 화면은 `page.tsx`에 `export const dynamic = 'force-dynamic'` (요청마다 서버 렌더).
- 화면(views) 파일 맨 위의 `'use client'`: 상태·이벤트를 쓰는 화면이라 브라우저에서 동작. 새 화면도 같은 방식으로.
- 메뉴 href 규칙(`data/site.ts`): `/…` 페이지 이동, `/#id` 메인 섹션, `#id` 현재 페이지 앵커 → `SmartLink`가 알맞은 태그로 렌더.

## 컴포넌트 카탈로그 — `/components`

사용자 사이트와 관리자 사이트를 같은 조각으로 만들기 위한 문서 페이지입니다. 컴포넌트마다 **설명 · 가져오는 곳 · 실제 데모 · 복사 가능한 코드 · props 표**가 있습니다.

| 묶음 | 위치 | 들어 있는 것 |
|---|---|---|
| 기초 UI | `components/ui` | Button(`danger` 추가), Badge, Icon, Tabs, Pagination, SliderNav, Media, SectionHeading, StatItem, MoreLink |
| 사용자 화면 조각 | `components/page` | SubHero, CategoryNav, ListHead·SearchBox, BoardTable, EmptyState, PostHeader·PostNav, AttachmentList, InfoList, CtaBand |
| 관리자 | `components/admin` | AdminShell, PageHeader, Panel, StatCard, FilterBar, DataTable·BulkBar, Field·TextInput·Textarea·Select·Checkbox·RadioGroup·Switch, ImageUpload, Modal·ConfirmDialog, Alert |
| 조립 예시 | `views/catalog/examples/screens.tsx` | 대시보드, 배너 목록·등록, Q&A 관리, 문의 관리 — 관리자 새 화면의 출발점 |

**관리자 컴포넌트 규칙**
- 다른 점은 props로: 모양(`variant`·`size`·`density`·`layout`), 동작(`selected`/`onSelectChange`, `onRowClick`).
- 상태는 부모가 가짐(제어 컴포넌트) — 표 선택·모달 열림·스위치 값. 일괄 버튼과 표가 같은 상태를 보게 하기 위함.
- 폼은 `<Field>` 안에 입력을 넣으면 label·도움말·오류·필수가 접근성 속성까지 자동 연결. 직접 만든 입력은 `useFieldControl()`로 연결.
- 서버 통신 자리는 예시 화면에 `// 실제: await api…` 주석으로 표시 — 목업 데이터는 `views/catalog/examples/mock.ts`.

**새 컴포넌트를 만들면** `views/catalog/entries/*.tsx` 배열에 항목 하나를 추가합니다(상태가 필요한 데모는 `views/catalog/demos/`에).
