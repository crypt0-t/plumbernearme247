import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const webhookUrl = process.env.WEBHOOK_URL || 'http://46.224.23.44:3002/api/leads/webhook'
  const siteId = process.env.SITE_ID || 'plumber247-uk'

  try {
    const lead = {
      siteId,
      source: 'plumbernearme247',
      ...req.body,
      submittedAt: new Date().toISOString(),
    }

    // Forward to Mission Control
    const mcRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    })

    if (!mcRes.ok) {
      console.error('MC webhook failed:', mcRes.status, await mcRes.text())
    }

    return res.status(200).json({ ok: true, message: 'Lead submitted successfully' })
  } catch (error) {
    console.error('Lead submission error:', error)
    return res.status(500).json({ ok: false, error: 'Failed to submit lead' })
  }
}
