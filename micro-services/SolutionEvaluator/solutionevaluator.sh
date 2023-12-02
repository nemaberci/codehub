#!/bin/bash

curl ${FILE_HANDLER_URL}/file_handling/download_folder_content/${RESULTS_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -o "downloaded.txt"
python3 ./create_files.py

python3 ./load_challenge_info.py

if [[ -z "${OUTPUT_VERIFIER_LOCATION}" ]]; then
    curl ${FILE_HANDLER_URL}/file_handling/download_folder_content/${OUTPUT_VERIFIER_LOCATION} -H "Authorization: Bearer ${TOKEN}" -o "downloaded.txt"
    python3 ./create_import_verifier.py
fi

if [[ -z "${RESULTS_LOCATION}" ]]; then
    curl ${FILE_HANDLER_URL}/file_handling/download_folder_content/${RESULTS_LOCATION} -H "Authorization: Bearer ${TOKEN}" -o "downloaded.txt"
    python3 ./create_files.py
fi

python3 ./evaluate_solution.py
