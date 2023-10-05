#!/bin/bash

# Step 1: Download source files

curl ${FILE_HANDLER_URL}/file_handling/download_folder_content/${SOURCE_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -o "downloaded.txt"
python3 create_files.py

# Step 2: Compile source files

javac ${ENTRY_POINT} -d output

# Step 3: Upload compiled executables

python3 encode_files.py
curl ${FILE_HANDLER_URL}/file_handling/upload_folder_content/${EXECUTABLE_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" --data "@files.txt"