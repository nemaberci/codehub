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

print(os.getenv('CHALLENGE_ID'))
doc_ref = db.collection("Challenge").document(os.getenv('CHALLENGE_ID'))

doc = doc_ref.get().to_dict()
print(doc)

if "output_verifier_location" in doc:
    os.environ['OUTPUT_VERIFIER_LOCATION'] = doc["output_verifier_location"]
if "results_location" in doc:
    os.environ['RESULTS_LOCATION'] = doc["results_location"]
