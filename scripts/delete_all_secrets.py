# Import the Secret Manager client library.
from google.cloud import secretmanager

# GCP project in which to store secrets in Secret Manager.
project_id = "codehub-400314"

# Create the Secret Manager client.
secret_client = secretmanager.SecretManagerServiceClient()

# Build the parent name from the project.
parent = f"projects/{project_id}"

secrets = secret_client.list_secrets(parent=parent)
print("secrets before: ", secrets)

for secret in secrets:
    # Delete secret
    secret_client.delete_secret(
        name=secret.name
    )

secrets = secret_client.list_secrets(parent=parent)
print("secrets after: ", secrets)
