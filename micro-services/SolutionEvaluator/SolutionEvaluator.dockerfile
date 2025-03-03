FROM alpine:latest

RUN apk add curl && apk add python3 && apk add bash && apk add py3-pip
RUN pip install --upgrade firebase-admin --break-system-packages
RUN pip install google-cloud-pubsub --break-system-packages
RUN rm -rf /var/cache/apk/*
COPY solutionevaluator.sh .
COPY create_files.py .
COPY evaluate_solution.py .
COPY create_import_verifier.py .

ENTRYPOINT [ "/bin/bash", "./solutionevaluator.sh" ]