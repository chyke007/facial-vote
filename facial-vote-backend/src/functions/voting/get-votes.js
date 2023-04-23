
'use strict';
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const { DYNAMODB_NAME } = process.env

const groupBy = (list, keyGetter) => {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

module.exports.handler = async (event, context, callback) => {
    const { id } = event.pathParameters;

    const dbParams = {
        TableName: DYNAMODB_NAME,
        KeyConditionExpression: 'PK=:pk',
        ExpressionAttributeValues: {
            ":pk": `VOTES#${id}`
        }
    }

    const results = await dynamodb.query(dbParams).promise();
    let response;
    if (results.Count == 0) {
        response = {
            statusCode: 200,
            body: JSON.stringify(results),
        };

    } else {

        const grouped = groupBy(results.Items, item => item.candidate_id);

        let groupedVotes = [];
        grouped.forEach(e => {
            groupedVotes.push({
                candidate_id: e[0].candidate_id,
                candidate_name: e[0].candidate_name,
                candidate_vote: e.length
            })
        })

        console.log(groupedVotes)

        response = {
            statusCode: 200,
            body: JSON.stringify({ Items: groupedVotes, Count: groupedVotes.length })
        }
    }

    callback(null, response);
};