'use strict';
var AWS = require("aws-sdk");
const { VOTE_ADDED } = require('../../utils/constant');
const { publishToTopic } = require("../../utils/helper");
const { IOT_ENDPOINT, AWS_REGION } = process.env

AWS.config.update({region: AWS_REGION})
const iotClient = new AWS.IotData({ endpoint: IOT_ENDPOINT });

exports.handler = (event, context, callback) => {
    let res = {
        status: 'SUCCESS',
        data: { key: null, value: null }
      };

    event.Records.forEach(async (record) => {
        console.log('Stream record(s): ', JSON.stringify(record, null, 2));

        //streaming simply checks the pk and sk
        //and then sends a message with new vote
        //frontend simply increments the candidate vote with 1
        // if user want to get new result without realtime
        //they can refresh which would pull from VOTES#VOTING_ID
        // and show based on candidate grouping
        if (record.eventName == 'INSERT') {
            var who = JSON.stringify(record.dynamodb.NewImage);
            
            var params = {
                candidate_id: who,
                voting_id: ''
            };
            res.data.value = params
             await publishToTopic(iotClient, VOTE_ADDED, res);
        }
    });
    callback(null, `Successfully processed ${event.Records.length} records.`);
};   
