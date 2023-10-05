#!/bin/bash

# Step 1: Download executable files

curl ${FILE_HANDLER_URL}/file_handling/download_folder_content/${EXECUTABLE_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -o "downloaded_executable.txt"
python3 create_files_executable.py

# Step 2.1: Donwload the input files if txt file
curl ${FILE_HANDLER_URL}/file_handling/download_folder_content/${INPUT_TXT_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -o "downloaded_input_txt.txt"
python3 create_files_input_txt.py

# Step 2.2: Donwload the input files if python script
curl ${FILE_HANDLER_URL}/file_handling/download_folder_content/${INPUT_PY_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -o "downloaded_input_py.txt"
python3 create_files_input_py.py

for i in ${!TEST_CASES_GENERATED[@]}; do  
    if [[ "${TEST_CASES_GENERATED[i]}" == "true" ]]; 
        then python3 input_py/${TEST_CASES_LOCATION[i]} > input/input_${i}; 
        else mv input_txt/${TEST_CASES_LOCATION[i]} input/input_${i}; 
    fi; 
done

# Step 2: Compile source files

for i in ${!TEST_CASES_GENERATED[@]}; do
    date +%s%N > time/before_${i}
    java ${ENTRY_POINT} < input/input_${i} > output/output_${i}
    date +%s%N > time/after_${i}
done

python3 encode_files.py
curl ${FILE_HANDLER_URL}/file_handling/upload_folder_content/${RESULTS_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" --data "@files.txt"