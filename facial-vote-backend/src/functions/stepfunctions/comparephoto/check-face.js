const AWS = require('aws-sdk');
const { NO_FACE_FOUND } = require('../../../utils/constant');
const { publishToTopic, extractEmail } = require('../../../utils/helper');
const { IOT_ENDPOINT, AWS_REGION,COLLECTION_ID, CONFIDENCE_FACE } = process.env

AWS.config.update({region: AWS_REGION})
const iotClient = new AWS.IotData({ endpoint: IOT_ENDPOINT });

module.exports.handler = async (event) => {
  const { bucket, key } = event.value;
  
  let res = {
    status: 'SUCCESS'
  };

  const client = new AWS.Rekognition();
  const params = {
    CollectionId: COLLECTION_ID,
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key
      },
    },
    MaxFaces: 1,
    FaceMatchThreshold: CONFIDENCE_FACE
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
        data: { key: NO_FACE_FOUND, value: null }
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