# Step 1: Download executable files

cd /work

curl ${FILE_HANDLER_URL}/file_handling/download_folder_content/${EXECUTABLE_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -o "/work/downloaded_executable.txt"
curl ${FILE_HANDLER_URL}/file_handling/download_folder_content/helloworld_cpp -H "Authorization: Bearer ${TOKEN}" -o "/work/downloaded_helloworld.txt"
python3 ./create_files_executable.py 

mkdir /work/input
mkdir -m 777 /work/output
mkdir /work/time
mkdir /work/memory
mkdir /work/input_txt
mkdir /work/input_py

curl ${FILE_HANDLER_URL}/file_handling/download_folder_content/${INPUT_TXT_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -o "/work/downloaded_input_txt.txt"
python3 ./create_files_input_txt.py 

curl ${FILE_HANDLER_URL}/file_handling/download_folder_content/${INPUT_PY_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -o "/work/downloaded_input_py.txt"
python3 ./create_files_input_py.py

# Step 2: Generate input files, if needed

TEST_CASES_GENERATED_ARR=(${TEST_CASES_GENERATED//;/ })
TEST_CASES_LOCATION_ARR=(${TEST_CASES_LOCATION//;/ })

for i in ${!TEST_CASES_GENERATED_ARR[@]}; do 
    if [[ ${TEST_CASES_GENERATED_ARR[i]} == true ]]; 
        then python3 /work/input_py/${TEST_CASES_LOCATION_ARR[i]} > /work/input/input_${i};
        else mv /work/input_txt/${TEST_CASES_LOCATION_ARR[i]} /work/input/input_${i};
    fi; 
done 

adduser --system --shell /bin/bash --disabled-password runneruser

date +%s%N > /work/time/before_helloworld1;
OUTPUT_NAME=/work/output/output_helloworld1
/usr/bin/time -o /work/memory/peak_helloworld1 -f '%M' timeout 20s su runneruser -c "cd /work && /work/helloworld > ${OUTPUT_NAME}";
date +%s%N > /work/time/after_helloworld1;
date +%s%N > /work/time/before_helloworld2;
OUTPUT_NAME=/work/output/output_helloworld2
/usr/bin/time -o /work/memory/peak_helloworld2 -f '%M' timeout 20s su runneruser -c "cd /work && /work/helloworld > ${OUTPUT_NAME}";
date +%s%N > /work/time/after_helloworld2;

# Step 3: Run the executable files
for i in ${!TEST_CASES_GENERATED_ARR[@]}; do
    date +%s%N > /work/time/before_${i};
    INPUT_NAME=/work/input/input_${i}
    OUTPUT_NAME=/work/output/output_${i}
    /usr/bin/time -o /work/memory/peak_$i -f '%M' timeout 20s su runneruser -c "cd /work && /work/${ENTRY_POINT} < ${INPUT_NAME} > ${OUTPUT_NAME}";
    date +%s%N > /work/time/after_${i};
done

# Step 4: Upload the output files
python3 ./encode_files.py 
curl ${FILE_HANDLER_URL}/file_handling/upload_folder_content/${RESULTS_FOLDER_NAME} -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" --data "@/work/files.txt"

python3 ./publish_evaluated_event.py ${RESULTS_FOLDER_NAME} ${CHALLENGE_ID} ${SOLUTION_ID} ${SECRET_NAME}