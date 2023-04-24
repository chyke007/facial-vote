const AWS = require('aws-sdk');
const { setErrorResponse, setSuccessResponse } = require('../../utils/helper');
const { AWS_REGION, ADMIN_ACCESS_KEY, ADMIN_SECRET_KEY, USERPOOL_ID } = process.env

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({ region: AWS_REGION, accessKeyId: ADMIN_ACCESS_KEY, secretAccessKey: ADMIN_SECRET_KEY });

module.exports.handler = async (event, context, callback) => {
   
   try{
    let response = await cognitoIdentityServiceProvider.listUsers({ UserPoolId: USERPOOL_ID}).promise();
      return setSuccessResponse(response.Users)
    } catch (err) {
        return setErrorResponse(err)
    }
};