const AWS = require('aws-sdk');
const Chance = require('chance')
const chance = new Chance()
const dynamodb = new AWS.DynamoDB.DocumentClient();

const { publishToTopic, extractFileName, sendEmail } = require('../../../utils/helper');
const { NO_FACE_FOUND } = require('../../../utils/constant');
const { IOT_ENDPOINT, AWS_REGION, DYNAMODB_NAME, SES_FROM_ADDRESS } = process.env
let otp;

AWS.config.update({ region: AWS_REGION });

const iotClient = new AWS.IotData({ endpoint: IOT_ENDPOINT });

const getUser = async (userId) => {

    try {

        const dbParams = {
            TableName: DYNAMODB_NAME,
            IndexName: 'GS1',
            KeyConditionExpression: 'GS1PK=:pk',
            ExpressionAttributeValues: {
                ":pk": `FACE_ENTRY#${userId}`
            }
        }

        const results = await dynamodb.query(dbParams).promise();

        if (!(results && results.Items.length == 1)) {
            console.log("User face doesnt exist");
            return false
        }
        return results.Items[0];
    } catch (e) {
        return false
    }


}

module.exports.handler = async (event) => {
    const { key, faceId } = event.value;
    let res = {
        status: 'SUCCESS'
    };

    const user = await getUser(faceId);

    if (!user) {
        res = {
            status: 'ERROR',
            data: { key: NO_FACE_FOUND, value: null }
        };

        await publishToTopic(iotClient, extractFileName(key), res);
    } else {

        otp = chance.string({ length: 6, alpha: false, symbols: false })
        await sendEmail(user.email, otp, SES_FROM_ADDRESS)

        res = {
            status: 'SUCCESS',
            value: { key, faceId, otp }
        };
    }
    return res;
};