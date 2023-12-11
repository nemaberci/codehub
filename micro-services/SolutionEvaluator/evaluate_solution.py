import firebase_admin
import os
from firebase_admin import credentials
from firebase_admin import firestore

# Use this in development
# cred = credentials.ApplicationDefault()
# firebase_admin.initialize_app(cred)

# Use this in production
app = firebase_admin.initialize_app()

db = firestore.client()

doc_ref = db.collection("Challenge").document(os.getenv('CHALLENGE_ID'))
test_cases_ref = doc_ref.collection("Testcases")
result_ref = db.collection("Solution").document(os.getenv('SOLUTION_ID')).collection("Result").document("Result")
result_ref.set(
    {
        "time_evaluated": firestore.SERVER_TIMESTAMP
    }
)
sub_results_ref = result_ref.collection("SubResults")

doc = doc_ref.get().to_dict()
test_cases = list(map(lambda x: x.to_dict(), test_cases_ref.get()))

print(doc)
test_case_doc_refs = list(test_cases_ref.list_documents())

for i in range(len(test_cases)):
    test_case = test_cases[i]
    print(test_case)
    millis = (int(open("after_" + str(i), "r").read()) - int(open("before_" + str(i), "r").read())) / 1_000_000
    print("Test case " + str(i) + " took " + str(millis) + " milliseconds")
    kbytes = int(open("peak_" + str(i), "r").read())
    print(f"Test case {i}'s peak memory consumption is {kbytes} KB")
    if millis > test_case["max_runtime"]:
        print("Test case " + str(i) + " failed: exceeded max runtime")
        sub_results_ref.document("Testcase_" + str(i)).set(
            {
                "runtime": millis,
                "memory": kbytes,
                "points": 0,
                "test_case_id": test_case_doc_refs[i].id
            }
        )
        continue
    if kbytes > test_case["max_memory"]:
        print("Test case " + str(i) + " failed: exceeded max memory")
        sub_results_ref.document("Testcase_" + str(i)).set(
            {
                "runtime": millis,
                "memory": kbytes,
                "points": 0,
                "test_case_id": test_case_doc_refs[i].id
            }
        )
        continue
    if "output_verifier_location" in doc:
        from import_verifier import verify
        testcase_input = open("input_" + str(i), "r").readlines()
        produced_output = open("output_" + str(i), "r").readlines()
        if verify(testcase_input, produced_output):
            print("Test case " + str(i) + " passed")
            sub_results_ref.document("Testcase_" + str(i)).set(
                {
                    "runtime": millis,
                    "memory": kbytes,
                    "points": test_case["points"],
                    "test_case_id": test_case_doc_refs[i].id
                }
            )
        else:
            print("Test case " + str(i) + " failed: output did not match expected output")
            sub_results_ref.document("Testcase_" + str(i)).set(
                {
                    "runtime": millis,
                    "memory": kbytes,
                    "points": 0,
                    "test_case_id": test_case_doc_refs[i].id
                }
            )
    if "results_location" in doc:
        expected_output = open(test_case["output_file_location"], "r").readlines()
        produced_output = open("output_" + str(i), "r").readlines()
        for i in range(len(expected_output)):
            print(expected_output[i] == produced_output[i])

