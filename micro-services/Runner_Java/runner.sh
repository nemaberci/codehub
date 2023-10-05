# Step 1: Download executable files
curl ${FILE_HANDLER_URL}/file_handling/download_folder_content/${EXECUTABLE_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -o "downloaded_executable.txt" 
python3 create_files_executable.py 

mkdir input
mkdir output
mkdir time
mkdir input_txt
mkdir input_py

curl ${FILE_HANDLER_URL}/file_handling/download_folder_content/${INPUT_TXT_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -o "downloaded_input_txt.txt" 
python3 create_files_input_txt.py 

curl ${FILE_HANDLER_URL}/file_handling/download_folder_content/${INPUT_PY_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -o "downloaded_input_py.txt" 
python3 create_files_input_py.py 

TEST_CASES_GENERATED_ARR=(${TEST_CASES_GENERATED//;/ })
TEST_CASES_LOCATION_ARR=(${TEST_CASES_LOCATION//;/ })

for i in ${!TEST_CASES_GENERATED_ARR[@]}; do 
    if [[ ${TEST_CASES_GENERATED_ARR[i]} == true ]]; 
        then python3 input_py/${TEST_CASES_LOCATION_ARR[i]} > input/input_${i}; 
        else mv input_txt/${TEST_CASES_LOCATION_ARR[i]} input/input_${i}; 
    fi; 
done 


for i in ${!TEST_CASES_GENERATED_ARR[@]}; do 
    date +%s%N > time/before_${i}; 
    java ${ENTRY_POINT} < input/input_${i} > output/output_${i}; 
    date +%s%N > time/after_${i}; 
done 

python3 encode_files.py 
curl ${FILE_HANDLER_URL}/file_handling/upload_folder_content/${RESULTS_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" --data "@files.txt" 