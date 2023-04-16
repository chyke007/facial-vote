const AWS = require('aws-sdk');
const { publishToTopic, extractEmail } = require('../../../utils/helper');

AWS.config.update({ region: process.env.AWS_REGION })
const iotClient = new AWS.IotData({ endpoint: process.env.IOT_ENDPOINT });

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
      value: err
    };
  } else {
    console.log(`Detected face(s) for: ${key}`)
    if (response.FaceDetails[0].Confidence < process.env.CONFIDENCE_FACE) {
      res = {
        status: 'ERROR',
        value: "NO_FACE_DETECTED"
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