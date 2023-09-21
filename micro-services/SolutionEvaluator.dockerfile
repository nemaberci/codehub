FROM node:20-alpine AS builder

WORKDIR /work

COPY SolutionEvaluator/impl ./SolutionEvaluator/impl
COPY SolutionEvaluator/api ./SolutionEvaluator/api
COPY SolutionEvaluator/types ./SolutionEvaluator/types
COPY SolutionEvaluator/package.json ./SolutionEvaluator
COPY SolutionEvaluator/tsconfig.json ./SolutionEvaluator
COPY SolutionEvaluator/SolutionEvaluatorServer.ts ./SolutionEvaluator
COPY client ./client

WORKDIR /work/SolutionEvaluator

RUN ["npm", "install"]
RUN ["npm", "run", "build"]

FROM node:alpine AS runner

WORKDIR /work
COPY --from=builder /work/SolutionEvaluator/dist/ChallengeServer.js ./server.js

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]