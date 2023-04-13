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
        DetectionAttributes: ['ALL']
    }

    await client.indexFaces(params, (err, response) => {
        if (err) {
            console.log(err, err.stack);
            res = {
                status: 'ERROR',
                value: err
            };
            return;
        } else {

            if (result.FaceRecords.length > 0) {
                const faceId = response.FaceRecords[0].Face.FaceId
                res = {
                    status: 'SUCCESS',
                    value: { bucket, key, faceId }
                };
                return;
            } else {
                res = {
                    status: 'ERROR',
                    value: "ERROR_INDEXING_FACE"
                };
                return;
            }


        }
    })

    console.log(event);
    return res;
};