FROM openjdk:22-slim

RUN apt-get update && apt-get install -y curl && apt-get install -y python3
COPY builder.sh .
COPY create_files.py .
COPY encode_files.py .

ENTRYPOINT [ "sh", "./builder.sh" ]