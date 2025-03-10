import firebase_admin
import os
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud import pubsub_v1

# Use this in development
# cred = credentials.ApplicationDefault()
# firebase_admin.initialize_app(cred)

# Use this in production
app = firebase_admin.initialize_app()

db = firestore.client()

doc_ref = db.collection("Challenge").document(os.getenv('CHALLENGE_ID'))
test_cases_ref = doc_ref.collection("Testcases")
lang = db.collection("Solution").document(os.getenv('SOLUTION_ID')).get().to_dict()["language"]
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
    try:
        test_case = test_cases[i]
        # print(test_case)
        millis = (int(open("after_" + str(i), "r").read()) - int(open("before_" + str(i), "r").read())) / 1_000_000
        print("Test case " + str(i) + " took " + str(millis) + " milliseconds")
        kbytes = int(open("peak_" + str(i), "r").read())
        print(f"Test case {i}'s peak memory consumption is {kbytes} KB")
        limits = db.collection("Challenge").document(os.getenv('CHALLENGE_ID')).collection("Testcases").document(test_case_doc_refs[i].id).collection("limits").document(lang).get()
        max_runtime = limits.to_dict()["max_runtime"]
        max_memory = limits.to_dict()["max_memory"]
        if millis > max_runtime:
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
        if kbytes > max_memory:
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
            matches = True
            for j in range(len(expected_output)):
                print(expected_output[j], produced_output[j])
                matches = matches and (expected_output[j] == produced_output[j])
                print(expected_output[j] == produced_output[j])
            if matches:
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
    except Exception as e:
        print("Test case " + str(i) + " failed: exception occurred")
        print(e)
        sub_results_ref.document("Testcase_" + str(i)).set(
            {
                "runtime": 0,
                "memory": 0,
                "points": 0,
                "test_case_id": test_case_doc_refs[i].id
            }
        )

publisher = pubsub_v1.PublisherClient()
topic_name = 'projects/{project_id}/topics/{topic}'.format(
    project_id='codehub-400314',
    topic='SolutionResultsUploaded',
)
future = publisher.publish(topic_name, b'', challengeId=os.getenv('CHALLENGE_ID'), solutionId=os.getenv('SOLUTION_ID'))
print(future.result())

