const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { publishToTopic, extractEmail } = require('../../../utils/helper');

AWS.config.update({ region: process.env.AWS_REGION });

const iotClient = new AWS.IotData({ endpoint: process.env.IOT_ENDPOINT });

module.exports.handler = async (event) => {
  const { key, faceId } = event.value;
  let res = {
    status: 'SUCCESS',
    data: { key: "IMAGE_ADDED", value: "token"}
  };

  
  await publishToTopic(iotClient, email, res);
  
  console.log(event);
  return res;
};