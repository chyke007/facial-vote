const AWS = require('aws-sdk');
const { NO_FACE_DETECTED_IN_PHOTO } = require('../../../utils/constant');
const { publishToTopic, extractEmail, extractFileName } = require('../../../utils/helper');
const { IOT_ENDPOINT, AWS_REGION, CONFIDENCE_FACE } = process.env

AWS.config.update({ region: AWS_REGION })
const iotClient = new AWS.IotData({ endpoint: IOT_ENDPOINT });

module.exports.handler = async (event) => {
  const { bucket, key } = event;
  let res = {
    status: 'SUCCESS'
  };

  const client = new AWS.Rekognition();
  const params = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key
      },
    },
    Attributes: ['ALL']
  }

  const response = await client.detectFaces(params).promise();
  if (!response) {
    console.log(err, err.stack);
    res = {
      status: 'ERROR',
      data: { key: err, value: null }
    };
  } else {
    console.log(`Detected face(s) for: ${key}`)
    if (response.FaceDetails && response.FaceDetails[0] && response.FaceDetails[0].Confidence >= CONFIDENCE_FACE) {
      res = {
        status: 'SUCCESS',
        value: { bucket, key }
      };
    } else {
      res = {
        status: 'ERROR',
        data: { key: NO_FACE_DETECTED_IN_PHOTO, value: null }
      };

      await publishToTopic(iotClient, extractFileName(key), res);
      await publishToTopic(iotClient, extractEmail(key), res);
    }
  }

  return res;
};