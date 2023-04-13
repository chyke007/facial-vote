const AWS = require('aws-sdk');

module.exports.handler = async (event) => {
  const { key, faceId } = event.value;
  let res = {
    status: 'SUCCESS'
  };

  let email = key.split('-');
  email = email[email.length - 1];

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

  await dynamodb.putItem(dbParams).promise();

  console.log(event);
  return res;
};