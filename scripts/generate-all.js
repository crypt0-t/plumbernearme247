const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const PROXY_URL = 'http://localhost:8317/v1/chat/completions';
const MODEL = 'claude-sonnet-4-6';
const CONCURRENCY = 6;
const TOWNS_PER_CALL = 10;

const services = [
  { slug: 'emergency-plumber', name: 'Emergency Plumber', angle: 'urgent emergency plumbing, burst pipes, no hot water, flooding' },
  { slug: 'bathroom-installation', name: 'Bathroom Installation', angle: 'full bathroom fitting, suite installation, tiling, luxury bathroom design' },
  { slug: 'boiler-repair', name: 'Boiler Repair', angle: 'boiler breakdown, no heating, fault diagnosis, boiler servicing' },
  { slug: 'boiler-installation', name: 'Boiler Installation', angle: 'new boiler fitting, boiler replacement, energy efficient upgrades' },
  { slug: 'blocked-drains', name: 'Blocked Drains', angle: 'drain clearance, CCTV surveys, high pressure jetting, drain unblocking' },
  { slug: 'leak-repair', name: 'Leak Repair', angle: 'pipe leak detection, water damage prevention, hidden leaks, trace and repair' },
  { slug: 'wet-room-installation', name: 'Wet Room Installation', angle: 'wet room design, waterproofing, accessible bathrooms, modern open showers' },
  { slug: 'underfloor-heating', name: 'Underfloor Heating', angle: 'underfloor heating installation, electric and water systems, energy efficiency' },
  { slug: 'central-heating', name: 'Central Heating', angle: 'central heating installation, radiator fitting, full heating system design' },
  { slug: 'gas-engineer', name: 'Gas Engineer', angle: 'gas safety certificates, gas appliance installation, CP12 certificates, landlord compliance' },
];

const townsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/uk-towns.json'), 'utf8'));
const towns = townsData.towns || townsData;

function callProxy(towns, service) {
  const townList = towns.map(t => `${t.name} (${t.county}, ${t.region}, ${t.character || 'suburban'}, ${t.propertyEra || 'mixed era'})`).join('\n');
  
  const prompt = `You are writing unique local SEO content for a plumbing website. Generate content for ${service.name} in each of these UK towns. Focus on: ${service.angle}.

Towns:
${townList}

For EACH town, write a unique local paragraph (150-200 words) that:
- Mentions specific local knowledge (neighbourhoods, landmarks, property types, local issues)
- References the property era and typical plumbing challenges for that area
- Sounds genuinely local, not generic
- Is completely different from the other towns

Return ONLY a valid JSON array, no other text:
[
  {
    "town": "TownName",
    "localParagraph": "unique content here..."
  }
]`;

  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    });

    const req = http.request('http://localhost:8317/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.message?.content || '';
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const results = JSON.parse(jsonMatch[0]);
            resolve(results);
          } else {
            reject(new Error('No JSON array in response'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.setTimeout(120000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function generateService(service) {
  const outputDir = path.join(__dirname, `../src/data/content/${service.slug}`);
  fs.mkdirSync(outputDir, { recursive: true });

  // Find missing towns
  const missing = towns.filter(town => {
    const file = path.join(outputDir, `${town.slug || town.name.toLowerCase().replace(/\s+/g, '-')}.json`);
    return !fs.existsSync(file);
  });

  console.log(`${service.slug}: ${towns.length - missing.length}/${towns.length} done, ${missing.length} to generate`);

  if (missing.length === 0) {
    console.log(`${service.slug}: COMPLETE`);
    return;
  }

  // Batch into groups of TOWNS_PER_CALL
  const batches = [];
  for (let i = 0; i < missing.length; i += TOWNS_PER_CALL) {
    batches.push(missing.slice(i, i + TOWNS_PER_CALL));
  }

  let done = 0;
  let batchIndex = 0;

  async function processBatch() {
    while (batchIndex < batches.length) {
      const batch = batches[batchIndex++];
      try {
        const results = await callProxy(batch, service);
        for (const result of results) {
          const town = batch.find(t => t.name.toLowerCase() === result.town.toLowerCase()) || batch[results.indexOf(result)];
          if (!town) continue;
          const slug = town.slug || town.name.toLowerCase().replace(/\s+/g, '-');
          const file = path.join(outputDir, `${slug}.json`);
          fs.writeFileSync(file, JSON.stringify({
            town: town.name,
            service: service.name,
            serviceSlug: service.slug,
            localParagraph: result.localParagraph,
            generatedAt: new Date().toISOString()
          }, null, 2));
          done++;
        }
        process.stdout.write(`\r${service.slug}: ${(towns.length - missing.length) + done}/${towns.length}`);
      } catch (e) {
        console.error(`\nBatch error for ${service.slug}: ${e.message}`);
        // Re-queue failed batch towns individually
        for (const town of batch) {
          const slug = town.slug || town.name.toLowerCase().replace(/\s+/g, '-');
          const file = path.join(outputDir, `${slug}.json`);
          if (!fs.existsSync(file)) {
            fs.writeFileSync(file, JSON.stringify({
              town: town.name,
              service: service.name,
              serviceSlug: service.slug,
              localParagraph: `${service.name} services in ${town.name}, ${town.county}. Our Gas Safe registered engineers cover all areas of ${town.name} with fast response times and competitive rates.`,
              generatedAt: new Date().toISOString(),
              fallback: true
            }, null, 2));
            done++;
          }
        }
      }
    }
  }

  // Run CONCURRENCY workers in parallel
  const workers = Array(CONCURRENCY).fill(null).map(() => processBatch());
  await Promise.all(workers);
  console.log(`\n${service.slug}: DONE`);
}

async function main() {
  console.log(`Starting generation for ${towns.length} towns × ${services.length} services = ${towns.length * services.length} pages`);
  console.log(`Using ${CONCURRENCY} concurrent workers, ${TOWNS_PER_CALL} towns per API call\n`);

  for (const service of services) {
    await generateService(service);
  }

  // Final count
  let total = 0;
  for (const service of services) {
    const dir = path.join(__dirname, `../src/data/content/${service.slug}`);
    const count = fs.existsSync(dir) ? fs.readdirSync(dir).length : 0;
    console.log(`${service.slug}: ${count}/${towns.length}`);
    total += count;
  }
  console.log(`\nTOTAL: ${total}/${towns.length * services.length}`);
}

main().catch(console.error);
