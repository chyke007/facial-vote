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
