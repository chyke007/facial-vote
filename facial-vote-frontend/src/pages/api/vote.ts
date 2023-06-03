import config from "src/utils/config";
import type { NextApiRequest, NextApiResponse } from 'next'

var aws4 = require('aws4')

type ResponseData = {
  [key: string]: string
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const method = req.method;
  const body = JSON.parse(req.body);

  const host = config.Api.ENDPOINT_GATEWAY;
  const path = '/dev/vote';
  const service = 'execute-api';
  const headers = {
    'x-api-key': `${config.Api.APIKEY}`
  }

  var opts = {
    host,
    path,
    service,
    method,
    headers,
    body: JSON.stringify(body)
  }

  var signedRequest = aws4.sign(opts, {
    accessKeyId: body.credentials.AccessKeyId,
    secretAccessKey: body.credentials.SecretAccessKey,
    sessionToken: body.credentials.SessionToken
  })

  switch (method) {
    case 'POST':
      try {
        const response = await fetch(`${config.Api.ENDPOINT}/vote`, {
          headers: signedRequest.headers,
          method,
          body: JSON.stringify(body)
        });
        const data = await response.json();
        return res.status(200).json(data)
      } catch (error) {
        console.error(error);
      }
  }
}