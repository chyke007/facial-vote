const AWS = require('aws-sdk');
const { publishToTopic, extractEmail } = require('../../../utils/helper');

AWS.config.update({region: process.env.AWS_REGION})
const iotClient = new AWS.IotData({ endpoint: process.env.IOT_ENDPOINT });

module.exports.handler = async (event) => {
  const { bucket, key } = event.value;
  
  let res = {
    status: 'SUCCESS'
  };

  const client = new AWS.Rekognition();
  const params = {
    CollectionId: process.env.COLLECTION_ID,
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key
      },
    },
    MaxFaces: 1,
    FaceMatchThreshold: process.env.CONFIDENCE_FACE
  }

  let response = await client.searchFacesByImage(params).promise()
  if (!response) {
    console.log(err, err.stack);
    res = {
      status: 'ERROR',
      data: { key: err, value: null }
    };
  } else {
    if (response.FaceMatches.length < 1) {
      res = {
        status: 'ERROR',
        data: { key: "NO_FACE_FOUND", value: null }
      };

      await publishToTopic(iotClient, extractEmail(key), res);
    } else {
      res = {
        status: 'SUCCESS',
        value: { bucket, key }
      };
    }
  }

  return res;
};