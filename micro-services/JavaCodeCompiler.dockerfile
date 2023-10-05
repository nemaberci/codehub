FROM node:20-alpine AS builder

WORKDIR /work

COPY JavaCodeCompiler/impl ./JavaCodeCompiler/impl
COPY JavaCodeCompiler/api ./JavaCodeCompiler/api
COPY JavaCodeCompiler/types ./JavaCodeCompiler/types
COPY JavaCodeCompiler/package.json ./JavaCodeCompiler
COPY JavaCodeCompiler/tsconfig.json ./JavaCodeCompiler
COPY JavaCodeCompiler/JavaCodeCompilerServer.ts ./JavaCodeCompiler
COPY client ./client

WORKDIR /work/JavaCodeCompiler

RUN ["npm", "install"]
RUN ["npm", "run", "build"]
RUN ["npm", "run", "compile-alpine"]

FROM alpine:latest AS runner

WORKDIR /work
COPY --from=builder /work/JavaCodeCompiler/dist/lib/index ./index

EXPOSE 3000

ENTRYPOINT ["./index"]