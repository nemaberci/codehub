const functions = require('@google-cloud/functions-framework');
const {Storage} = require('@google-cloud/storage');
const googleContainer = require('@google-cloud/container');
const k8s = require('@kubernetes/client-node');
const yaml = require('js-yaml');
const fs = require('fs');
const {randomUUID} = require('crypto');
const {sign} = require('jsonwebtoken');

async function getCredentials(cluster, zone) {
    const client = new googleContainer.ClusterManagerClient();
    const projectId = await client.getProjectId();
    const accessToken = await client.auth.getAccessToken();
    const request = {
        name: `projects/${projectId}/locations/${zone}/clusters/${cluster}`
    };

    const [response] = await client.getCluster(request);
    // the following are the parameters added when a new k8s context is created
    return {
        // the endpoint set as 'cluster.server'
        endpoint: response.endpoint,
        // the certificate set as 'cluster.certificate-authority-data'
        certificateAuthority: response.masterAuth.clusterCaCertificate,
        // the accessToken set as 'user.auth-provider.config.access-token'
        accessToken: accessToken
    }
}

// Register a CloudEvent callback with the Functions Framework that will
// be executed when the Pub/Sub trigger topic receives a message.

const eventHandler = async cloudEvent => {

    console.log(cloudEvent.data.message.attributes);
    const baseYaml = fs.readFileSync('builder-job.yaml', 'utf8');
    const storage = new Storage();
    let privateKey = await storage.bucket("internal-keys").file("private2.pem").download();
    let privateKeyValue = privateKey[0].toString();

    let cluster = 'codehub-cluster-2'
    let zone = 'europe-west4'
    const k8sCredentials = await getCredentials(cluster, zone);
    const kc = new k8s.KubeConfig();

    kc.loadFromOptions({
        clusters: [{
            name: `cluster_${cluster}`,            // any name can be used here
            caData: k8sCredentials.certificateAuthority,  // <-- this is from getCredentials call
            server: `https://${k8sCredentials.endpoint}`, // <-- this is from getCredentials call
        }],
        users: [{
            name: `cluster_${cluster}`,
            authProvider: 'gcp',                          // the is not a required field
            token: k8sCredentials.accessToken             // <-- this is from getCredentials call
        }],
        contexts: [{
            name: `cluster_${cluster}`,
            user: `cluster_${cluster}`,
            cluster: `cluster_${cluster}`
        }],
        currentContext: `cluster_${cluster}`,
    });

    const listPodsClient = kc.makeApiClient(k8s.CoreV1Api);
    const pods = (await listPodsClient.listNamespacedPod('filehandling')).body.items;
    const podIp = pods[0].status.podIP;
    let formattedYaml = baseYaml.replace(
        "<FILE_HANDLER_URL>",
        `"${podIp}:3000"`
    ).replace(
        "<JOB_NAME>",
        `builder-job-${randomUUID().toString()}`
    ).replace(
        "<TOKEN>",
        sign({}, privateKeyValue, { expiresIn: "1h", algorithm: "RS256" })
    ).replace(
        "<ENTRY_POINT>",
        cloudEvent.data.message.attributes.entryPoint
    ).replace(
        "<CHALLENGE_ID>",
        cloudEvent.data.message.attributes.challengeId
    ).replace(
        "<SOLUTION_ID>",
        cloudEvent.data.message.attributes.solutionId
    ).replace(
        "<SOURCE_FOLDER_NAME>",
        cloudEvent.data.message.attributes.sourceFolderName
    ).replace(
        "<UPLOAD_FOLDER_NAME>",
        randomUUID().toString()
    )
    const spec = yaml.load(formattedYaml);
    //console.log(formattedYaml);

    const batchApi = kc.makeApiClient(k8s.BatchV1Api);
    let job = await batchApi.createNamespacedJob('builder', spec);
    //console.log(job);
}

functions.cloudEvent('helloPubSub', eventHandler);