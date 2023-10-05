#!/bin/bash

# Step 1: Download executable files

curl ${FILE_HANDLER_URL}/file_handling/download_folder_content/${EXECUTABLE_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -o "downloaded.txt"
python3 create_files.py

# Step 2: Prepare environment

useradd runner_user

# Step 3: Run program

su runner_user -s "java ${ENTRY_POINT} < test_case.txt > actual_output.txt"

# Step 4: Upload results

python3 encode_files.py
curl ${FILE_HANDLER_URL}/file_handling/upload_folder_content/${RESULTS_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" --data "@files.txt"