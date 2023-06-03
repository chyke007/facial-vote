import config from "src/utils/config";
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    [key: string]: string
  }

export default async function handler(req: NextApiRequest, res:  NextApiResponse<ResponseData>) {
    const method = req.method;
    const headers = { 'x-api-key': `${config.Api.APIKEY}` }

    switch (method) {
        case 'GET':

            try {
                const response = await fetch(`${config.Api.ENDPOINT}/voting`, {
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