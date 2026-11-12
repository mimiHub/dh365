import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Vite 시절(react-hooks v5)에는 없던 React Compiler 규칙 — 기존 코드(useListQuery의 ref 등)를 정리할 때 다시 켬
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      // 이미지는 public/images의 <img>를 그대로 씀 (next/image 전환은 별도 작업)
      '@next/next/no-img-element': 'off',
      // 본문 문구의 따옴표를 그대로 둠
      'react/no-unescaped-entities': 'off',
    },
  },
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts']),
]);
