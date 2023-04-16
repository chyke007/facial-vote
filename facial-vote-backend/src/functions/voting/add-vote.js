
'use strict';
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context, callback) => {

    //Add vote
    const response = {
        statusCode: 200,
        body: JSON.stringify(event),
    };

    callback(null, response);
};