const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const PROXY_URL = 'http://localhost:8317/v1/chat/completions';
const MODEL = 'claude-sonnet-4-6';
const CONCURRENCY = 5;

const towns = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/uk-towns.json'), 'utf8'));

const services = [
  { slug: 'emergency-plumber', name: 'Emergency Plumber', tier: 'emergency', avgCost: '£100-400' },
  { slug: 'bathroom-installation', name: 'Bathroom Installation', tier: 'premium', avgCost: '£4,000-15,000' },
  { slug: 'boiler-repair', name: 'Boiler Repair', tier: 'mid', avgCost: '£150-500' },
  { slug: 'boiler-installation', name: 'Boiler Installation', tier: 'premium', avgCost: '£2,500-4,500' },
  { slug: 'blocked-drains', name: 'Blocked Drain Clearance', tier: 'emergency', avgCost: '£80-250' },
  { slug: 'leak-repair', name: 'Leak Detection & Repair', tier: 'mid', avgCost: '£100-500' },
  { slug: 'wet-room-installation', name: 'Wet Room Installation', tier: 'premium', avgCost: '£6,000-12,000' },
  { slug: 'underfloor-heating', name: 'Underfloor Heating Installation', tier: 'premium', avgCost: '£3,000-8,000' },
  { slug: 'central-heating', name: 'Central Heating Installation', tier: 'premium', avgCost: '£3,000-6,000' },
  { slug: 'gas-engineer', name: 'Gas Engineer Services', tier: 'mid', avgCost: '£100-500' },
];

const structureVariants = [
  'Start with the specific local challenge this town faces with this service, then explain the solution, process, costs, and end with FAQs.',
  'Open with what makes this town unique for this service need, cover the process step by step, discuss pricing factors specific to this area, then FAQs.',
  'Lead with cost and value — what homeowners in this town typically pay and why. Then cover the service process, local considerations, and FAQs.',
  'Start with a local scenario a homeowner in this town would recognise, then cover service details, timing, costs, and FAQs.',
  'Open with the most common reason people in this town need this service, then detail the process, costs, how to choose a tradesperson, and FAQs.',
];

function getPropertyEra(town) {
  const victorian = ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Sheffield', 'Bristol', 'Newcastle', 'Bradford', 'Nottingham', 'Leicester'];
  const georgian = ['Bath', 'Edinburgh', 'York', 'Chester', 'Oxford', 'Cambridge', 'Cheltenham', 'Shrewsbury'];
  const modern = ['Milton Keynes', 'Crawley', 'Stevenage', 'Harlow', 'Basildon', 'Bracknell', 'Telford'];
  if (victorian.some(v => town.name.includes(v))) return 'Victorian terraces and Edwardian semis';
  if (georgian.some(g => town.name.includes(g))) return 'Georgian townhouses and period properties';
  if (modern.some(m => town.name.includes(m))) return 'post-war and modern new-build housing';
  if (town.population > 200000) return 'mixed Victorian, post-war, and modern housing stock';
  if (town.population > 50000) return 'Edwardian semis, post-war estates, and modern developments';
  return 'older stone-built properties, period cottages, and modern estates';
}

function getWaterZone(town) {
  const hard = ['London', 'Oxford', 'Cambridge', 'Reading', 'Guildford', 'Brighton', 'Southampton', 'Maidstone', 'Colchester', 'Luton', 'Milton Keynes'];
  const soft = ['Manchester', 'Liverpool', 'Leeds', 'Sheffield', 'Bradford', 'Halifax', 'Huddersfield', 'Rochdale', 'Oldham', 'Blackburn', 'Preston', 'Lancaster', 'Carlisle', 'Newcastle', 'Sunderland', 'Durham', 'Middlesbrough'];
  if (hard.some(h => town.name.includes(h))) return 'hard water area (Thames Water/Affinity Water zone)';
  if (soft.some(s => town.name.includes(s))) return 'soft water area (Pennine reservoir supply)';
  return 'moderately hard water area';
}

function getCharacter(town) {
  if (town.population > 500000) return 'major city';
  if (town.population > 200000) return 'large city';
  if (town.population > 100000) return 'large town';
  if (town.population > 50000) return 'mid-sized town';
  if (town.population > 20000) return 'market town';
  return 'smaller town';
}

