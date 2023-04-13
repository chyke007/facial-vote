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

  await client.searchFacesByImage(params, (err, response) => {
    if (err) {
      console.log(err, err.stack);
      res = {
        status: 'ERROR',
        value: err
      };
      return;
    } else {
      if (response.FaceMatches.length > 0) {
        res = {
          status: 'ERROR',
          value: "FACE_ALREADY_EXIST"
        };
        return;
      } else {
        res = {
          status: 'SUCCESS',
          value: { bucket, key }
        };
        return;
      }
    }
  })

  console.log(event);
  return res;
};