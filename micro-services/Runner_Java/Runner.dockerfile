FROM eclipse-temurin:17-jre-alpine

RUN apk add curl && apk add python3 && apk add --no-cache tini && apk add bash && apk add coreutils
RUN rm -rf /var/cache/apk/*
RUN mkdir "/work"
COPY runner.sh .
COPY create_files_executable.py /work
COPY create_files_input_py.py /work
COPY create_files_input_txt.py /work
COPY encode_files.py /work

ENTRYPOINT [ "/bin/bash", "./runner.sh" ]