const jose = require('jose');
const { SESv2 } = require("@aws-sdk/client-sesv2");
const ses = new SESv2()

const {
    JWT_EXPIRY: expiry,
    JWT_ISSUER: issuer,
    JWT_AUDIENCE: audience,
    JWT_SUBJECT: subject,
    JWT_SECRET: secret
} = process.env

exports.extractEmail = (key) => {
    let email = key.split('-');
    email = email[email.length - 2];
    return email
}


exports.extractFileName = (key) => {
    let fileName = key.split('/');
    fileName = fileName[fileName.length - 1];
    return fileName
}


exports.publishToTopic = async (client, topic, payload) => {

    try {
        const iotParams = {
            topic,
            payload: JSON.stringify(payload),
            qos: 1
        };

        let result = await client.publish(iotParams).promise()
        console.log('Message sent:', result);

    } catch (err) {
        console.error('iotPublish error:', err)
    }

}

exports.generateJwt = async (value) => {
    const secrethash = jose.base64url.decode(secret);
    const jwt = await new jose.EncryptJWT(value)
        .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
        .setIssuedAt()
        .setIssuer(issuer)
        .setAudience(audience)
        .setSubject(subject)
        .setExpirationTime(expiry)
        .encrypt(secrethash);
    return jwt
}

exports.decodeJwt = async (jwt) => {
    const secrethash = jose.base64url.decode(secret);
    const options = {
        issuer,
        audience,
        contentEncryptionAlgorithms: ["A256GCM"],
        keyManagementAlgorithms: ["dir"],
    };
    return await jose.jwtDecrypt(jwt, secrethash, options);
}

exports.setErrorResponse = (message, statusCode = 400) => {

    const res = {
        statusCode,
        body: JSON.stringify({
            error: message
        })
    }
    return res
}

exports.setSuccessResponse = (message, statusCode = 400) => {

    const res = {
        statusCode,
        body: JSON.stringify({
            message
        })
    }
    return res
}

exports.sendEmail = async (emailAddress, otpCode, ses_adddress) => {
    await ses.sendEmail({
        Destination: {
            ToAddresses: [emailAddress]
        },
        FromEmailAddress: ses_adddress,
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