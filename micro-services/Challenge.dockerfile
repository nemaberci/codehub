FROM node:20-alpine AS builder

WORKDIR /work

COPY Challenge/impl ./Challenge/impl
COPY Challenge/api ./Challenge/api
COPY Challenge/types ./Challenge/types
COPY Challenge/package.json ./Challenge
COPY Challenge/tsconfig.json ./Challenge
COPY Challenge/ChallengeServer.ts ./Challenge
COPY client ./client

WORKDIR /work/Challenge

RUN ["npm", "install"]
RUN ["npm", "run", "build"]

FROM node:alpine AS runner

WORKDIR /work
COPY --from=builder /work/Challenge/dist/ChallengeServer.js ./server.js

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]