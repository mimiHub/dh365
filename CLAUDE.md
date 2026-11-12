# CLAUDE.md — (주)대한방화 홈페이지 리뉴얼

## 프로젝트 개요

- (주)대한방화 홈페이지 리뉴얼. **납품일 2026-12-10**
- 참여자: 고객(리뉴얼 요청자) / 디자이너 겸 퍼블리셔 / PM — 디자이너와 PM 모두 Claude Code로 이 저장소에서 작업
- 스택: Next.js 16(App Router) · React 19 · TypeScript
- 명령어: `npm run dev` · `npm run build` · `npm run lint` · `npm run tokens`
- 구조·스타일 규칙은 `README.md`, 프로젝트 현황은 `docs/renewal-current-status.md`, 메뉴별 진행 현황은 `docs/tasks-by-menu.md`

## 폴더 규칙 (요약)

- 라우트 = `src/app/(site)/<주소>/page.tsx` — page.tsx는 `src/views/`의 화면을 불러오기만 함
- 화면 컴포넌트 = `src/views/` (상태·이벤트를 쓰면 맨 위에 `'use client'`)
- `src/pages` 폴더는 만들지 않음 (Next의 pages 라우터로 인식되어 충돌)
- 링크·이동은 `@/lib/router` (`Link`, `useNavigate`, `useParams` …), 이미지는 `public/images`에 두고 `'/images/파일명'`으로 사용

## 커밋 규칙 — TASK 문서 동기화

커밋하기 전에 반드시 아래를 확인한다.

1. `git status`와 `git diff --cached --name-status`(스테이징 전이면 `git diff --name-status`)로 다음이 있는지 본다.
   - 새로 추가된 `src/app/**/page.tsx` (새 페이지)
   - 메뉴 변경 (`src/data/site.ts`의 메뉴 항목·href)
   - 기존 페이지의 삭제·주소 변경
2. 하나라도 있으면 `docs/tasks-by-menu.md`를 **같은 커밋에 포함해** 갱신한다.
   - 해당 TASK 표에 행 추가·수정 (하위 메뉴, 경로, 각 단계 상태, 비고에 `YYYY-MM-DD 추가`)
   - 「전체 요약」 표의 하위 메뉴 수·상태 갱신
   - 해결된 「확인 필요」 항목은 `- [x] ~~내용~~ → 결과 (날짜)` 형식으로 표시
   - 「변경 이력」 표 맨 아래에 날짜와 내용 한 줄 추가
   - 문서 머리의 「최종 수정」 날짜 갱신
3. 상태 표기는 문서의 범례(✅ 완료 · 🟡 진행중 · ⬜ 미착수 · ➖ 해당 없음 · ❓ 확인 필요)를 따른다.

## 디자인 컨펌 확인

새 페이지를 추가했거나 `docs/tasks-by-menu.md`를 갱신하는 커밋이면, 커밋 전에 작업자에게 질문한다 (AskUserQuestion).

- 질문: "이번에 추가·수정한 페이지(페이지 이름)의 디자인이 고객 컨펌을 받았나요?"
- 선택지: **컨펌 완료** / **컨펌 대기(진행중)** / **모름**
- 답을 「디자인」 칸에 기록한다.
  - 컨펌 완료 → ✅, 비고에 `컨펌 YYYY-MM-DD`
  - 컨펌 대기 → 🟡
  - 모름 → ❓ 유지
- 작업자가 다른 페이지의 컨펌 소식을 알려 주면 그 내용도 같이 반영한다.
- 답을 받지 않은 채로 추측해서 ✅를 쓰지 않는다.

## 기타

- 커밋 메시지는 한국어, `type: 요약` 형식 (`feat` / `fix` / `docs` / `chore` …)
- 푸시는 요청받았을 때만 한다.
