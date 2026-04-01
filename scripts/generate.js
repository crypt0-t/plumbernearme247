const fs = require('fs');
const path = require('path');

const PROXY_URL = 'http://localhost:8317/v1/chat/completions';
const MODEL = 'claude-sonnet-4-6';
const CONCURRENCY = 8;
const CONTENT_DIR = path.join(__dirname, '../src/data/content');

const towns = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/uk-towns.json')));
const services = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/services.json')));

const propertyEras = {
  london: 'Victorian and Edwardian terraces with significant post-war council estates and modern developments',
  manchester: 'Victorian mill-worker terraces, post-war social housing, and modern city centre apartments',
  birmingham: 'Edwardian semis, post-war council estates, and modern developments',
  leeds: 'Victorian back-to-backs, post-war semis, and modern suburban developments',
  sheffield: 'Victorian stone terraces, post-war council housing, and modern developments',
  bristol: 'Georgian and Victorian terraces, modern harbour developments',
  liverpool: 'Victorian terraces, post-war council housing, and modern waterfront developments',
  cambridge: 'Victorian and Edwardian semis with modern university developments',
  oxford: 'Victorian terraces, historic stone buildings, and modern developments',
  york: 'Medieval and Georgian buildings, Victorian terraces',
  bath: 'Georgian townhouses and Victorian villas',
  'brighton-and-hove': 'Regency and Victorian terraces with modern seafront developments',
  edinburgh: 'Georgian New Town, Victorian tenements, and modern developments',
  glasgow: 'Victorian tenements, post-war high rises, and modern developments',
  cardiff: 'Victorian terraces, post-war council housing, and modern bay developments',
};

const waterHardness = {
  london: 'very hard water (Thames Water area, 300-400 ppm calcium carbonate)',
  manchester: 'soft water (United Utilities, Pennine reservoir fed, 40-80 ppm)',
  birmingham: 'moderately hard water (Severn Trent area, 150-200 ppm)',
  leeds: 'soft to moderately hard water (Yorkshire Water)',
  sheffield: 'soft water from Pennine reservoirs (Yorkshire Water)',
  bristol: 'moderately soft water (Bristol Water)',
  liverpool: 'soft water (United Utilities, 50-100 ppm)',
  cambridge: 'very hard water (Anglian Water, 200-300 ppm)',
  oxford: 'hard water (Thames Water, 250-300 ppm)',
  bath: 'hard water (Bristol Water, 200-250 ppm)',
  'brighton-and-hove': 'hard water (South East Water, chalk aquifer, 280-320 ppm)',
  edinburgh: 'soft water (Scottish Water, 50-100 ppm)',
  glasgow: 'very soft water (Scottish Water, Loch Katrine, 20-40 ppm)',
  cardiff: 'moderately soft water (Dwr Cymru Welsh Water)',
};

const structures = [
  'Start with a strong local opening about the most common plumbing issue in this area, then cover local property context, then service details, then pricing, then why local expertise matters, then 4 FAQs',
  'Open with what makes plumbing in this specific town different, then the service as the solution, then process walkthrough, then local pricing, then trust signals, then 4 FAQs',
  'Lead with a local property insight unique to this town, then service overview, then what homeowners here commonly face, then detailed service info, then pricing guide, then 4 FAQs',
  'Start with the most common reason residents of this town need this service, then process, then local context, then pricing, then credentials, then 4 FAQs',
  'Open with a compelling local hook about property or water quality in this town, then service benefits, then detailed process, then cost breakdown, then local expertise, then 4 FAQs',
];

function getStructure(town, service) {
  const index = (town.name.charCodeAt(0) + service.slug.length) % structures.length;
  return structures[index];
}

function getPrompt(service, town) {
  const era = propertyEras[town.slug] || 'a mix of Victorian, Edwardian, and post-war properties';
  const water = waterHardness[town.slug] || 'moderately hard water typical of this region';
  const structure = getStructure(town, service);
  const priceBase = service.priceRange || '150-500';

  return `Write a comprehensive 1000-1200 word SEO page about "${service.name}" in ${town.name}, ${town.county}.

STRUCTURE: ${structure}

TOWN DATA (weave naturally into content):
- Town: ${town.name}, ${town.county}, ${town.region}
- Property types: ${era}
- Water: ${water}
- Population band: ${town.population ? town.population.toLocaleString() + ' residents' : 'significant local population'}

REQUIREMENTS:
- 1000-1200 words total across all sections
- First paragraph MUST reference something specific and real about ${town.name} (property era, water hardness, local area character)
- Do NOT start with "Welcome to" or "Are you looking for" or "If you're searching"
- Include realistic pricing for ${town.name} area (use ${priceBase} as base range, vary by ±15%)
- 4 detailed FAQs specific to this service AND this town
- Professional tone, genuinely helpful, not salesy
- No emojis
- Subheadings using ## and ### format

Return ONLY valid JSON (no markdown code block wrapper), exactly this structure:
{
  "intro": "2-3 sentence compelling opening paragraph unique to ${town.name}",
  "localContext": "150-200 word paragraph about ${town.name} property types and plumbing challenges",
  "serviceDetail": "200-250 word section on what ${service.name} involves and what to expect",
  "pricing": "100-150 word pricing guide with realistic ranges for ${town.name}",
  "whyLocal": "100-120 word paragraph on benefits of local specialist knowledge in ${town.name}",
  "faqs": [
    {"q": "FAQ question 1 specific to ${service.name} in ${town.name}", "a": "Detailed 80-120 word answer"},
    {"q": "FAQ question 2", "a": "Detailed answer"},
    {"q": "FAQ question 3", "a": "Detailed answer"},
    {"q": "FAQ question 4", "a": "Detailed answer"}
  ],
  "metaTitle": "SEO title max 60 chars",
  "metaDescription": "SEO description max 155 chars"
}`;
}

