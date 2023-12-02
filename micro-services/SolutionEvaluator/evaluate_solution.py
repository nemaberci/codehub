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

doc = doc_ref.get()
