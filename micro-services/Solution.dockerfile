FROM node:20-alpine AS builder

WORKDIR /work

COPY Solution/impl ./Solution/impl
COPY Solution/api ./Solution/api
COPY Solution/types ./Solution/types
COPY Solution/package.json ./Solution
COPY Solution/tsconfig.json ./Solution
COPY Solution/SolutionServer.ts ./Solution
COPY client ./client

WORKDIR /work/Solution

RUN ["npm", "install"]
RUN ["npm", "run", "build"]

FROM node:alpine AS runner

WORKDIR /work
COPY --from=builder /work/Solution/dist/ChallengeServer.js ./server.js

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]