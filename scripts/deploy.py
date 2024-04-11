# Import the Secret Manager client library.
import random
import string
import sys
import os
import yaml
from google.cloud import container_v1
from google.cloud import secretmanager
from google.cloud import storage
from google.cloud import iam_credentials
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from kubernetes import config, client

# GCP project in which to store secrets in Secret Manager.
project_id = "codehub-400314"

# ID of the secret to create.
secret_id = ''.join(random.choices(string.ascii_lowercase, k=10))

# Create the Secret Manager client.
secret_client = secretmanager.SecretManagerServiceClient()

# Build the parent name from the project.
parent = f"projects/{project_id}"

private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048
)

random_string = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
private_key_filename = "private_key_" + random_string + ".pem"
public_key_filename = "public_key_" + random_string + ".pem"

user_namespace = "user"
user_service_name = "user-service"
filehandling_namespace = "filehandling"
filehandling_service_name = "filehandling-service"
challenge_namespace = "challenge"
challenge_service_name = "challenge-service"
solution_namespace = "solution"
solution_service_name = "solution-service"

# Write the private key to a file.
with open(private_key_filename, 'wb') as file:
    file.write(private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption()
    ))

# Write the public key to a file.
with open(public_key_filename, 'wb') as file:
    file.write(private_key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ))


def get_credentials(cluster_name, zone):
    # Initialize the Google Kubernetes Engine client
    client = container_v1.ClusterManagerClient()

    # Assumes you have set the GOOGLE_APPLICATION_CREDENTIALS environment variable
    project_id = "codehub-400314"

    # Construct the request to get cluster details
    name = f'projects/{project_id}/locations/{zone}/clusters/{cluster_name}'
    response = client.get_cluster(name=name)

    # Construct credentials for the Kubernetes client
    credentials = {
        'endpoint': response.endpoint,
        'certificate_authority': response.master_auth.cluster_ca_certificate,
        'access_token': client._transport._credentials.token,
    }
    return credentials


def create_deployment(cluster_name, zone, pod_yaml_file, pod_namespace):
    # Fetch credentials for the specified GKE cluster
    creds = get_credentials(cluster_name, zone)

    # Load the Kubernetes configuration dynamically with the fetched credentials
    # print(creds)
    configuration = client.Configuration()
    configuration.host = f'https://{creds["endpoint"]}'
    configuration.verify_ssl = False
    configuration.api_key = {'authorization': f'Bearer {creds["access_token"]}'}

    # Create a API client with the configured settings
    with client.ApiClient(configuration) as api_client:
        core_v1_api = client.CoreV1Api(api_client)
        apps_v1_api = client.AppsV1Api(api_client)

        # Load the Pod definition from a YAML file
        with open(pod_yaml_file, 'r') as f:
            file_contents = f.read()
            file_contents = file_contents.replace("<PROJECT_ID>", project_id)
            file_contents = file_contents.replace("<SECRET_FILE_NAME>", secret_id)
            file_contents = file_contents.replace("<STORAGE_BUCKET_NAME>", "codehub-public-keys")
            file_contents = file_contents.replace("<PUBLIC_KEY_FILENAME>", public_key_filename)
            file_contents = file_contents.replace("<FILE_HANDLING_URL>",
                                                  "http://{0}.{1}.svc.cluster.local".format(
                                                      filehandling_service_name,
                                                      filehandling_namespace
                                                  )
                                                  )
            file_contents = file_contents.replace("<FILE_HANDLING_PORT>", "80")
            file_contents = file_contents.replace("<SOLUTION_URL>",
                                                  "http://{0}.{1}.svc.cluster.local".format(
                                                      solution_service_name,
                                                      solution_namespace
                                                  )
                                                  )
            file_contents = file_contents.replace("<SOLUTION_PORT>", "80")
            file_contents = file_contents.replace("<USER_URL>",
                                                  "http://{0}.{1}.svc.cluster.local".format(
                                                      user_service_name,
                                                      user_namespace
                                                  )
                                                  )
            file_contents = file_contents.replace("<USER_PORT>", "80")
            file_contents = file_contents.replace("<CHALLENGE_URL>",
                                                  "http://{0}.{1}.svc.cluster.local".format(
                                                      challenge_service_name,
                                                      challenge_namespace
                                                  )
                                                  )
            file_contents = file_contents.replace("<CHALLENGE_PORT>", "80")
            # print(file_contents)
            pod_spec = yaml.safe_load(file_contents)

        # print("Listing pods with their IPs:")
        # pods = core_v1_api.list_pod_for_all_namespaces(watch=False)
        # for i in pods.items:
        #     print("%s\t%s\t%s" % (i.status.pod_ip, i.metadata.namespace, i.metadata.name))

        try:
            apps_v1_api.delete_namespaced_deployment(namespace=pod_namespace, name=pod_spec["metadata"]["name"])
        except:
            print("Deployment does not exist")
        # Create the Pod in the specified namespace (e.g., 'default')
        pod = apps_v1_api.create_namespaced_deployment(namespace=pod_namespace, body=pod_spec)
        print(f'Deployment {pod.metadata.name} created')


