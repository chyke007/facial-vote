import config from "src/utils/config";
import type { NextApiRequest, NextApiResponse } from 'next'

var aws4 = require('aws4')

type ResponseData = {
  [key: string]: any
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const method = req.method;
  const body = JSON.parse(req.body);
  const headers = {
    'x-api-key': `${config.Api.APIKEY}`,
    'Content-Type': 'application/json'
  }

  let requestOptions = {
    host: `${config.Api.ENDPOINT}`,
    path: '/vote',
    service: 'execute-api',
    headers
  }
  console.log(body.credentials)

  aws4.sign(requestOptions, {
    secretAccessKey: body.credentials.SecretAccessKey,
    accessKeyId: body.credentials.AccessKeyId,
    sessionToken: body.credentials.SessionToken,
  })

  delete body.credentials;

  const appendedhead: any = requestOptions;

  console.log( appendedhead.headers)

  switch (method) {
    case 'POST':
      try {
        const response = await fetch(`${config.Api.ENDPOINT}/vote`, {
          ...appendedhead
        });
        const data = await response.json();
        console.log(data)
        return res.status(200).json(data)

      } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'failed to load data' })
      }
  }
}