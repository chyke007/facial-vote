import config from 'src/utils/config'

export default {  
    Auth: {
        region: config.Cognito.REGION,
        userPoolId: config.Cognito.USER_POOL_ID,
        identityPoolId: config.Cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.Cognito.APP_CLIENT_ID,
        mandatorySignIn: true
    },
    Storage: {
        region: config.S3.REGION,
        bucket: config.S3.BUCKET,
        identityPoolId: config.Cognito.IDENTITY_POOL_ID
    }
}