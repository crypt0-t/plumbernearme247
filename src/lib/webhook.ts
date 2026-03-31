export async function submitLead(data: Record<string, any>) {
  const webhookUrl = process.env.WEBHOOK_URL || 'http://46.224.23.44:3002/api/track-lead'
  const siteId = process.env.SITE_ID || 'plumber247-uk'

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId,
        ...data,
        timestamp: new Date().toISOString(),
      }),
    })
    return res.ok
  } catch (e) {
    console.error('Webhook error:', e)
    return false
  }
}
