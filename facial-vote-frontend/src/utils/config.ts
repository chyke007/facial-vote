export default {
    MAX_ATTACHMENT_SIZE: 500000,
    S3: {
        REGION: process.env.REGION,
        BUCKET: process.env.BUCKET
    },
    Cognito: {
        REGION: process.env.REGION,
        USER_POOL_ID: process.env.USER_POOL_ID,
        APP_CLIENT_ID: process.env.APP_CLIENT_ID,
        IDENTITY_POOL_ID: process.env.IDENTITY_POOL_ID,
    }
}