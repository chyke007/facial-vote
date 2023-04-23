const AWS = require('aws-sdk');
const { ERROR_INDEXING_FACE } = require('../../../utils/constant');
const { publishToTopic, extractEmail } = require('../../../utils/helper');
const { IOT_ENDPOINT, AWS_REGION, COLLECTION_ID } = process.env

AWS.config.update({ region: AWS_REGION })
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
        DetectionAttributes: ['ALL']
    }

    const response = await client.indexFaces(params).promise();
    if (!response) {
        console.log(err, err.stack);
        res = {
            status: 'ERROR',
            data: { key: err, value: null }
        };
    } else {
        if (response.FaceRecords && response.FaceRecords.length > 0) {
            const faceId = response.FaceRecords[0].Face.FaceId
            res = {
                status: 'SUCCESS',
                value: { bucket, key, faceId }
            };
        } else {
            res = {
                status: 'ERROR',
                data: { key: ERROR_INDEXING_FACE, value: null }
            };


            await publishToTopic(iotClient, extractEmail(key), res);
        }
    }

    return res;
};