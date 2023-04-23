import config from "src/utils/config";
import type { NextApiRequest, NextApiResponse } from 'next'

var aws4 = require('aws4')

type ResponseData = {
  [key: string]: any
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const method = req.method;
  const { votingId } = req.query
  const headers = {
    'x-api-key': `${config.Api.APIKEY}`,
    'Content-Type': 'application/json'
  }
  
  console.log(`${config.Api.ENDPOINT}/vote/${votingId}`)
  switch (method) {
    case 'GET':

      try {
          const response = await fetch(`${config.Api.ENDPOINT}/vote/${votingId}`, {
              method,
              headers
          });
          const data = await response.json();

          return res.status(200).json(data)

      } catch (err) {
          return res.status(500).json({ error: 'failed to load data' })
      }
  }
}