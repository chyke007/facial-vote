
'use strict';
const AWS = require('aws-sdk');
const dayjs = require('dayjs')
const { decodeJwt } = require('../../utils/helper');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const { DYNAMODB_NAME } = process.env

const validateVoting = async (votingId) => {
    try {
        const dbParams = {
            TableName: DYNAMODB_NAME,
            KeyConditionExpression: 'PK=:pk and begins_with(SK, :sk)',
            ExpressionAttributeValues: {
                ":pk": `VOTING#true`,
                ":sk": `${votingId}`
            }
        }

        const results = await dynamodb.query(dbParams).promise();
        
        if (!(results && results.Items.length == 1)) {
            console.log("Voting category doesnt exist");
            return false
        }
        return results.Items[0];
    } catch (e) {
        return false
    }
}

const validateCandidate = async (payload, candidateId) => {
    const candidates = JSON.parse(payload.candidates)
    return candidates.find(({ id }) => id === candidateId);
}

const validateUser = async (userId) => {

    try {
        const user = await decodeJwt(userId);
        const dbParams = {
            TableName: DYNAMODB_NAME,
            IndexName: 'GS1',
            KeyConditionExpression: 'GS1PK=:pk',
            ExpressionAttributeValues: {
                ":pk": `FACE_ENTRY#${user.payload.faceId}`
            }
        }

        const results = await dynamodb.query(dbParams).promise();

        if (!(results && results.Items.length == 1)) {
            console.log("User face doesnt exist");
            return false
        }
        return user;
    } catch (e) {
        return false
    }


}

const checkDateRange = async (voting) => {

    let res = { error: false }
    
    if(dayjs().isBefore(dayjs(voting.time_start))){
        res.error = "Voting hasn't begun";
    }else if(dayjs().isAfter(dayjs(voting.time_end))){
        res.error = "Voting has ended";
    }
    return res;
}

const validateUserCanVote = async (votingId, userId) => {
    try {
        const dbParams = {
            TableName: DYNAMODB_NAME,
            KeyConditionExpression: 'PK=:pk and begins_with(SK, :sk)',
            ExpressionAttributeValues: {
                ":pk": `VOTES#${votingId}`,
                ":sk": `${userId}#`
            }
        }

        const results = await dynamodb.query(dbParams).promise();
        
        if (results && results.Items.length == 1) {
            console.log(1, `${userId} already voted in ${votingId}`);
            return false
        }
        return true;
    } catch (e) {
        return false
    }
}

const setErrorResponse = (message, statusCode = 400) => {

    const res = {
        statusCode,
        body: JSON.stringify({
            error: {
                message
            }
        })
    }
    return res
}

const setSuccessResponse = (message, statusCode = 400) => {

    const res = {
        statusCode,
        body: JSON.stringify({
            message
        })
    }
    return res
}

module.exports.handler = async (event) => {
    const { voting_id, candidate_id, user_id } = JSON.parse(event.body);

    if (!voting_id || !candidate_id || !user_id) {
        return setErrorResponse('Please provide all details')
    }

    const decryptedUser = await validateUser(user_id);
    
    if (!decryptedUser) {
        return setErrorResponse('Token expired, kindly reupload your face to vote')
    }
    const voting = await validateVoting(voting_id);
    if (!voting) {
        return setErrorResponse('Vote category not found')
    }

    const candidate = await validateCandidate(voting, candidate_id);

    if (!candidate) {
        return setErrorResponse('Candidate not found');
    }

    const canVote = await validateUserCanVote(voting_id, decryptedUser.payload.faceId);

    if (!canVote) {
        return setErrorResponse('Already voted');
    }

    const range = await checkDateRange(voting);

    if (range.error) {
        return setErrorResponse(range.error);
    }

    const dbParams = {
        TableName: DYNAMODB_NAME,
        Item: {
          PK: `VOTES#${voting_id}`,
          SK: `${decryptedUser.payload.faceId}#${candidate_id}`,
          voting_id,
          user_id: decryptedUser.payload.faceId,
          candidate_id,
          candidate_name: candidate.name
        }
      };
    await dynamodb.put(dbParams).promise();

    return setSuccessResponse("Vote added");
};