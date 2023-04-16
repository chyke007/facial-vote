const AWS = require('aws-sdk');
const { publishToTopic, extractEmail } = require('../../../utils/helper');

AWS.config.update({ region: process.env.AWS_REGION })
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
        DetectionAttributes: ['ALL']
    }

    const response = await client.indexFaces(params).promise();
    if (!response) {
        console.log(err, err.stack);
        res = {
            status: 'ERROR',
            value: err
        };
    } else {
        if (response.FaceRecords.length > 0) {
            const faceId = response.FaceRecords[0].Face.FaceId
            res = {
                status: 'SUCCESS',
                value: { bucket, key, faceId }
            };
        } else {
            res = {
                status: 'ERROR',
                value: "ERROR_INDEXING_FACE"
            };


            await publishToTopic(iotClient, extractEmail(key), res);
        }
    }

    return res;
};