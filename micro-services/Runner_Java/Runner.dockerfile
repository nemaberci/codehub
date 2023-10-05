FROM eclipse-temurin:17-jre-alpine

RUN apk add curl && apk add python3
RUN rm -rf /var/cache/apk/*
COPY runner.sh .
COPY create_files.py .
COPY encode_files.py .

ENTRYPOINT [ "sh", "./runner.sh" ]