#!/bin/bash

curl ${FILE_HANDLER_URL}/file_handling/download_folder_content/${RESULTS_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -o "downloaded.txt"
python3 ./create_files.py

python3 ./load_challenge_info.py

if [[ ${TEST_CASES_GENERATED_ARR[i]} == true ]]; 
    then python3 /work/input_py/${TEST_CASES_LOCATION_ARR[i]} > /work/input/input_${i};
    else mv /work/input_txt/${TEST_CASES_LOCATION_ARR[i]} /work/input/input_${i};
fi; 

python3 ./evaluate_solution.py


