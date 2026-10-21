# (주)대한방화 리뉴얼 — 메인 시안

React + Vite + TypeScript. 대한방화 디자인 시스템 토큰과 컴포넌트를 그대로 가져와 코아드(coaddoor.com) 메인 구성을 대한방화 메뉴·콘텐츠에 맞춰 만든 시안입니다.

```bash
npm install
npm run dev            # 개발 서버
npm run build          # 배포용 빌드 → dist/
npm run build:preview  # 공유용 한 파일 빌드(폰트·이미지 포함) → dist-preview/index.html
npm run tokens         # tokens.json 수정 후 tokens.css 재생성
```

## 폴더 구조

```
src/
├─ design-system/      디자인 시스템에서 가져온 것 (직접 수정 X — 원본을 고치고 다시 가져옴)
│  ├─ tokens.json      원본 토큰
│  ├─ tokens.css       ← scripts/build-tokens.mjs 가 생성
│  └─ components.css   dh- 컴포넌트 스타일
├─ components/
│  ├─ ui/              디자인 시스템 컴포넌트의 TSX 버전 (Button, Tabs, SectionHeading …)
│  └─ layout/          Header, Footer, QuickMenu
├─ sections/           메인 섹션 = 컴포넌트 + 섹션 전용 *.module.css
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
- 이미지: 모두 슬랫 패턴 플레이스홀더(`<Media label="…">`). `src`만 넣으면 사진으로 바뀝니다.
- 화이트 로고 원본 없음 → 헤더 투명 상태·푸터는 CSS 필터로 임시 처리.
- 하위 페이지·라우팅은 아직 없음(메인 시안만). 링크는 앵커(#)로 연결.
