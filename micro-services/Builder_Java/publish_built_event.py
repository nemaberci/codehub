import os
import sys
from google.cloud import pubsub_v1

publisher = pubsub_v1.PublisherClient()
topic_name = 'projects/{project_id}/topics/{topic}'.format(
    project_id='codehub-400314',
    topic='SolutionBuilt',
)

client = pubsub_v1.PublisherClient()
topic_path = client.topic_path('codehub-400314', 'SolutionBuilt')

permissions_to_check = ["pubsub.topics.publish"]

allowed_permissions = client.test_iam_permissions(
    request={"resource": topic_path, "permissions": permissions_to_check}
)

print(
    "Allowed permissions for topic {}: {}".format(topic_path, allowed_permissions)
)

future = publisher.publish(topic_name, b'', entryPoint=sys.argv[1].replace(".java", ""), targetFolderName=sys.argv[2], challengeId=sys.argv[3], solutionId=sys.argv[4])
print(future.result())