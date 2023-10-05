FROM eclipse-temurin:17-jre-alpine

RUN apk add curl && apk add python3 && apk add bash
RUN rm -rf /var/cache/apk/*
COPY runner.sh .
COPY create_files_executable.py .
COPY create_files_input_py.py .
COPY create_files_input_txt.py .
COPY encode_files.py .

ENTRYPOINT [ "/bin/bash", "./runner.sh" ]