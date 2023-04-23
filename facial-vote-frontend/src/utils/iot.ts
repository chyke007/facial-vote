import { awsExport } from 'src/utils/aws-export';
const AWSIoTData = require('aws-iot-device-sdk')
const AWS = require('aws-sdk')
import config from 'src/utils/config';

export default async (callme: any) => {
  const AWSConfiguration = {
    poolId: awsExport.Auth.identityPoolId,
    host: config.IoT.ENDPOINT,
    region: awsExport.Auth.region,
  }

  const clientId = 'facialvote-' + (Math.floor((Math.random() * 100000) + 1))
  AWS.config.region = AWSConfiguration.region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: AWSConfiguration.poolId
  })

  const creds = await getCreds();
  
  const mqttClient = AWSIoTData.device({
    region: AWS.config.region,
    host: AWSConfiguration.host,
    clientId: clientId,
    protocol: 'wss',
    maximumReconnectTimeMs: 8000,
    debug: false,
    accessKeyId: creds.Credentials.AccessKeyId,
    secretKey: creds.Credentials.SecretKey,
    sessionToken: creds.Credentials.SessionToken
  })

  mqttClient.on('connect', function () {
    callme(mqttClient)
    console.log('mqttClient connected')
  })

  return mqttClient;
}

const getCreds = async (): Promise<any> => {
  const cognitoIdentity = new AWS.CognitoIdentity()
  return new Promise((resolve, reject) => {
    AWS.config.credentials.get(function (err: any) {
      if (!err) {
        const params = {
          IdentityId: AWS.config.credentials.identityId
        }
        cognitoIdentity.getCredentialsForIdentity(params, function (err: any, data: any) {
          if (!err) {
            resolve(data)
          } else {
            console.log('Error retrieving credentials: ' + err)
            reject(err)
          }
        })
      } else {
        console.log('Error retrieving identity:' + err)
        reject(err)
      }
    })
  })
}
