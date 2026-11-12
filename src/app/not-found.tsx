import { SiteShell } from '@/components/layout/SiteShell';
import { Home } from '@/views/Home';

/** 없는 주소 — 시안 단계에서는 이전(react-router '*')과 같이 메인을 보여 줌. 404 화면이 정해지면 교체 */
export default function NotFound() {
  return (
    <SiteShell>
      <Home />
    </SiteShell>
  );
}
