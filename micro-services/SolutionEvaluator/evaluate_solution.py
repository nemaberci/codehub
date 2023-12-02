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

doc = doc_ref.get().to_dict()
test_cases = list(map(lambda x: x.to_dict(), test_cases_ref.get()))

print(doc)

for i in range(len(test_cases)):
    test_case = test_cases[i]
    print(test_case)
    if "output_verifier_location" in doc:
        os.environ['OUTPUT_VERIFIER_LOCATION'] = test_case["output_verifier_location"]
    if "results_location" in doc:
        expected_output = open(doc["results_location"] + "/" + test_case["location"], "r").readlines()
        testcase_input = open(os.environ["RESULTS_FOLDER_NAME"] + "/" + "input_" + i, "r").readlines()
