FROM node:20-alpine AS builder

WORKDIR /work

COPY NotificationPublisher/impl ./NotificationPublisher/impl
COPY NotificationPublisher/api ./NotificationPublisher/api
COPY NotificationPublisher/types ./NotificationPublisher/types
COPY NotificationPublisher/package.json ./NotificationPublisher
COPY NotificationPublisher/tsconfig.json ./NotificationPublisher
COPY NotificationPublisher/NotificationPublisherServer.ts ./NotificationPublisher
COPY client ./client

WORKDIR /work/NotificationPublisher

RUN ["npm", "install"]
RUN ["npm", "run", "build"]

FROM node:alpine AS runner

WORKDIR /work
COPY --from=builder /work/NotificationPublisher/dist/ChallengeServer.js ./server.js

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]