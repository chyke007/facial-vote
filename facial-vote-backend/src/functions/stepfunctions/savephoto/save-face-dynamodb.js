module.exports.handler = async (event) => {
    console.log(event);
        // save to dynamoddb
        // send to iot topic(success or failure)
        return {
          status: 'SUCCESS'
        };
};