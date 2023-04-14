const AWS = require('aws-sdk');

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
      value: err
    };
  } else {
    if (response.FaceMatches.length > 0) {
      res = {
        status: 'ERROR',
        value: "FACE_ALREADY_EXIST"
      };
    } else {
      res = {
        status: 'SUCCESS',
        value: { bucket, key }
      };
    }
  }

  return res;
};