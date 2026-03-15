# ── 빌드 스테이지 ──────────────────────────────────────────
FROM node:20-alpine AS base

# pnpm 활성화 (corepack 사용)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 의존성 파일만 먼저 복사 (레이어 캐시 활용)
COPY package.json pnpm-lock.yaml* ./

# 의존성 설치
# --shamefully-hoist: vite/tailwind 플러그인이 루트 node_modules를 참조하도록
RUN pnpm install --shamefully-hoist || pnpm install

# 소스 코드 복사
COPY . .

# ── 개발 서버 스테이지 ─────────────────────────────────────
FROM base AS dev

EXPOSE 5173

# 0.0.0.0 바인딩: 컨테이너 외부(로컬 브라우저)에서 접근 가능
CMD ["pnpm", "run", "dev"]
