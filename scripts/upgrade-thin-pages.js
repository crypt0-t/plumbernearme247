#!/usr/bin/env node

/**
 * Smart page upgrader — skips existing Sonnet content, fills gaps only
 * Generates unique paragraph per town via Sonnet (10 towns per call)
 * Adds static service blocks + FAQ pools (zero credits)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const CONTENT_DIR = path.join(__dirname, '../src/data/content');
const TOWNS_FILE = path.join(__dirname, '../src/data/uk-towns.json');
const SERVICES_FILE = path.join(__dirname, '../src/data/services.json');

const towns = JSON.parse(fs.readFileSync(TOWNS_FILE, 'utf8'));
const services = JSON.parse(fs.readFileSync(SERVICES_FILE, 'utf8'));

// ─── Static service blocks (written once, zero credits) ───────────────────────

const SERVICE_BLOCKS = {
  'emergency-plumber': {
    whatItInvolves: `Emergency plumbing covers any situation where water is causing immediate damage or risk to your property. This includes burst pipes, sudden boiler failures, blocked drains causing flooding, leaking stopcocks, and failed waste pipes. A qualified emergency plumber will locate the source, isolate the water supply if needed, and carry out a permanent fix — not a temporary patch that fails again in a week.`,
    process: `When you call, we'll ask you to describe the issue and turn off your stopcock if water is actively escaping. Our plumber arrives with a fully stocked van — isolation valves, pipe repair clamps, replacement fittings, drain rods, and pressure testing equipment. Most emergency jobs are resolved in a single visit. You'll receive a written quote before any work begins and a job sheet on completion.`,
    faqs: [
      "How quickly can an emergency plumber reach me?",
      "Should I turn off my water before the plumber arrives?",
      "How much does an emergency plumber cost at night?",
      "What counts as a plumbing emergency?",
      "Will my home insurance cover emergency plumbing?",
      "Can you fix a burst pipe permanently in one visit?",
      "What should I do while waiting for the emergency plumber?",
      "Do you charge extra for weekends and bank holidays?",
      "How do I find my stopcock?",
      "Is a dripping tap a plumbing emergency?"
    ]
  },
  'bathroom-installation': {
    whatItInvolves: `A full bathroom installation covers everything from stripping out the existing suite to fitting the new one — including all pipework, waste connections, tiling, flooring, and electrical work for lighting and extraction. A quality bathroom installation transforms one of the most-used rooms in your home and adds real value to your property. Expect the process to take 5-10 days depending on the complexity of the design.`,
    process: `We start with a full survey to assess your existing pipework, drainage, and structural layout. Once you've chosen your suite, we strip the old bathroom, reroute pipework if needed, fit the new suite, complete tiling and flooring, and connect all electrics. Every installation is signed off with a full water test and pressure check before we leave. All work is certificated and covered by a 12-month workmanship guarantee.`,
    faqs: [
      "How long does a full bathroom installation take?",
      "Do I need planning permission for a new bathroom?",
      "Can you move the toilet and bath to different positions?",
      "How much does a bathroom installation cost?",
      "Do you supply the bathroom suite or do I buy it?",
      "What happens if you find problems with the existing pipework?",
      "Can I use the bathroom during the installation?",
      "Do I need a Gas Safe engineer for my bathroom?",
      "What is the difference between a bathroom fitter and a plumber?",
      "How do I choose between a bath and a walk-in shower?"
    ]
  },
  'boiler-repair': {
    whatItInvolves: `Boiler repairs cover fault diagnosis and fix for any type of gas, oil, or LPG boiler — including combi, system, and conventional boilers. Common faults include loss of pressure, ignition failure, error codes, noisy operation (kettling, banging, whistling), no hot water, and radiators not heating. All repair work is carried out by Gas Safe registered engineers — a legal requirement for any work on gas appliances in the UK.`,
    process: `Our engineer arrives with a diagnostic toolkit including a flue gas analyser, manometer, and multimeter. We'll run a full boiler diagnostic, identify the fault, and give you a fixed price before starting work. Most repairs are completed in 2-4 hours. If parts are needed, we carry the most common components on the van. Complex faults requiring specialist parts are usually resolved within 48 hours. Every repair includes a post-fix safety check and flue gas analysis.`,
    faqs: [
      "Why has my boiler lost pressure?",
      "What does my boiler error code mean?",
      "Is it worth repairing an old boiler or should I replace it?",
      "Why is my boiler making a banging noise?",
      "How long does a boiler repair take?",
      "Do I need a Gas Safe registered engineer to repair my boiler?",
      "Why does my boiler keep switching off?",
      "Can you repair any make and model of boiler?",
      "What is kettling and how is it fixed?",
      "Will my boiler warranty be affected by a repair?"
    ]
  },
  'boiler-installation': {
    whatItInvolves: `A new boiler installation replaces your existing boiler with a modern, energy-efficient unit. Most UK homes now use a combi boiler — providing instant hot water without the need for a separate hot water cylinder. System and conventional boilers are recommended for larger homes with multiple bathrooms. A new A-rated boiler can cut your heating bills by up to 30% compared to a boiler installed before 2000.`,
    process: `We survey your existing system to determine the right boiler type and size for your property. On installation day, we remove the old unit, fit the new boiler, update the controls and thermostat, flush the system to remove sludge and debris, and commission the new boiler. All installations include full system documentation, manufacturer registration, and a Building Regulations compliance certificate (Part P). Most installations are completed in a single day.`,
    faqs: [
      "Which type of boiler is best for my home?",
      "How long does a boiler installation take?",
      "What size boiler do I need?",
      "Do I need to notify Building Control for a new boiler?",
      "Can I get a grant towards a new boiler?",
      "How long should a new boiler last?",
      "What is the difference between a combi and a system boiler?",
      "Should I replace my radiators when fitting a new boiler?",
      "What is a magnetic system filter and do I need one?",
      "How do I register my new boiler warranty?"
    ]
  },
  'blocked-drains': {
    whatItInvolves: `Blocked drains range from slow-running kitchen sinks to completely blocked sewer pipes causing sewage backup. Kitchen blockages are typically caused by fat and food debris. Bathroom blockages are usually hair and soap. External drain blockages are caused by root intrusion, collapsed pipes, or solid waste. Left untreated, blocked drains cause unpleasant odours, property damage, and in severe cases, sewage flooding.`,
    process: `We diagnose the blockage using CCTV drain cameras where needed, then clear it using the appropriate method — manual rodding for soft blockages, high-pressure water jetting for stubborn debris, and root cutting equipment for tree root intrusion. After clearing, we carry out a post-clearance CCTV inspection to confirm the drain is fully clear and check for any structural damage that could cause re-blocking. You receive a full drain report on completion.`,
    faqs: [
      "How do I know if I have a blocked drain?",
      "Who is responsible for blocked drains — me or the water company?",
      "Can I unblock a drain myself?",
      "What causes recurring drain blockages?",
      "How long does drain unblocking take?",
      "What is drain jetting and when is it needed?",
      "Will you need to dig up my garden to unblock the drain?",
      "How much does drain unblocking cost?",
      "Can tree roots really block drains?",
      "How do I prevent future drain blockages?"
    ]
  },
  'leak-repair': {
    whatItInvolves: `Plumbing leaks range from minor dripping taps to major pipe fractures hidden within walls and floors. Even small leaks cause significant damage over time — damp, mould, structural damage, and high water bills. Leak detection involves tracing the source using thermal imaging, acoustic detection, and pressure testing rather than simply opening up walls and floors at random. A precise diagnosis saves time, money, and unnecessary damage to your property.`,
    process: `We begin with a non-invasive leak detection survey using thermal imaging cameras and acoustic equipment to pinpoint the exact location before any work begins. Once located, we carry out the repair using the correct method — pipe replacement, joint repair, or liner installation depending on the pipe type and access. All repaired areas are pressure tested before handover and any opened surfaces are made good. We also check surrounding pipework for signs of additional weakening.`,
    faqs: [
      "How do I know if I have a hidden leak?",
      "Why is my water bill suddenly higher?",
      "Can you find a leak without cutting into my walls?",
      "How long does leak detection take?",
      "What damage can a slow leak cause?",
      "Is a dripping tap worth fixing?",
      "Can I claim a leak repair on my home insurance?",
      "What is a slab leak and how is it repaired?",
      "How do I check if my toilet is leaking?",
      "What causes copper pipes to leak?"
    ]
  },
  'wet-room-installation': {
    whatItInvolves: `A wet room is a fully waterproofed, level-access shower room where water drains directly through the floor. They are increasingly popular for modern bathroom designs, accessible bathrooms for elderly or disabled users, and compact spaces where a traditional shower enclosure won't fit. A proper wet room installation requires specialist waterproofing (tanking), precise floor gradients for drainage, and full compliance with Part P electrical regulations.`,
    process: `Wet room installation starts with full structural assessment — we check floor joists can support the additional weight of the tanking system and drainage. We then install a linear or centre drain, apply a full tanking membrane to floor and walls, lay the gradient screed, tile, and fit all fittings. Electrical work for underfloor heating and lighting is carried out by our qualified electricians. A wet room installation typically takes 7-12 days and is signed off with a full waterproofing certificate.`,
    faqs: [
      "How much does a wet room cost to install?",
      "Can any bathroom be converted to a wet room?",
      "Do wet rooms cause damp problems?",
      "How long does a wet room installation take?",
      "What is tanking and why is it important?",
      "Are wet rooms suitable for upstairs bathrooms?",
      "Can I have underfloor heating in a wet room?",
      "Do wet rooms add value to a property?",
      "What type of tiles are best for a wet room floor?",
      "Do I need planning permission for a wet room?"
    ]
  },
  'central-heating': {
    whatItInvolves: `Central heating installation covers full system design and installation for new builds, complete system replacements, and extensions to existing systems. A modern central heating system includes a high-efficiency boiler, radiators sized to each room, thermostatic radiator valves (TRVs), a smart thermostat, and a magnetic system filter to protect the heat exchanger. Properly designed and installed central heating reduces energy bills and maintains consistent comfort throughout the property.`,
    process: `We carry out a full heat loss calculation for your property to correctly size the boiler and radiators. We then design the pipework layout, fit all components, pressure test the entire system, fill and flush with inhibitor solution, balance the radiators, and commission the boiler. All installations comply with Building Regulations Part L and include a commissioning certificate. We also provide a full handover including thermostat programming and system maintenance guidance.`,
    faqs: [
      "How much does central heating installation cost?",
      "How long does central heating installation take?",
      "What size boiler do I need for my property?",
      "Can I keep my existing radiators with a new boiler?",
      "What is a heat loss calculation?",
      "Do I need planning permission for central heating?",
      "What is a magnetic system filter and do I need one?",
      "Can I get a grant for central heating installation?",
      "What is the difference between open vented and sealed systems?",
      "How do I balance my radiators?"
    ]
  },
  'underfloor-heating': {
    whatItInvolves: `Underfloor heating (UFH) provides even, comfortable heat from the floor upward — eliminating cold spots and freeing walls from radiators. There are two types: wet systems (water pipes connected to your boiler, most efficient long-term) and electric systems (heating cables, lower installation cost, higher running cost). Wet UFH works best with heat pumps and condensing boilers as it operates at lower flow temperatures than radiators.`,
    process: `We survey your existing floor construction to determine the correct system type and insulation requirements. For wet systems, we lay insulation boards, install the pipe circuits, connect to the boiler or heat pump, pressure test, and pour the screed. For electric systems, we lay the heating mat and connect to a dedicated circuit. All UFH installations include a manifold with individual zone controls, a smart thermostat, and a full commissioning certificate.`,
    faqs: [
      "Is underfloor heating suitable for my floor type?",
      "How much does underfloor heating cost to install?",
      "Is wet or electric underfloor heating better?",
      "Can underfloor heating replace radiators entirely?",
      "How long does underfloor heating take to heat a room?",
      "What floor coverings work best with underfloor heating?",
      "Can I install underfloor heating in an existing home?",
      "How much does underfloor heating cost to run?",
      "Does underfloor heating work with a heat pump?",
      "How thick does the screed need to be for underfloor heating?"
    ]
  },
  'gas-engineer': {
    whatItInvolves: `Gas engineering covers all work on gas appliances, pipework, and fittings in residential and commercial properties. This includes gas cooker installation, gas fire installation and servicing, gas meter moves, new gas supply installation, landlord gas safety certificates (CP12), and annual boiler servicing. All gas work in the UK must by law be carried out by a Gas Safe registered engineer — it is illegal and extremely dangerous to attempt gas work without registration.`,
    process: `All our engineers are Gas Safe registered and carry their ID cards at all times — always ask to see this before any gas work begins. We carry gas analysers, manometers, and leak detection equipment on every job. After completing any gas work, we carry out a full tightness test on the affected pipework and a combustion analysis on any boiler or appliance. You receive a Gas Safe certificate for all notifiable work, which you'll need for insurance and property sales.`,
    faqs: [
      "What is Gas Safe registration and why does it matter?",
      "How do I check if my engineer is Gas Safe registered?",
      "What is a landlord gas safety certificate?",
      "How often should I get my boiler serviced?",
      "Can I install my own gas cooker?",
      "What should I do if I smell gas?",
      "How much does a gas safety certificate cost?",
      "Can you move my gas meter?",
      "What is a gas tightness test?",
      "How long does a gas safety inspection take?"
    ]
  }
};

// ─── Fetch unique paragraph from Sonnet ──────────────────────────────────────

async function generateUniqueParagraphs(service, townBatch) {
  const townList = townBatch.map(t => 
    `${t.name} (${t.county}, ${t.region}, ${t.propertyEra || 'mixed'} housing, ${t.waterHardness || 'moderate'} water)`
  ).join('\n');

  const serviceName = service.replace(/-/g, ' ');
  
  const prompt = `You are writing unique local content for a plumbing website. For each UK town below, write ONE paragraph (120-150 words) about ${serviceName} specific to that town. Each paragraph must mention real local details — specific neighbourhoods, property types, common local plumbing issues based on the housing era and water hardness. Return ONLY a JSON array with objects containing "slug" and "paragraph" fields. No markdown, no explanation.

Towns:
${townList}

Example output format:
[{"slug":"london","paragraph":"London's..."},{"slug":"manchester","paragraph":"Manchester's..."}]`;

  return new Promise((resolve) => {
    const body = JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    });

    const req = http.request({
      hostname: 'localhost',
      port: 8317,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Authorization': 'Bearer ***REDACTED***'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.message?.content || '';
          // Extract JSON array from response
          const match = content.match(/\[[\s\S]*\]/);
          if (match) {
            const results = JSON.parse(match[0]);
            resolve(results);
          } else {
            console.log(`Parse failed for batch, skipping`);
            console.log("Raw response:", data.substring(0,200)); resolve([]);
          }
        } catch (e) {
          console.log(`Error parsing response: ${e.message}`);
          console.log("Raw response:", data.substring(0,200)); resolve([]);
        }
      });
    });

    req.on('error', (e) => {
      console.log(`Request error: ${e.message}`);
      console.log("Raw response:", data.substring(0,200)); resolve([]);
    });

    req.setTimeout(60000, () => {
      req.destroy();
      console.log('Request timeout');
      console.log("Raw response:", data.substring(0,200)); resolve([]);
    });

    req.write(body);
    req.end();
  });
}

// ─── Check if page already has good Sonnet content ───────────────────────────

function hasGoodContent(serviceSlug, townSlug) {
  const filePath = path.join(CONTENT_DIR, serviceSlug, `${townSlug}.json`);
  if (!fs.existsSync(filePath)) return false;
  
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    // Has good content if localParagraph is 100+ words OR has localContext
    const para = content.localParagraph || content.localContext || '';
    const wordCount = para.split(' ').filter(w => w.length > 0).length;
    return wordCount >= 80;
  } catch (e) {
    return false;
  }
}

// ─── Save enriched content ────────────────────────────────────────────────────

function saveContent(serviceSlug, townSlug, paragraph, serviceBlock) {
  const dir = path.join(CONTENT_DIR, serviceSlug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const filePath = path.join(dir, `${townSlug}.json`);
  
  // Read existing content if any
  let existing = {};
  if (fs.existsSync(filePath)) {
    try { existing = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch (e) {}
  }
  
  // Pick 4 FAQs by town index (deterministic, not random)
  const townIndex = towns.findIndex(t => t.slug === townSlug);
  const faqPool = serviceBlock.faqs;
  const faqStart = (townIndex * 4) % (faqPool.length - 3);
  const selectedFaqs = faqPool.slice(faqStart, faqStart + 4);
  
  const enriched = {
    ...existing,
    localParagraph: paragraph || existing.localParagraph || '',
    whatItInvolves: serviceBlock.whatItInvolves,
    process: serviceBlock.process,
    faqs: selectedFaqs,
    enriched: true,
    updatedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(filePath, JSON.stringify(enriched, null, 2));
}

// ─── Main runner ──────────────────────────────────────────────────────────────

async function run() {
  const servicesList = Object.keys(SERVICE_BLOCKS);
  
  let totalSkipped = 0;
  let totalGenerated = 0;
  let totalEnriched = 0;

  for (const serviceSlug of servicesList) {
    const serviceBlock = SERVICE_BLOCKS[serviceSlug];
    console.log(`\n─── ${serviceSlug} ───`);
    
    // Find towns that need upgrading
    const needsUpgrade = towns.filter(town => !hasGoodContent(serviceSlug, town.slug));
    const alreadyGood = towns.length - needsUpgrade.length;
    
    console.log(`  ${alreadyGood} towns already have good content — skipping`);
    console.log(`  ${needsUpgrade.length} towns need unique paragraph`);
    
    totalSkipped += alreadyGood;
    
    // For towns with existing content, just add service blocks + FAQs (zero credits)
    for (const town of towns) {
      if (!needsUpgrade.find(t => t.slug === town.slug)) {
        // Already has good paragraph — just add service blocks
        const filePath = path.join(CONTENT_DIR, serviceSlug, `${town.slug}.json`);
        if (fs.existsSync(filePath)) {
          try {
            const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (!existing.whatItInvolves) {
              const townIndex = towns.findIndex(t => t.slug === town.slug);
              const faqPool = serviceBlock.faqs;
              const faqStart = (townIndex * 4) % (faqPool.length - 3);
              const selectedFaqs = faqPool.slice(faqStart, faqStart + 4);
              
              existing.whatItInvolves = serviceBlock.whatItInvolves;
              existing.process = serviceBlock.process;
              existing.faqs = selectedFaqs;
              existing.enriched = true;
              fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
              totalEnriched++;
            }
          } catch (e) {}
        }
      }
    }
    
    if (needsUpgrade.length === 0) {
      console.log(`  All towns have good content already`);
      continue;
    }
    
    // Generate unique paragraphs in batches of 10
    const BATCH_SIZE = 5;
    const CONCURRENCY = 5;
    
    for (let i = 0; i < needsUpgrade.length; i += BATCH_SIZE * CONCURRENCY) {
      const concurrentBatches = [];
      
      for (let j = 0; j < CONCURRENCY; j++) {
        const start = i + (j * BATCH_SIZE);
        const batch = needsUpgrade.slice(start, start + BATCH_SIZE);
        if (batch.length > 0) {
          concurrentBatches.push({ batch, start });
        }
      }
      
      const results = await Promise.all(
        concurrentBatches.map(({ batch }) => generateUniqueParagraphs(serviceSlug, batch))
      );
      
      let batchGenerated = 0;
      results.forEach((paragraphs, batchIdx) => {
        const { batch } = concurrentBatches[batchIdx];
        
        paragraphs.forEach(({ slug, paragraph }) => {
          if (paragraph && paragraph.length > 50) {
            saveContent(serviceSlug, slug, paragraph, serviceBlock);
            batchGenerated++;
            totalGenerated++;
          }
        });
        
        // For any towns in batch that didn't get a paragraph, save with just service blocks
        batch.forEach(town => {
          const got = paragraphs.find(p => p.slug === town.slug);
          if (!got || !got.paragraph) {
            saveContent(serviceSlug, town.slug, '', serviceBlock);
          }
        });
      });
      
      const done = Math.min(i + BATCH_SIZE * CONCURRENCY, needsUpgrade.length);
      console.log(`  ${done}/${needsUpgrade.length} — ${batchGenerated} paragraphs generated`);
    }
  }
  
  console.log(`\n═══════════════════════════════`);
  console.log(`Done.`);
  console.log(`Skipped (already good): ${totalSkipped}`);
  console.log(`Service blocks added:   ${totalEnriched}`);
  console.log(`New paragraphs generated: ${totalGenerated}`);
  console.log(`═══════════════════════════════`);
}

run().catch(console.error);
