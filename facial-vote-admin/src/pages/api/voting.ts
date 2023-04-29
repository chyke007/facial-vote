import config from "src/utils/config";
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    [key: string]: any
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const method = req.method;
    const jwt = req.headers.jwt;
    const headers = {
        'x-api-key': `${config.Api.APIKEY}`,
        'Authorization': `Bearer ${jwt}`
    }

    switch (method) {
        case 'POST':
            const body = JSON.parse(req.body);
            try {
                const response = await fetch(`${config.Api.ENDPOINT}/voting`, {
                    method,
                    headers,
                    body: JSON.stringify(body)
                });
                const data = await response.json();

                return res.status(200).json(data)

            } catch (err: any) {
                return res.status(500).json({ error: err.message })
            }

        case 'GET':

            try {
                const response = await fetch(`${config.Api.ENDPOINT}/voting`, {
                    method,
                    headers
                });
                const data = await response.json();

                return res.status(200).json(data)

            } catch (err: any) {
                return res.status(500).json({ error: err.message })
            }
    }
}