function getFallback(service, town) {
  const era = propertyEras[town.slug] || 'mixed Victorian, Edwardian, and post-war properties';
  return {
    intro: `${town.name}'s ${era} means plumbing demands vary considerably across the area. Our network of Gas Safe registered engineers provides professional ${service.name.toLowerCase()} across all of ${town.name} and the surrounding ${town.county} area.`,
    localContext: `${town.name} in ${town.county} has a diverse housing stock ranging across different eras. This variety means plumbing systems differ significantly from street to street. Older properties often have cast iron or lead pipework requiring specialist knowledge, while newer developments use modern plastic push-fit systems. Our engineers understand the specific challenges that come with each property type found across ${town.name}.`,
    serviceDetail: `Our ${service.name.toLowerCase()} service in ${town.name} covers everything from initial assessment through to completion. All work is carried out by Gas Safe registered engineers with comprehensive local knowledge. We arrive fully equipped to handle the job efficiently, minimising disruption to your home.`,
    pricing: `${service.name} costs in ${town.name} typically range depending on the complexity and access. We provide transparent upfront quotes before any work begins. All prices include parts and labour with no hidden charges.`,
    whyLocal: `Choosing a local ${service.name.toLowerCase()} specialist in ${town.name} means faster response times and engineers familiar with the property types and common plumbing issues specific to ${town.county}.`,
    faqs: [
      { q: `How quickly can you respond in ${town.name}?`, a: `For emergency jobs in ${town.name} we aim to have an engineer with you within 2-4 hours. For planned work we can usually book within 24-48 hours depending on demand.` },
      { q: `Are your engineers Gas Safe registered?`, a: `Yes, every engineer we send to jobs in ${town.name} is fully Gas Safe registered. They carry their ID cards at all times and you can verify their registration on the Gas Safe Register website.` },
      { q: `Do you cover all areas of ${town.name}?`, a: `Yes, we cover all postcodes across ${town.name} and the wider ${town.county} area including surrounding villages and towns.` },
      { q: `What guarantee do you offer?`, a: `All ${service.name.toLowerCase()} work in ${town.name} comes with a minimum 12-month parts and labour guarantee. We stand behind the quality of every job we complete.` }
    ],
    metaTitle: `${service.name} in ${town.name} | PlumberNearMe247`,
    metaDescription: `Expert ${service.name.toLowerCase()} in ${town.name}. Gas Safe registered engineers, fast response. Get a free quote today.`
  };
}

async function generatePage(service, town) {
  const dir = path.join(CONTENT_DIR, service.slug);
  const file = path.join(dir, `${town.slug}.json`);

  if (fs.existsSync(file)) {
    try {
      const existing = JSON.parse(fs.readFileSync(file));
      if (existing.intro && existing.faqs && existing.faqs.length > 0) return 'skip';
    } catch(e) {}
  }

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  try {
    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CLI_PROXY_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2000,
        messages: [{ role: 'user', content: getPrompt(service, town) }]
      })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const content = JSON.parse(jsonMatch[0]);
    if (!content.intro || !content.faqs) throw new Error('Missing required fields');

    fs.writeFileSync(file, JSON.stringify(content, null, 2));
    return town.name;

  } catch(e) {
    // Write fallback so page still renders
    fs.writeFileSync(file, JSON.stringify(getFallback(service, town), null, 2));
    return `fallback:${town.name}`;
  }
}

async function runBatch(items) {
  let index = 0;
  const total = items.length;
  let done = 0;
  let generated = 0;
  let skipped = 0;
  let fallbacks = 0;

  async function worker() {
    while (true) {
      let item;
      if (index >= items.length) break;
      item = items[index++];

      const result = await generatePage(item.service, item.town);
      done++;

      if (result === 'skip') skipped++;
      else if (result && result.startsWith('fallback:')) fallbacks++;
      else if (result) generated++;

      if (done % 25 === 0) {
        console.log(`[${new Date().toISOString()}] ${done}/${total} | generated: ${generated} | skipped: ${skipped} | fallbacks: ${fallbacks}`);
      }
    }
  }

  const workers = Array(CONCURRENCY).fill(null).map(() => worker());
  await Promise.all(workers);

  console.log(`\nDone! Generated: ${generated}, Skipped: ${skipped}, Fallbacks: ${fallbacks}`);
}

async function main() {
  const work = [];
  for (const service of services) {
    for (const town of towns) {
      work.push({ service, town });
    }
  }

  // Shuffle to get variety across services
  for (let i = work.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [work[i], work[j]] = [work[j], work[i]];
  }

  console.log(`Total work items: ${work.length}`);
  console.log(`Already done: ${work.filter(w => {
    const f = path.join(CONTENT_DIR, w.service.slug, w.town.slug + '.json');
    return fs.existsSync(f);
  }).length}`);
  console.log(`Concurrency: ${CONCURRENCY}`);
  console.log(`Starting...\n`);

  await runBatch(work);
}

main().catch(console.error);
