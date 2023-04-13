const AWS = require('aws-sdk');

module.exports.handler = async (event) => {
  const input = event.Input;
  const { bucket, key } = input.customParams;
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

  await client.detectFaces(params, (err, response) => {
    if (err) {
      console.log(err, err.stack);
      res = {
        status: 'ERROR',
        value: err
      };
      return;
    } else {
      console.log(`Detected face(s) for: ${photo}`)
      if (response.FaceDetails[0].Confidence < process.env.CONFIDENCE_FACE) {
        res = {
          status: 'ERROR',
          value: "NO_FACE_DETECTED"
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