
'use strict';
const AWS = require('aws-sdk');
const dayjs = require('dayjs');
const { v4: uuidv4 } = require('uuid');

const { setErrorResponse, setSuccessResponse } = require('../../utils/helper');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const { DYNAMODB_NAME, ADMIN_EMAIL } = process.env

const validateCandidates = async (candidates) => {

    let listCandidates = candidates.split(',');

    if (listCandidates.length < 2) {
        return false
    }

    const candidatesList = listCandidates.map(cand => {
        return {
            id: uuidv4(),
            name: cand
        }
    })
    return candidatesList;
}

const checkDateRange = async (time_start, time_end) => {

    let res = { error: false };

    if ((!dayjs(time_start).isValid() || !dayjs(time_end).isValid())) {
        res.error = "Provide valid time"
    }

    //UTC +1
    else if (dayjs(time_end).isBefore(dayjs(time_start))) {
        res.error = "End date must be after start date";
    } else if (dayjs().add(1, 'hour').isAfter(dayjs(time_start))) {
        res.error = "Start date must be in the future";
    }
    return res;
}

module.exports.handler = async (event) => {
    const admin = event?.requestContext?.authorizer?.claims?.email || null;

    if (String(admin) != ADMIN_EMAIL) {
        return setErrorResponse('Forbidden', 403)
    }

    const { time_start, time_end, name, description, candidates } = JSON.parse(event.body);

    if (!time_start || !name || !time_end || !candidates) {
        return setErrorResponse('Please provide all details')
    }

    const extractedCandidates = await validateCandidates(candidates);

    if (!extractedCandidates) {
        return setErrorResponse('Please provide comma seperated names with at least 2 candidates');
    }

    const range = await checkDateRange(time_start, time_end);

    if (range.error) {
        return setErrorResponse(range.error);
    }

    const votingId = uuidv4();

    const dbParams = {
        TableName: DYNAMODB_NAME,
        Item: {
            PK: `VOTING#true`,
            SK: `${votingId}#${name}`,
            candidates: JSON.stringify(extractedCandidates),
            date_created: dayjs().toDate().toISOString(),
            date_updated: dayjs().toDate().toISOString(),
            description,
            id: votingId,
            name,
            status: true,
            time_end,
            time_start
        }
    };
    await dynamodb.put(dbParams).promise();

    return setSuccessResponse("Vote category added");
};