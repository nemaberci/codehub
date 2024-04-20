import os
import sys
from google.cloud import pubsub_v1

publisher = pubsub_v1.PublisherClient()
topic_name = 'projects/{project_id}/topics/{topic}'.format(
    project_id='codehub-400314',
    topic='SolutionEvaluationUploaded',
)
print(sys.argv[1], sys.argv[2])
future = publisher.publish(topic_name, b'', targetFolderName=sys.argv[1], challengeId=sys.argv[2], solutionId=sys.argv[3], secretName=sys.argv[4])
print(future.result())