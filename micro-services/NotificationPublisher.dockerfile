FROM node:20-alpine AS builder

WORKDIR /work

COPY NotificationPublisher/impl ./NotificationPublisher/impl
COPY NotificationPublisher/api ./NotificationPublisher/api
COPY NotificationPublisher/types ./NotificationPublisher/types
COPY NotificationPublisher/package.json ./NotificationPublisher
COPY NotificationPublisher/tsconfig.json ./NotificationPublisher
COPY NotificationPublisher/NotificationPublisherServer.ts ./NotificationPublisher
COPY package.json .
COPY client ./client

RUN ["npm", "install"]

WORKDIR /work/NotificationPublisher

RUN ["npm", "install"]
RUN ["npm", "run", "build"]
RUN ["npm", "run", "compile-alpine"]

FROM alpine:latest AS runner

WORKDIR /work
COPY --from=builder /work/NotificationPublisher/dist/lib/index ./index

EXPOSE 3000

ENTRYPOINT ["./index"]