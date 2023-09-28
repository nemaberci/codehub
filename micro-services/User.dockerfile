FROM node:20-alpine AS builder

WORKDIR /work

COPY User/impl ./User/impl
COPY User/api ./User/api
COPY User/types ./User/types
COPY User/package.json ./User
COPY User/tsconfig.json ./User
COPY User/UserServer.ts ./User
COPY client ./client

WORKDIR /work/User

RUN ["npm", "install"]
RUN ["npm", "run", "build"]
RUN ["npm", "run", "compile-alpine"]

FROM alpine:latest AS runner

WORKDIR /work
COPY --from=builder /work/User/dist/lib/index ./index

EXPOSE 3000

ENTRYPOINT ["./index"]