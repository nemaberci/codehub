import os
import sys
from google.cloud import pubsub_v1

publisher = pubsub_v1.PublisherClient()
topic_name = 'projects/{project_id}/topics/{topic}'.format(
    project_id='codehub-400314',
    topic='SolutionUploaded',
)

client = pubsub_v1.PublisherClient()
topic_path = client.topic_path('codehub-400314', 'SolutionBuilt')

permissions_to_check = ["pubsub.topics.publish", "pubsub.topics.update"]

allowed_permissions = client.test_iam_permissions(
    request={"resource": topic_path, "permissions": permissions_to_check}
)

print(
    "Allowed permissions for topic {}: {}".format(topic_path, allowed_permissions)
)

future = publisher.publish(topic_name, b'', entryPoint='test.cpp', sourceFolderName='test-cpp', challengeId='challenge-f51d301a-59f6-4118-ac1e-c031074ca737', solutionId='WXHd5S65lcnAOv0T6YsW', secretName='kjziyxjxzw', imageName='cpp-builder')
print(future.result())