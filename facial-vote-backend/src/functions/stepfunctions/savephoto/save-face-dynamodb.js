const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { publishToTopic, extractEmail } = require('../../../utils/helper');
const { IOT_ENDPOINT, AWS_REGION, DYNAMODB_NAME } = process.env

AWS.config.update({ region: AWS_REGION });

const iotClient = new AWS.IotData({ endpoint: IOT_ENDPOINT });

module.exports.handler = async (event) => {
  const { key, faceId } = event.value;
  let res = {
    status: 'SUCCESS',
    data: { key: "IMAGE_ADDED", value: null }
  };

  let email = extractEmail(key)

  const dbParams = {
    TableName: DYNAMODB_NAME,
    Item: {
      PK: `FACE_ENTRY#${email}`,
      SK: `${faceId}#${key}`,
      GS1PK: `FACE_ENTRY#${faceId}`,
      GS1SK: `${email}#${key}`,
      key: key,
      email: email,
      face_id: faceId,
    }
  };

  await dynamodb.put(dbParams).promise();
  await publishToTopic(iotClient, email, res);

  console.log(event);
  return res;
};