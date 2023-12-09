FROM node:20-alpine AS builder

WORKDIR /work

COPY Solution/impl ./Solution/impl
COPY Solution/api ./Solution/api
COPY Solution/types ./Solution/types
COPY Solution/package.json ./Solution
COPY Solution/tsconfig.json ./Solution
COPY Solution/SolutionServer.ts ./Solution
COPY package.json .
COPY client ./client

RUN ["npm", "install"]

WORKDIR /work/Solution

RUN ["npm", "install"]
RUN ["npm", "run", "build"]
RUN ["npm", "run", "compile-alpine"]

FROM alpine:latest AS runner

WORKDIR /work
COPY --from=builder /work/Solution/dist/lib/index ./index

EXPOSE 3000

ENTRYPOINT ["./index"]