#!/bin/bash

curl ${FILE_HANDLER_URL}/file_handling/download_folder_content/${SOURCE_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -o "downloaded.txt"
python3 ./create_files.py

javac ${ENTRY_POINT} -d output

python3 ./encode_files.py
curl ${FILE_HANDLER_URL}/file_handling/upload_folder_content/${EXECUTABLE_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" --data "@files.txt"

python3 ./publish_built_event.py ${ENTRY_POINT} ${EXECUTABLE_FOLDER_NAME} ${CHALLENGE_ID} ${SOLUTION_ID}