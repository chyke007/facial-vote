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
        data: { key: VOTE_ADDED, value: null }
      };

    event.Records.forEach(async (record) => {
        console.log('Stream record(s): ', JSON.stringify(record, null, 2));

        if (record.eventName == 'INSERT') {
            try{
                console.log(record.dynamodb.Keys.PK.S)
                if(!(record.dynamodb.Keys.PK.S.slice(0, 5) == 'VOTES')){
                    return;
                }
                var { candidate_id, voting_id } = record.dynamodb.NewImage;
                
                var params = {
                    candidate_id: candidate_id.S, voting_id: voting_id.S
                };
                res.data.value = params;
    
                await publishToTopic(iotClient, VOTE_ADDED, res);
            }catch(e){
                callback(null, `Error processing ${e}`);
            }
           
        }
    });
    callback(null, `Successfully processed ${event.Records.length} records.`);
};   
