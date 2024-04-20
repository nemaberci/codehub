FROM alpine:latest

RUN apk add curl && apk add python3 && apk add --no-cache tini && apk add bash && apk add coreutils && apk add py3-pip && apk add g++
RUN pip install --upgrade pip --break-system-packages
RUN pip install google-cloud-pubsub --break-system-packages
RUN pip install --upgrade firebase-admin --break-system-packages
COPY builder.sh .
COPY create_files.py .
COPY encode_files.py .
COPY publish_built_event.py .
COPY upload_build_result.py .

ENTRYPOINT [ "sh", "./builder.sh" ]