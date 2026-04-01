import type { NextApiRequest, NextApiResponse } from 'next';

const INDEXNOW_KEY = 'f7aa4b4bbacc4053b6d29c6e540d2428';
const HOST = 'www.plumbernearme247.co.uk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { urls } = req.body as { urls?: string[] };
  if (!urls || !urls.length) return res.status(400).json({ error: 'urls array required' });

  // Cap at 10,000 per IndexNow spec
  const batch = urls.slice(0, 10000);

  try {
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
        urlList: batch,
      }),
    });

    return res.status(200).json({
      submitted: batch.length,
      indexnowStatus: response.status,
      indexnowBody: await response.text(),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
