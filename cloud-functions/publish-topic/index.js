const functions = require('@google-cloud/functions-framework');

const {PubSub} = require('@google-cloud/pubsub');

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

async function publishMessageWithCustomAttributes(topicNameOrId, data) {
  // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
  const dataBuffer = Buffer.from(data);

  // Add two custom attributes, origin and username, to the message
  const customAttributes = {
    origin: 'nodejs-sample',
    username: 'gcp',
  };

  const messageId = await pubSubClient
    .topic(topicNameOrId)
    .publishMessage({data: dataBuffer, attributes: customAttributes});
  console.log(`Message ${messageId} published.`);
}

functions.http('helloHttp', (req, res) => {
  res.send(`Hello ${req.query.name || req.body.name || 'World'}!`);
});
