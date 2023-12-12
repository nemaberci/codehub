import firebase_admin
import os
import sys
from firebase_admin import credentials
from firebase_admin import firestore

# Use this in development
# cred = credentials.ApplicationDefault()
# firebase_admin.initialize_app(cred)

# Use this in production
app = firebase_admin.initialize_app()

db = firestore.client()
build_output = open("error.log", "r").read()

solution_ref = db.collection("Solution").document(os.getenv('SOLUTION_ID'))
solution_ref.update(
    {
        "build_output": build_output,
        "build_status": sys.argv[1] == "true"
    }
)

