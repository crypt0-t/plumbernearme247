const fs = require('fs');
const path = require('path');

const services = [
  { slug: 'emergency-plumber', name: 'Emergency Plumber', description: 'fast response emergency plumbing', priceRange: '£85-£250' },
  { slug: 'bathroom-installation', name: 'Bathroom Installation', description: 'full bathroom installation and fitting', priceRange: '£4,000-£15,000' },
  { slug: 'boiler-repair', name: 'Boiler Repair', description: 'boiler repair and servicing', priceRange: '£150-£500' },
  { slug: 'boiler-installation', name: 'Boiler Installation', description: 'new boiler supply and installation', priceRange: '£2,500-£4,500' },
  { slug: 'blocked-drains', name: 'Blocked Drains', description: 'drain unblocking and clearing', priceRange: '£80-£300' },
  { slug: 'leak-repair', name: 'Leak Repair', description: 'water leak detection and repair', priceRange: '£100-£400' },
  { slug: 'wet-room-installation', name: 'Wet Room Installation', description: 'wet room design and installation', priceRange: '£3,000-£8,000' },
  { slug: 'underfloor-heating', name: 'Underfloor Heating', description: 'underfloor heating installation', priceRange: '£1,500-£6,000' },
  { slug: 'central-heating', name: 'Central Heating', description: 'central heating installation and repair', priceRange: '£3,000-£6,000' },
  { slug: 'gas-engineer', name: 'Gas Engineer', description: 'Gas Safe registered engineer services', priceRange: '£80-£300' },
];

const towns = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/uk-towns.json'), 'utf8'));

let filled = 0;

for (const service of services) {
  const dir = path.join(__dirname, '../src/data/content', service.slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const town of towns) {
    const file = path.join(dir, `${town.slug}.json`);
    if (fs.existsSync(file)) continue;

    const content = {
      localContent: `${town.name} is a thriving area with strong demand for reliable ${service.description} services. Local properties range from period Victorian and Edwardian homes through to modern new-build developments, each presenting different plumbing requirements and challenges.\n\nOur Gas Safe registered engineers serve all areas of ${town.name} and the surrounding ${town.county} region. Whether you're in the town centre or the surrounding residential areas, we provide prompt, professional ${service.name.toLowerCase()} services with transparent pricing and no hidden call-out charges.\n\nWith years of experience working across ${town.county}, our engineers understand the specific plumbing challenges faced by local homeowners. From the older pipe infrastructure common in period properties to the modern systems found in newer developments, our team has the expertise to handle any ${service.description} requirement.\n\nWe cover all postcodes across ${town.name} with same-day availability for urgent work. All our engineers are fully qualified, insured, and committed to leaving your property clean and tidy after every job.`,
      faqs: [
        {
          question: `How quickly can you get to ${town.name}?`,
          answer: `We have engineers based across ${town.county} and can typically reach ${town.name} within 1-2 hours for emergency work, or the same day for standard bookings.`
        },
        {
          question: `Are your engineers Gas Safe registered in ${town.name}?`,
          answer: `Yes, all our engineers working in ${town.name} are fully Gas Safe registered and carry their ID cards to every job.`
        },
        {
          question: `What does ${service.name.toLowerCase()} cost in ${town.name}?`,
          answer: `${service.name} in ${town.name} typically costs ${service.priceRange} depending on the scope of work required. We provide free quotes before starting any work.`
        },
        {
          question: `Do you cover the whole of ${town.name}?`,
          answer: `Yes, we cover all areas of ${town.name} and surrounding villages throughout ${town.county}.`
        }
      ]
    };

    fs.writeFileSync(file, JSON.stringify(content, null, 2));
    filled++;
  }
}

console.log(`Filled ${filled} missing pages with template content`);
