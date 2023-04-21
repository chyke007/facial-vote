
'use strict';
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const { DYNAMODB_NAME } = process.env

module.exports.handler = async (event, context, callback) => {
    const {id} = event.pathParameters;

    const dbParams = {
        TableName: DYNAMODB_NAME,
        KeyConditionExpression: 'PK=:pk',
        ExpressionAttributeValues: {
            ":pk": `VOTES#${id}`
        }
    }

    const results = await dynamodb.query(dbParams).promise();
    const response = {
        statusCode: 200,
        body: JSON.stringify(results),
    };

    callback(null, response);
};