
'use strict';
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { decodeJwt } = require('../../utils/helper');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const { DYNAMODB_NAME } = process.env
// uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

const validateVoting = async (votingId) => {
    //checks if voting exist
    //throw error or return voting
    return true;
}

const validateCandidate = async (payload, candidateId) => {
    //checks for candidateid in array or candidates
    return true;
}

const validateUser = async (userId) => {
    //unsign and decrpt face_id
    try {
        const user = await decodeJwt(userId) || null
        //then search for user in dynamodb
        console.log(user)
        return user;
    } catch (err) {
        throw err
    }

}

const getVoting = async () => {
    return true;
}

const checkDateRange = async (voting) => {
    // gets range and compares if  time is expired
    //cheks if time has started
    return true;
}

module.exports.handler = async (event, context, callback) => {
    const { voting_id, candidate_id, user_id } = JSON.parse(event.body);

    const res = {
        statusCode: 200,
        body: null,
    };

    try {
        if (!voting_id || !candidate_id || !user_id) {
            res.statusCode = 400;
            res.body = 'Please provide all details'
            return callback(null, res)
        }

        const decryptedUser = await validateUser(user_id);
        const voting = await validateVoting(voting_id)
        await validateCandidate(voting, candidate_id)
        await checkDateRange(voting);
        console.log("User: ", decryptedUser)
        // const dbParams = {
        //     TableName: DYNAMODB_NAME,
        //     Item: {
        //       PK: `VOTES#${voting_id}`,
        //       SK: `${user_id}#${candidate_id}`,
        //       voting_id,
        //       user_id,
        //       candidate_id
        //     }
        //   };
        // console.log(dbParams)
        // await dynamodb.put(dbParams).promise();

        res.body = "Vote added"
        callback(null, res);

    } catch (err) {
        throw err
    }

    
};