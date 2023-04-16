const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { publishToTopic, extractEmail } = require('../../../utils/helper');

AWS.config.update({ region: process.env.AWS_REGION });

const iotClient = new AWS.IotData({ endpoint: process.env.IOT_ENDPOINT });

module.exports.handler = async (event) => {
  const { key, faceId } = event.value;
  let res = {
    status: 'SUCCESS',
    vlaue: "IMAGE_ADDED"
  };

  let email = extractEmail(key)

  const dbParams = {
    TableName: process.env.DYNAMODB_NAME,
    Item: {
      PK: `FACE_ENTRY#${email}`,
      SK: `${faceId}#${key}`,
      Key: key,
      Email: email,
      FaceId: faceId,
    }
  };

  await dynamodb.put(dbParams).promise();
  await publishToTopic(iotClient, email, res);
  
  console.log(event);
  return res;
};