const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const { key, faceId } = event.value;
  let res = {
    status: 'SUCCESS'
  };

  let email = key.split('-');
  email = email[email.length - 2];

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

  console.log(event);
  return res;
};