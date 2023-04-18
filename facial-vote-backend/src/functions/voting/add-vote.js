
'use strict';
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context, callback) => {

    //status is default true
    //mvp 
    //Add vote

    //before add, check
    //status, date range, id valid, candidate valid, user valid
    //create to dynamodb trigger lambda
    const response = {
        statusCode: 200,
        body: event.body,
    };

    callback(null, response);
};