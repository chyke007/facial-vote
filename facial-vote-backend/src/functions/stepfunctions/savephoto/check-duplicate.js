const AWS = require('aws-sdk');

module.exports.handler = async (event) => {
  const { bucket, key } = event.value;
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

  await client.searchFacesByImage(params, (err, response) => {
    if (err) {
      console.log(err, err.stack);
      res = {
        status: 'ERROR',
        value: err
      };
      return;
    } else {
      console.log(`Found face for: ${photo}`);
      if (response.FaceDetails.Confidence) {
        res = {
          status: 'ERROR',
          value: "FACE_ALREADY_EXIST"
        };
        return;
      } else {
        res = {
          status: 'SUCCESS',
          value: { bucket, key, index: response }
        };
        return;
      }
    }
  })

  console.log(event);
  return res;
};