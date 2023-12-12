FROM openjdk:17-slim

RUN apt-get update && apt-get install -y curl && apt-get install -y python3 && apt-get install -y python3-pip
RUN pip install --upgrade pip
RUN pip install google-cloud-pubsub
RUN pip install --upgrade firebase-admin
COPY builder.sh .
COPY create_files.py .
COPY encode_files.py .
COPY publish_built_event.py .
COPY upload_build_result.py .

ENTRYPOINT [ "sh", "./builder.sh" ]