function buildPrompt(town, service, variantIndex) {
  const structure = structureVariants[variantIndex % structureVariants.length];
  const propertyEra = getPropertyEra(town);
  const waterZone = getWaterZone(town);
  const character = getCharacter(town);

  return `Write a detailed, genuinely useful service page for "${service.name} in ${town.name}" for a UK plumbing lead generation website.

TOWN CONTEXT:
- Town: ${town.name}, ${town.county}, ${town.region}
- Character: ${character}
- Population: approximately ${town.population?.toLocaleString() || 'unknown'}
- Dominant property type: ${propertyEra}
- Water supply: ${waterZone}
- Service tier: ${service.tier} (${service.tier === 'premium' ? 'high-value planned work' : service.tier === 'emergency' ? 'urgent reactive work' : 'standard repair/maintenance'})
- Typical cost range: ${service.avgCost}

CONTENT STRUCTURE:
${structure}

REQUIREMENTS:
- Write 900-1,100 words of genuinely useful content
- Reference ${town.name} specifically at least 6 times throughout
- Mention the property types (${propertyEra}) and how they affect this service
- Mention the water supply type (${waterZone}) if relevant to the service
- Include 4 FAQs specific to this service in this town
- Include realistic cost ranges for ${town.name} (can vary slightly from the average based on area)
- Write naturally — avoid corporate waffle, write like a helpful local expert
- Do NOT use bullet points for the main content — write in proper paragraphs
- FAQs can use Q: A: format
- Do NOT include a title/H1 — start directly with the first paragraph
- Do NOT mention competitor websites or specific company names

OUTPUT FORMAT:
Return a JSON object with these exact fields:
{
  "intro": "opening paragraph (100-150 words)",
  "localContext": "paragraph about local property types, water supply, common issues specific to ${town.name} (150-200 words)",
  "serviceDetail": "what the service involves, what to expect, step by step (200-250 words)",
  "pricing": "cost guide for ${town.name} with factors that affect price (100-150 words)",
  "whyLocal": "why choosing a local ${town.name} tradesperson matters (100-120 words)",
  "faqs": [
    {"q": "question", "a": "answer (50-80 words)"},
    {"q": "question", "a": "answer (50-80 words)"},
    {"q": "question", "a": "answer (50-80 words)"},
    {"q": "question", "a": "answer (50-80 words)"}
  ],
  "metaTitle": "SEO title under 60 chars",
  "metaDescription": "SEO description 140-160 chars"
}`;
}

async function callProxy(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });

    const req = http.request('http://localhost:8317/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ***REDACTED***',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.message?.content;
          if (!content) return reject(new Error('No content in response'));
          resolve(content);
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(120000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(body);
    req.end();
  });
}

function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON found in response');
  return JSON.parse(match[0]);
}

async function generatePage(town, service, variantIndex) {
  const outputDir = path.join(__dirname, '../src/data/content', service.slug);
  const outputFile = path.join(outputDir, `${town.slug}.json`);

  if (fs.existsSync(outputFile)) return { status: 'skipped', town: town.name, service: service.slug };

  fs.mkdirSync(outputDir, { recursive: true });

  const prompt = buildPrompt(town, service, variantIndex);

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const raw = await callProxy(prompt);
      const content = extractJSON(raw);
      fs.writeFileSync(outputFile, JSON.stringify(content, null, 2));
      return { status: 'ok', town: town.name, service: service.slug };
    } catch (e) {
      if (attempt === 3) return { status: 'error', town: town.name, service: service.slug, error: e.message };
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
}

async function runBatch(items, concurrency) {
  let index = 0;
  let done = 0;
  let errors = 0;
  const total = items.length;

  async function worker() {
    while (index < total) {
      const item = items[index++];
      const result = await generatePage(item.town, item.service, item.variantIndex);
      done++;
      if (result.status === 'error') {
        errors++;
        console.log(`✗ [${done}/${total}] ${result.service}/${result.town} — ${result.error}`);
      } else if (result.status === 'skipped') {
        console.log(`→ [${done}/${total}] ${result.service}/${result.town} — skipped (exists)`);
      } else {
        console.log(`✓ [${done}/${total}] ${result.service}/${result.town}`);
      }
    }
  }

  const workers = Array.from({ length: concurrency }, worker);
  await Promise.all(workers);
  return { done, errors };
}

async function main() {
  const targetService = process.argv[2]; // optional: run single service
  const servicesToRun = targetService
    ? services.filter(s => s.slug === targetService)
    : services;

  if (servicesToRun.length === 0) {
    console.error(`Service "${targetService}" not found`);
    process.exit(1);
  }

  console.log(`Generating content for ${servicesToRun.length} service(s) × ${towns.length} towns = ${servicesToRun.length * towns.length} pages`);
  console.log(`Concurrency: ${CONCURRENCY}`);
  console.log('---');

  for (const service of servicesToRun) {
    console.log(`\nService: ${service.name}`);
    const items = towns.map((town, i) => ({ town, service, variantIndex: i }));
    const { done, errors } = await runBatch(items, CONCURRENCY);
    console.log(`Completed ${service.name}: ${done} pages, ${errors} errors`);
  }

  // Final count
  const total = services.reduce((acc, s) => {
    const dir = path.join(__dirname, '../src/data/content', s.slug);
    if (!fs.existsSync(dir)) return acc;
    return acc + fs.readdirSync(dir).filter(f => f.endsWith('.json')).length;
  }, 0);

  console.log(`\nTotal content files: ${total}`);
}

main().catch(console.error);
