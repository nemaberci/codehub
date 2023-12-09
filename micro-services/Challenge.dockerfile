FROM node:20-alpine AS builder

WORKDIR /work

COPY Challenge/impl ./Challenge/impl
COPY Challenge/api ./Challenge/api
COPY Challenge/types ./Challenge/types
COPY Challenge/package.json ./Challenge
COPY Challenge/tsconfig.json ./Challenge
COPY Challenge/ChallengeServer.ts ./Challenge
COPY package.json .
COPY client ./client

RUN ["npm", "install"]

WORKDIR /work/Challenge

RUN ["npm", "install"]
RUN ["npm", "run", "build"]
RUN ["npm", "run", "compile-alpine"]

FROM alpine:latest AS runner

WORKDIR /work
COPY --from=builder /work/Challenge/dist/lib/index ./index

EXPOSE 3000

ENTRYPOINT ["./index"]