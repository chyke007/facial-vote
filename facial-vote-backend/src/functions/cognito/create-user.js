const AWS = require('aws-sdk');
const { setErrorResponse, setSuccessResponse } = require('../../utils/helper');
const { AWS_REGION, ADMIN_ACCESS_KEY, ADMIN_SECRET_KEY, USERPOOL_ID, ADMIN_EMAIL } = process.env

var Chance = require('chance');
var chance = new Chance();

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({ region: AWS_REGION, accessKeyId: ADMIN_ACCESS_KEY, secretAccessKey: ADMIN_SECRET_KEY });

module.exports.handler = async (event, context, callback) => {
    const admin = event?.requestContext?.authorizer?.claims?.email || null;

    if (String(admin) != ADMIN_EMAIL) {
        return setErrorResponse('Forbidden', 403)
    }

    const { email } = JSON.parse(event.body);

    if (!email) {
        return setErrorResponse('Please provide user email')
    }

    var params = {
        UserPoolId: USERPOOL_ID,
        Username: email,
        DesiredDeliveryMediums: [
            'EMAIL'
        ],
        ForceAliasCreation: false,
        MessageAction: 'SUPPRESS',
        TemporaryPassword: chance.string({ length: 16 }),
        UserAttributes: [
            {
                Name: 'email',
                Value: email,
            },
            {
                Name: "email_verified",
                Value: "true"
            }
        ]
    };

    try {
        await cognitoIdentityServiceProvider.adminCreateUser(
            params
        ).promise();
        return setSuccessResponse("User created")
    } catch (err) {
        return setErrorResponse(err)
    }
};