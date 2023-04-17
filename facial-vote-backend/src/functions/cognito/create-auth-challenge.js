const AWS = require('aws-sdk');
const _ = require('lodash')
const Chance = require('chance')
const chance = new Chance()
const { SESv2 } = require("@aws-sdk/client-sesv2");
const ses = new SESv2()
const { MAX_ATTEMPTS, FACE_ALREADY_ADDED } = require('../../utils/constant');
const { publishToTopic } = require('../../utils/helper');
const { SES_FROM_ADDRESS, DYNAMODB_NAME, IOT_ENDPOINT } = process.env


const dynamodb = new AWS.DynamoDB.DocumentClient();
const iotClient = new AWS.IotData({ endpoint: IOT_ENDPOINT });

module.exports.handler = async (event) => {
  if (!event.request.userAttributes.email) {
    throw new Error("missing email")    
  }

  let otpCode;
  let email = event.request.userAttributes.email;

  let res = {
    status: 'ERROR',
    data: { key: FACE_ALREADY_ADDED, value: email }
  };

  if(email){
    const dbParams = {
      TableName: DYNAMODB_NAME,
      KeyConditionExpression: 'PK=:pk',
      ExpressionAttributeValues: {
          ":pk": `FACE_ENTRY#${email}`
      }
  }

  const results = await dynamodb.query(dbParams).promise();
  if(results.Count >= 1){

    await publishToTopic(iotClient, email, res);
    throw new Error("Face already added to provided email")    
  }
  }

  if (!event.request.session || !event.request.session.length) {
    // new auth session
    otpCode = chance.string({ length: 6, alpha: false, symbols: false })
    await sendEmail(email, otpCode)
  } else {
    // existing session, user has provided a wrong answer, so we need to
    // give them another chance
    const previousChallenge = _.last(event.request.session)
    const challengeMetadata = previousChallenge?.challengeMetadata

    if (challengeMetadata) {
      // challengeMetadata should start with "CODE-", hence index of 5
      otpCode = challengeMetadata.substring(5)
    }
  }

  const attempts = _.size(event.request.session)
  const attemptsLeft = MAX_ATTEMPTS - attempts
  event.response.publicChallengeParameters = {
    email: event.request.userAttributes.email,
    maxAttempts: MAX_ATTEMPTS,
    attempts,
    attemptsLeft
  }

  // NOTE: the private challenge parameters are passed along to the 
  // verify step and is not exposed to the caller
  // need to pass the secret code along so we can verify the user's answer
  event.response.privateChallengeParameters = { 
    secretLoginCode: otpCode
  }

  event.response.challengeMetadata = `CODE-${otpCode}`

  return event
}

async function sendEmail(emailAddress, otpCode) {
  await ses.sendEmail({
    Destination: {
      ToAddresses: [ emailAddress ]
    },
    FromEmailAddress: SES_FROM_ADDRESS,
    Content: {
      Simple: {
        Subject: {
          Charset: 'UTF-8',
          Data: 'Your one-time login code'
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<html><body><p>This is your one-time login code:</p>
                  <h3>${otpCode}</h3></body></html>`
          },
          Text: {
            Charset: 'UTF-8',
            Data: `Your one-time login code: ${otpCode}`
          }
        }
      }
    }
  })
}