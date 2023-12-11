FROM node:20-alpine AS builder

WORKDIR /work

COPY FileHandling/impl ./FileHandling/impl
COPY FileHandling/api ./FileHandling/api
COPY FileHandling/types ./FileHandling/types
COPY FileHandling/package.json ./FileHandling
COPY FileHandling/tsconfig.json ./FileHandling
COPY FileHandling/FileHandlingServer.ts ./FileHandling
COPY package.json .
COPY client ./client

RUN ["npm", "install"]

WORKDIR /work/FileHandling

RUN ["npm", "install"]
RUN ["npm", "run", "build"]
RUN ["npm", "run", "compile-alpine"]

FROM alpine:latest AS runner

WORKDIR /work
COPY --from=builder /work/FileHandling/dist/lib/index ./index

EXPOSE 3000

ENTRYPOINT ["./index"]