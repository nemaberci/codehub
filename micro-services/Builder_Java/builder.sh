#!/bin/bash

# Step 1: Download source files

curl ${FILE_HANDLER_URL}/file_handling/download_folder_content/${SOURCE_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -o "downloaded.txt"
python3 create_files.py

if (GENERATE FASZOM IZÉ) {
    ...PAPPAA 
} else {
    BEMÁSOLJUK VALAHOVA
}

for test_case in ${TEST_CASES}/*; do
    if [[ $GENERATE == "true" ]] 
    then
        #generáljuk a faszom
    else 
        #másoljuk be a faszom
    fi
done

# Step 2: Compile source files

FOR EACH FILE IN A INPUTBA {
    java ${ENTRY_POINT} < input_n > output_izé_n
}

# Step 3: Upload compiled executables

FOR EACH OUTPUT FILE {
    CHECK OUTPUT_FILE_N
}

python3 encode_files.py
curl ${FILE_HANDLER_URL}/file_handling/upload_folder_content/${EXECUTABLE_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" --data "@files.txt"