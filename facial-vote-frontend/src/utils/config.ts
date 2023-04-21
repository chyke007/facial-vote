export default {
    MAX_ATTACHMENT_SIZE: 500000,
    S3: {
        REGION: process.env.NEXT_PUBLIC_REGION,
        BUCKET: process.env.NEXT_PUBLIC_BUCKET
    },
    Cognito: {
        REGION: process.env.NEXT_PUBLIC_REGION,
        USER_POOL_ID: process.env.NEXT_PUBLIC_USER_POOL_ID,
        APP_CLIENT_ID: process.env.NEXT_PUBLIC_APP_CLIENT_ID,
        IDENTITY_POOL_ID: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
    },
    IoT: {
        ENDPOINT: process.env.NEXT_PUBLIC_IOT_ENDPOINT
    },
    Api: {
        ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
        APIKEY:  process.env.NEXT_PUBLIC_API_KEY
    }
}