const jose = require('jose');
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
    const jwt = await new  jose.EncryptJWT(value)
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