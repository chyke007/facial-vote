export default {
    MAX_ATTACHMENT_SIZE: 500000,
    Cognito: {
        REGION: process.env.NEXT_PUBLIC_REGION,
        USER_POOL_ID: process.env.NEXT_PUBLIC_USER_POOL_ID,
        APP_CLIENT_ID: process.env.NEXT_PUBLIC_APP_CLIENT_ID,
        IDENTITY_POOL_ID: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
    },
    Api: {
        ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
        ENDPOINT_GATEWAY: process.env.NEXT_PUBLIC_API_ENDPOINT_GATEWAY,
        APIKEY:  process.env.NEXT_PUBLIC_API_KEY
    }
}