const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const API_KEY = 'sk-ant-api03-3UMCENbBFPDc7o5oGmx0V-D3lTBBcYGTJoGnmYJhZEFCnLqejv1AiHuTqgaR5hNkuC0I9X-4ZAJb3gfb7N4Iw-gVyZOAAA';
const PROXY_URL = 'http://localhost:8317/v1/chat/completions';
const CONCURRENCY = 6;
const TOWNS_PER_BATCH = 10;

const services = [
  { slug: 'emergency-plumber', name: 'Emergency Plumber', angle: 'urgent emergency plumbing' },
  { slug: 'bathroom-installation', name: 'Bathroom Installation', angle: 'full bathroom fitting and renovation' },
  { slug: 'boiler-repair', name: 'Boiler Repair', angle: 'boiler repair and servicing' },
  { slug: 'boiler-installation', name: 'Boiler Installation', angle: 'new boiler installation' },
  { slug: 'blocked-drains', name: 'Blocked Drains', angle: 'drain unblocking and clearance' },
  { slug: 'leak-repair', name: 'Leak Repair', angle: 'pipe and plumbing leak repair' },
  { slug: 'wet-room-installation', name: 'Wet Room Installation', angle: 'wet room and walk-in shower installation' },
  { slug: 'underfloor-heating', name: 'Underfloor Heating', angle: 'underfloor heating installation' },
  { slug: 'central-heating', name: 'Central Heating', angle: 'central heating installation and repair' },
  { slug: 'gas-engineer', name: 'Gas Engineer', angle: 'gas engineer and gas safety services' },
];

const towns = JSON.parse(fs.readFileSync('/var/www/plumbernearme247/src/data/uk-towns.json', 'utf8'));

function callClaude(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    });

    const options = {
      hostname: 'localhost',
      port: 8317,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.message?.content || '';
          resolve(content);
        } catch (e) {
          reject(new Error(`Parse error: ${data.substring(0, 200)}`));
        }
      });
    });

    req.setTimeout(120000, () => {
      req.destroy();
      reject(new Error('Timeout after 120s'));
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function generateBatch(service, townBatch) {
  const townList = townBatch.map(t =>
    `- ${t.name} (${t.county}, ${t.region}, ${t.character || 'suburban'}, ${t.propertyEra || 'mixed'} housing)`
  ).join('\n');

  const prompt = `You are an expert SEO content writer for a UK plumbing and bathroom company. Write unique local content for ${service.name} services in multiple UK towns.

For each town below, write a JSON object with:
- "town": the town slug (lowercase, hyphens)
- "localParagraph": 3-4 sentences (80-120 words) that are UNIQUE to that specific town. Reference the actual area character, local property types, common plumbing issues for that area, and local landmarks or neighbourhoods. Make each one genuinely different - no copy-paste phrases.

Towns:
${townList}

Respond with a valid JSON array only. No markdown, no explanation, just the JSON array.

Example format:
[
  {"town": "richmond", "localParagraph": "Richmond's Victorian and Edwardian terraces along the Thames..."},
  {"town": "manchester", "localParagraph": "Manchester's dense urban core..."}
]`;

  try {
    const response = await callClaude(prompt);
    // Extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array found in response');
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error(`Batch error for ${service.slug}: ${e.message}`);
    return [];
  }
}

async function processService(service) {
  const contentDir = `/var/www/plumbernearme247/src/data/content/${service.slug}`;
  fs.mkdirSync(contentDir, { recursive: true });

  // Find towns that need generating
  const pending = towns.filter(town => {
    const file = path.join(contentDir, `${town.slug}.json`);
    return !fs.existsSync(file);
  });

  if (pending.length === 0) {
    console.log(`✓ ${service.slug} — already complete (${towns.length}/${towns.length})`);
    return;
  }

  console.log(`→ ${service.slug} — ${pending.length} towns to generate`);

  // Split into batches of TOWNS_PER_BATCH
  const batches = [];
  for (let i = 0; i < pending.length; i += TOWNS_PER_BATCH) {
    batches.push(pending.slice(i, i + TOWNS_PER_BATCH));
  }

  let done = 0;
  let batchIndex = 0;

  // Process batches with CONCURRENCY limit
  while (batchIndex < batches.length) {
    const concurrent = batches.slice(batchIndex, batchIndex + CONCURRENCY);
    batchIndex += CONCURRENCY;

    const results = await Promise.all(concurrent.map(batch => generateBatch(service, batch)));

    for (const batchResults of results) {
      for (const item of batchResults) {
        if (!item.town || !item.localParagraph) continue;

        // Find matching town
        const town = pending.find(t => t.slug === item.town || t.name.toLowerCase().replace(/\s+/g, '-') === item.town);
        if (!town) continue;

        const filePath = path.join(contentDir, `${town.slug}.json`);
        fs.writeFileSync(filePath, JSON.stringify({
          town: town.name,
          service: service.name,
          localParagraph: item.localParagraph
        }, null, 2));
        done++;
      }
    }

    const total = towns.length - pending.length + done;
    process.stdout.write(`\r  ${service.slug}: ${total}/${towns.length}`);
  }

  console.log(`\n✓ ${service.slug} complete`);
}

async function main() {
  console.log('Starting content generation — Claude Sonnet, 10 towns/batch, 6 concurrent');
  console.log(`Total target: ${services.length} services × ${towns.length} towns = ${services.length * towns.length} pages\n`);

  for (const service of services) {
    await processService(service);
  }

  // Final count
  const total = services.reduce((acc, s) => {
    const dir = `/var/www/plumbernearme247/src/data/content/${s.slug}`;
    if (!fs.existsSync(dir)) return acc;
    return acc + fs.readdirSync(dir).length;
  }, 0);

  console.log(`\nDone. ${total} content files generated.`);
}

main().catch(console.error);
