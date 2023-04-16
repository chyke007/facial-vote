const AWS = require('aws-sdk');
const sts = new AWS.STS;
const { publishToTopic, extractFileName } = require('../../../utils/helper');

AWS.config.update({ region: process.env.AWS_REGION });

const iotClient = new AWS.IotData({ endpoint: process.env.IOT_ENDPOINT });

module.exports.handler = async (event) => {
    const { key } = event.value;
    let res = {
        status: 'SUCCESS',
        data: { key: "STS_TOKEN", value: null }
    };

    const params = {
        DurationSeconds: 3600
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