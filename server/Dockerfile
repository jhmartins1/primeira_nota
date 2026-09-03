FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY prisma ./prisma
COPY prisma.config.ts ./
COPY src ./src
COPY tsconfig.json ./

RUN bunx prisma generate

RUN ls -la /app/src/generated/prisma && ls -la /app/src/generated/prisma/client.ts

EXPOSE 10000

CMD ["bun", "src/server.ts"]