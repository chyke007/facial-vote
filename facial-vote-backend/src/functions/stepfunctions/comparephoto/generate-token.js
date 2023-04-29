const AWS = require('aws-sdk');
const { STS_TOKEN } = require('../../../utils/constant');
const { publishToTopic, extractFileName, generateJwt } = require('../../../utils/helper');
const { IOT_ENDPOINT, AWS_REGION, STS_ACCESS_KEY, STS_SECRET_KEY, STS_EXPIRY } = process.env

AWS.config.update({ region: AWS_REGION });

const sts = new AWS.STS({ region: AWS_REGION, accessKeyId: STS_ACCESS_KEY, secretAccessKey: STS_SECRET_KEY });
const iotClient = new AWS.IotData({ endpoint: IOT_ENDPOINT });

module.exports.handler = async (event) => {
    const { key, faceId, otp } = event.value;
    let res = {
        status: 'SUCCESS',
        data: { key: STS_TOKEN, value: null }
    };

    const params = {
        DurationSeconds: STS_EXPIRY
    };

    const credentials = await sts
        .getSessionToken(params)
        .promise()

    const userId = await generateJwt({ faceId, otp });

    res.data.value = { userId, ...credentials.Credentials };
    const file_name = extractFileName(key)

    await publishToTopic(iotClient, file_name, res);
    return res;
};