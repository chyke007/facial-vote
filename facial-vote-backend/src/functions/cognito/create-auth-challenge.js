const AWS = require('aws-sdk');
const _ = require('lodash');
const Chance = require('chance');
const chance = new Chance();
const { MAX_ATTEMPTS } = require('../../utils/constant');
const { sendEmail } = require('../../utils/helper');
const { SES_FROM_ADDRESS, DYNAMODB_NAME, IOT_ENDPOINT } = process.env

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  if (!event.request.userAttributes.email) {
    throw new Error("missing email")
  }

  let otpCode;
  let email = event.request.userAttributes.email;


  if (email) {
    const dbParams = {
      TableName: DYNAMODB_NAME,
      KeyConditionExpression: 'PK=:pk',
      ExpressionAttributeValues: {
        ":pk": `FACE_ENTRY#${email}`
      }
    }

    const results = await dynamodb.query(dbParams).promise();
    if (results.Count >= 1) {
      throw new Error("Face already added to provided email")
    }
  }

  if (!event.request.session || !event.request.session.length) {
    // new auth session
    otpCode = chance.string({ length: 6, alpha: false, symbols: false })
    await sendEmail(email, otpCode, SES_FROM_ADDRESS)
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