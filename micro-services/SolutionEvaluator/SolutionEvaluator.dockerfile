FROM openjdk:17-slim

RUN apt-get update && apt-get install -y curl && apt-get install -y python3 && apt-get install -y python3-pip
RUN pip install --upgrade pip
RUN pip install --upgrade firebase-admin
COPY solutionevaluator.sh .
COPY create_files.py .
COPY evaluate_solution.py .
COPY create_import_verifier.py .
COPY load_challenge_info.py .

ENTRYPOINT [ "sh", "./solutionevaluator.sh" ]