def create_service(cluster_name, zone, pod_yaml_file, pod_namespace):
    # Fetch credentials for the specified GKE cluster
    creds = get_credentials(cluster_name, zone)

    # Load the Kubernetes configuration dynamically with the fetched credentials
    # print(creds)
    configuration = client.Configuration()
    configuration.host = f'https://{creds["endpoint"]}'
    configuration.verify_ssl = False
    configuration.api_key = {'authorization': f'Bearer {creds["access_token"]}'}

    # Create a API client with the configured settings
    with client.ApiClient(configuration) as api_client:
        core_v1_api = client.CoreV1Api(api_client)

        # Load the Pod definition from a YAML file
        with open(pod_yaml_file, 'r') as f:
            file_contents = f.read()
            # print(file_contents)
            pod_spec = yaml.safe_load(file_contents)

        # print("Listing pods with their IPs:")
        # pods = core_v1_api.list_pod_for_all_namespaces(watch=False)
        # for i in pods.items:
        #     print("%s\t%s\t%s" % (i.status.pod_ip, i.metadata.namespace, i.metadata.name))

        services = core_v1_api.list_namespaced_service(namespace=pod_namespace)
        # Check if the service already exists
        if pod_spec["metadata"]["name"] in [service.metadata.name for service in services.items]:
            print("Service already exists")
            return
        # Create the Pod in the specified namespace (e.g., 'default')
        service = core_v1_api.create_namespaced_service(namespace=pod_namespace, body=pod_spec)
        print(f'Service {service.metadata.name} created')


def upload_private_key():
    # Create the parent secret.
    secret = secret_client.create_secret(
        request={
            "parent": parent,
            "secret_id": secret_id,
            "secret": {"replication": {"automatic": {}}},
        }
    )

    # Add the secret version.
    version = secret_client.add_secret_version(
        request={
            "parent": secret.name,
            "payload": {
                "data": private_key.private_bytes(
                    encoding=serialization.Encoding.PEM,
                    format=serialization.PrivateFormat.TraditionalOpenSSL,
                    encryption_algorithm=serialization.NoEncryption()
                )
            }
        }
    )


def upload_public_key():
    # Add the public key to the storage bucket.
    storage_client = storage.Client()

    bucket = storage_client.bucket("codehub-public-keys")
    blob = bucket.blob(public_key_filename)
    blob.upload_from_filename(public_key_filename)


upload_private_key()
upload_public_key()

# Example usage
global_cluster_name = 'codehub-cluster'
global_zone = 'europe-west6'
create_deployment(global_cluster_name, global_zone, "user-deployment.yaml", user_namespace)
create_service(global_cluster_name, global_zone, "user-service.yaml", user_namespace)
create_deployment(global_cluster_name, global_zone, "challenge-deployment.yaml", challenge_namespace)
create_service(global_cluster_name, global_zone, "challenge-service.yaml", challenge_namespace)
create_deployment(global_cluster_name, global_zone, "solution-deployment.yaml", solution_namespace)
create_service(global_cluster_name, global_zone, "solution-service.yaml", solution_namespace)
create_deployment(global_cluster_name, global_zone, "file-handling-deployment.yaml", filehandling_namespace)
create_service(global_cluster_name, global_zone, "file-handling-service.yaml", filehandling_namespace)
