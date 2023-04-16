
'use strict';
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context, callback) => {

    const dbParams = {
        TableName: process.env.DYNAMODB_NAME,
        KeyConditionExpression: 'begins_with(PK, :pk)',
        ExpressionAttributeValues: {
            ":pk": "VOTING#"
        }
    }

    const results = await dynamodb.query(dbParams).promise();
    //get all voting in progress
    const response = {
        statusCode: 200,
        body: JSON.stringify(results),
    };

    callback(null, response);
};