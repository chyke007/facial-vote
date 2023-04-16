const AWS = require('aws-sdk');
const { publishToTopic, extractFileName } = require('../../../utils/helper');

AWS.config.update({ region: process.env.AWS_REGION });

const sts = new AWS.STS({ region: process.env.AWS_REGION, accessKeyId: process.env.STS_ACCESS_KEY, secretAccessKey: process.env.STS_SECRET_KEY });
const iotClient = new AWS.IotData({ endpoint: process.env.IOT_ENDPOINT });

module.exports.handler = async (event) => {
    const { key } = event.value;
    let res = {
        status: 'SUCCESS',
        data: { key: "STS_TOKEN", value: null }
    };

    const params = {
        DurationSeconds: process.env.STS_EXPIRY
    };

    const credentials = await sts
        .getSessionToken(params)
        .promise()

    res.data.value = credentials

    console.log("Credentials: ", credentials)
    const file_name = extractFileName(key)

    await publishToTopic(iotClient, file_name, res);

    console.log(event);
    return res;
};