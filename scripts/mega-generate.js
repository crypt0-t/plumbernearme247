const fs = require('fs');
const path = require('path');

const PROXY = 'http://localhost:8317/v1/chat/completions';
const API_KEY = '***REDACTED***';
const MODEL = 'claude-sonnet-4-6';
const CONCURRENT = 4;
const TOWNS_PER_CALL = 10;
const MAX_RETRIES = 2;

const contentDir = path.join(__dirname, '..', 'src', 'data', 'content');

const towns = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'uk-towns.json'), 'utf8'));
const services = [
  { slug: 'emergency-plumber', name: 'Emergency Plumber' },
  { slug: 'bathroom-installation', name: 'Bathroom Installation' },
  { slug: 'boiler-repair', name: 'Boiler Repair' },
  { slug: 'boiler-installation', name: 'Boiler Installation' },
  { slug: 'blocked-drains', name: 'Blocked Drain Clearance' },
  { slug: 'leak-repair', name: 'Leak Detection & Repair' },
  { slug: 'wet-room-installation', name: 'Wet Room Installation' },
  { slug: 'underfloor-heating', name: 'Underfloor Heating Installation' },
  { slug: 'central-heating', name: 'Central Heating Installation' },
  { slug: 'gas-engineer', name: 'Gas Engineer Services' }
];

towns.sort((a, b) => (b.population || 0) - (a.population || 0));

let generated = 0, skipped = 0, failed = 0;
const startTime = Date.now();

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function callClaude(prompt, retries = 0) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000); // 2min timeout
    
    const res = await fetch(PROXY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
      body: JSON.stringify({ model: MODEL, max_tokens: 16000, messages: [{ role: 'user', content: prompt }] }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`API ${res.status}: ${txt.slice(0, 100)}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (err) {
    if (retries < MAX_RETRIES) {
      await sleep(5000 * (retries + 1));
      return callClaude(prompt, retries + 1);
    }
    throw err;
  }
}

function buildPrompt(townBatch, service) {
  const townList = townBatch.map(t =>
    `- ${t.name}: county=${t.county||'unknown'}, region=${t.region||'unknown'}, pop=${t.population||'unknown'}, era=${t.propertyEra||'mixed'}, type=${t.character||'mixed'}, water=${t.waterZone||'unknown'}`
  ).join('\n');

  return `Generate unique SEO plumbing content for ${townBatch.length} UK towns for "${service.name}".

Each town page needs 800-1200 words total across these sections:
- title (60 chars max)
- metaDescription (155 chars max)
- h1
- intro (80-100 words, MUST reference something specific to this town)
- localContext (150-200 words — real neighbourhoods, property types, local plumbing issues)
- serviceDetail (200-250 words — step by step what the service involves)
- pricingGuide (100-150 words — local price ranges, cost factors)
- whyLocal (100-120 words — benefits of local tradesperson)
- faqs (array of 4 {q, a} pairs — genuine varied questions)
- ctaText (30-50 words)

Towns:
${townList}

RULES:
- Reference REAL neighbourhoods and local details per town
- Vary sentence structures — no two towns should read the same
- No generic filler like "Whether you're looking for" or "Our experienced team"
- Return ONLY a raw JSON array. Each object has "town" field plus all fields above.
- No markdown wrapping, no explanation.`;
}

async function generateBatch(townBatch, service) {
  const serviceDir = path.join(contentDir, service.slug);
  if (!fs.existsSync(serviceDir)) fs.mkdirSync(serviceDir, { recursive: true });

  const needed = townBatch.filter(t => !fs.existsSync(path.join(serviceDir, `${slug(t.name)}.json`)));
  if (!needed.length) { skipped += townBatch.length; return; }

  try {
    const raw = await callClaude(buildPrompt(needed, service));
    let json = raw.trim();
    if (json.startsWith('```')) json = json.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
    
    const pages = JSON.parse(json);
    let saved = 0;
    for (const page of pages) {
      if (!page.town) continue;
      fs.writeFileSync(path.join(serviceDir, `${slug(page.town)}.json`), JSON.stringify(page, null, 2));
      saved++;
      generated++;
    }
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    const ppm = (generated / (elapsed / 60)).toFixed(1);
    console.log(`[${elapsed}s] ${service.slug}: +${saved} (total: ${generated}, ${ppm} pages/min)`);
  } catch (err) {
    failed += needed.length;
    console.error(`FAIL ${service.slug} batch: ${err.message.slice(0, 80)}`);
  }
}

async function main() {
  console.log(`=== MEGA BATCH GENERATOR ===`);
  console.log(`${towns.length} towns x ${services.length} services = ${towns.length * services.length} pages`);
  console.log(`${TOWNS_PER_CALL} towns/call, ${CONCURRENT} concurrent\n`);

  const townChunks = chunk(towns, TOWNS_PER_CALL);

  for (const service of services) {
    console.log(`\n--- ${service.name} (${townChunks.length} batches) ---`);
    for (let i = 0; i < townChunks.length; i += CONCURRENT) {
      const batch = townChunks.slice(i, i + CONCURRENT);
      await Promise.all(batch.map(tc => generateBatch(tc, service)));
      // Small delay between rounds to not hammer proxy
      await sleep(2000);
    }
  }

  const mins = ((Date.now() - startTime) / 60000).toFixed(1);
  console.log(`\n=== DONE === ${generated} generated, ${skipped} skipped, ${failed} failed in ${mins} min`);
}

main().catch(console.error);
