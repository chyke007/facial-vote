	
'use strict';
const AWS = require('aws-sdk');
const stepfunctions = new AWS.StepFunctions();
 
module.exports.handler = (event, context, callback) => {
  const bucket =  event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  const stateMachineArn = process.env.STATE_MACHINE_ARN;
  const params = {
    stateMachineArn,
    input: JSON.stringify({
      bucket, key
    })
  }
 
  return stepfunctions.startExecution(params).promise().then(() => {
    callback(null, `Your statemachine ${stateMachineArn} executed successfully`);
  }).catch(error => {
    callback(error.message);
  });
};