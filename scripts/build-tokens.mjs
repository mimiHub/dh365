// tokens.json(디자인 시스템 원본) → src/design-system/tokens.css 생성
// 사용: npm run tokens
// 색은 [data-theme] 별로, 나머지(간격·라운드·레이아웃)는 :root 하나에 출력합니다.
import { readFileSync, writeFileSync } from 'node:fs';

const src = new URL('../src/design-system/tokens.json', import.meta.url);
const out = new URL('../src/design-system/tokens.css', import.meta.url);
const t = JSON.parse(readFileSync(src, 'utf8'));

const themes = t.color.themes.map((th) => th.id);
const first = themes[0];
const resolve = (v) => (typeof v === 'string' && v.startsWith('{') ? `var(--${v.slice(1, -1)})` : v);
const valueFor = (tok, theme) =>
  typeof tok.value === 'string' ? tok.value : tok.value[theme] ?? tok.value[first];

const lines = [`/* ${t.name} — generated from tokens.json. 직접 수정하지 말고 tokens.json을 고친 뒤 npm run tokens */`];

for (const theme of themes) {
  const sel = theme === first ? `:root, [data-theme="${theme}"]` : `[data-theme="${theme}"]`;
  lines.push(`${sel} {`);
  for (const tok of t.color.tokens) {
    // 첫 테마가 아니면 값이 달라지는 토큰과 별칭만 다시 선언
    const v = valueFor(tok, theme);
    if (theme !== first && typeof tok.value === 'string' && !tok.value.startsWith('{')) continue;
    lines.push(`  --${tok.name}: ${resolve(v)};`);
  }
  for (const tok of t.shadow?.tokens ?? []) lines.push(`  --${tok.name}: ${valueFor(tok, theme)};`);
  lines.push(`  color-scheme: ${theme === first ? 'light' : 'dark'};`);
  lines.push('}');
}

lines.push(':root {');
for (const fam of ['spacing', 'radius', 'layout', 'zIndex']) {
  for (const tok of t[fam]?.tokens ?? []) lines.push(`  --${tok.name}: ${tok.value};`);
}
for (const [key, stack] of Object.entries(t.type.families)) lines.push(`  --font-${key}: ${stack};`);
lines.push('}');

// 타입 스타일 → 유틸리티 클래스 (.t-h1 등)
for (const g of t.type.groups) {
  for (const s of g.styles) {
    lines.push(
      `.t-${s.name} { font-size: ${s.fontSize}; line-height: ${s.lineHeight}; font-weight: ${s.fontWeight};` +
        (s.letterSpacing ? ` letter-spacing: ${s.letterSpacing};` : '') +
        (s.name === 'eyebrow' ? ' text-transform: uppercase;' : '') +
        ' }',
    );
  }
}

writeFileSync(out, lines.join('\n') + '\n');
console.log('tokens.css written');
