import { useEffect, useId, useRef, useState } from 'react';
import logo from '../../assets/logo.png';
import emblem from '../../assets/emblem.png';
import { CHAT, COMPANY, naverTalkUrl } from '../../data/site';
import { cx } from '../ui';
import s from './ChatWidget.module.css';

/**
 * 채팅상담 위젯 — 우하단 플로팅 버튼 → 상담 패널.
 * 실제 1:1 채팅은 네이버 톡톡 창(새 탭 / 모바일은 네이버 앱)에서 진행됩니다.
 * 톡톡은 사이트 안에 iframe으로 넣을 수 없어서, '우리 디자인의 진입 패널 + 톡톡 링크'가 표준 연동 방식입니다.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const talkReady = CHAT.naverTalkId.trim() !== '';

  // 열리면 패널로 포커스 이동, ESC·바깥 클릭으로 닫고 포커스를 버튼으로 돌려줌
  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const close = () => {
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !toggleRef.current?.contains(t)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  return (
    <div className={s.root}>
      <div
        id={panelId}
        ref={panelRef}
        className={cx(s.panel, open && s.open)}
        role="dialog"
        aria-label="채팅상담"
        tabIndex={-1}
        hidden={!open}
      >
        <div className={s.head}>
          <img src={logo} alt="" className={s.logo} />
          <p className={s.title}>채팅상담</p>
          <p className={s.hours}>
            <span className={s.dot} aria-hidden="true" />
            상담시간 {CHAT.hours}
          </p>
        </div>

        <div className={s.body}>
          <div className={s.msg}>
            <span className={s.avatar} aria-hidden="true">
              <img src={emblem} alt="" />
            </span>
            <div className={s.bubble}>
              <strong className={s.from}>대한방화</strong>
              {CHAT.greeting.map((l) => (
                <p key={l}>{l}</p>
              ))}
              <p className={s.hint}>{CHAT.hint}</p>
            </div>
          </div>

          {talkReady ? (
            <a className={s.talk} href={naverTalkUrl(CHAT.naverTalkId)} target="_blank" rel="noopener noreferrer">
              <NaverTalkIcon />
              네이버 톡톡으로 상담하기
              <span className="sr-only">(새 창)</span>
            </a>
          ) : (
            <button type="button" className={s.talk} disabled>
              <NaverTalkIcon />
              네이버 톡톡 상담 준비 중
            </button>
          )}
          <p className={s.note}>네이버 로그인 후 1:1로 바로 상담할 수 있어요</p>

          <div className={s.other}>
            <span>다른 방법으로 문의</span>
            <div className={s.otherBtns}>
              <a href={`tel:${COMPANY.tel}`} className={s.round} aria-label={`전화 상담 ${COMPANY.tel}`}>
                <PhoneIcon />
              </a>
              <a href="#contact" className={s.round} aria-label="견적문의 바로가기" onClick={() => setOpen(false)}>
                <FormIcon />
              </a>
            </div>
          </div>
        </div>
      </div>

      <button
        ref={toggleRef}
        type="button"
        className={cx(s.fab, open && s.fabOpen)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? '채팅상담 닫기' : '채팅상담 열기'}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          // 아이콘만 표시 — 버튼 이름은 aria-label('채팅상담 열기')이 스크린리더에 전달
          <ChatIcon />
        )}
      </button>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path d="M13 4C7.5 4 3 7.6 3 12.1c0 2.6 1.5 4.9 3.8 6.4L6 22l4.1-2.2c.9.2 1.9.3 2.9.3 5.5 0 10-3.6 10-8S18.5 4 13 4Z" fill="currentColor" />
      <circle cx="9" cy="12" r="1.3" fill="var(--brand)" />
      <circle cx="13" cy="12" r="1.3" fill="var(--brand)" />
      <circle cx="17" cy="12" r="1.3" fill="var(--brand)" />
    </svg>
  );
}
function NaverTalkIcon() {
  return (
    <span className={s.nBadge} aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 12 12"><path d="M8.1 1H11v10H8.1L3.9 5.3V11H1V1h2.9l4.2 5.7V1Z" fill="currentColor" /></svg>
    </span>
  );
}
function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M6.6 2.8 4.4 3.3c-.8.2-1.3 1-1.2 1.8.9 6 5.6 10.7 11.6 11.6.8.1 1.6-.4 1.8-1.2l.5-2.2-3.6-1.6-1.4 1.6a9 9 0 0 1-4.1-4.1l1.6-1.4L8.2 4.3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function FormIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="4" y="2.5" width="12" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 7h6M7 10h6M7 13h3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
