const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Top 100 UK towns/cities by population + search volume
const TOP_100_TOWNS = [
  { name: 'London', slug: 'london', county: 'Greater London', region: 'London', era: 'Mixed', character: 'urban', population: 'major-city', water: 'hard', lat: 51.5074, lng: -0.1278 },
  { name: 'Birmingham', slug: 'birmingham', county: 'West Midlands', region: 'Midlands', era: 'Victorian/Post-war', character: 'urban', population: 'major-city', water: 'soft', lat: 52.4862, lng: -1.8904 },
  { name: 'Manchester', slug: 'manchester', county: 'Greater Manchester', region: 'North West', era: 'Victorian', character: 'urban', population: 'major-city', water: 'soft', lat: 53.4808, lng: -2.2426 },
  { name: 'Leeds', slug: 'leeds', county: 'West Yorkshire', region: 'Yorkshire', era: 'Victorian/Edwardian', character: 'urban', population: 'major-city', water: 'soft', lat: 53.8008, lng: -1.5491 },
  { name: 'Glasgow', slug: 'glasgow', county: 'Lanarkshire', region: 'Scotland', era: 'Victorian', character: 'urban', population: 'major-city', water: 'soft', lat: 55.8642, lng: -4.2518 },
  { name: 'Sheffield', slug: 'sheffield', county: 'South Yorkshire', region: 'Yorkshire', era: 'Victorian', character: 'urban', population: 'major-city', water: 'soft', lat: 53.3811, lng: -1.4701 },
  { name: 'Bradford', slug: 'bradford', county: 'West Yorkshire', region: 'Yorkshire', era: 'Victorian', character: 'urban', population: 'large-city', water: 'soft', lat: 53.7960, lng: -1.7594 },
  { name: 'Liverpool', slug: 'liverpool', county: 'Merseyside', region: 'North West', era: 'Victorian/Georgian', character: 'urban', population: 'major-city', water: 'soft', lat: 53.4084, lng: -2.9916 },
  { name: 'Edinburgh', slug: 'edinburgh', county: 'Midlothian', region: 'Scotland', era: 'Georgian/Victorian', character: 'urban', population: 'major-city', water: 'soft', lat: 55.9533, lng: -3.1883 },
  { name: 'Bristol', slug: 'bristol', county: 'Bristol', region: 'South West', era: 'Georgian/Victorian', character: 'urban', population: 'major-city', water: 'hard', lat: 51.4545, lng: -2.5879 },
  { name: 'Kirklees', slug: 'kirklees', county: 'West Yorkshire', region: 'Yorkshire', era: 'Victorian', character: 'urban', population: 'large-city', water: 'soft', lat: 53.5933, lng: -1.8010 },
  { name: 'Wakefield', slug: 'wakefield', county: 'West Yorkshire', region: 'Yorkshire', era: 'Victorian/Post-war', character: 'urban', population: 'large-city', water: 'soft', lat: 53.6833, lng: -1.4977 },
  { name: 'Cardiff', slug: 'cardiff', county: 'South Glamorgan', region: 'Wales', era: 'Victorian/Edwardian', character: 'urban', population: 'major-city', water: 'soft', lat: 51.4816, lng: -3.1791 },
  { name: 'Coventry', slug: 'coventry', county: 'West Midlands', region: 'Midlands', era: 'Post-war', character: 'urban', population: 'large-city', water: 'hard', lat: 52.4068, lng: -1.5197 },
  { name: 'Nottingham', slug: 'nottingham', county: 'Nottinghamshire', region: 'East Midlands', era: 'Victorian/Edwardian', character: 'urban', population: 'large-city', water: 'hard', lat: 52.9548, lng: -1.1581 },
  { name: 'Leicester', slug: 'leicester', county: 'Leicestershire', region: 'East Midlands', era: 'Victorian/Edwardian', character: 'urban', population: 'large-city', water: 'hard', lat: 52.6369, lng: -1.1398 },
  { name: 'Sunderland', slug: 'sunderland', county: 'Tyne and Wear', region: 'North East', era: 'Victorian/Post-war', character: 'urban', population: 'large-city', water: 'soft', lat: 54.9069, lng: -1.3838 },
  { name: 'Belfast', slug: 'belfast', county: 'County Antrim', region: 'Northern Ireland', era: 'Victorian/Edwardian', character: 'urban', population: 'major-city', water: 'soft', lat: 54.5973, lng: -5.9301 },
  { name: 'Brighton', slug: 'brighton', county: 'East Sussex', region: 'South East', era: 'Regency/Victorian', character: 'urban', population: 'large-city', water: 'hard', lat: 50.8225, lng: -0.1372 },
  { name: 'Plymouth', slug: 'plymouth', county: 'Devon', region: 'South West', era: 'Post-war', character: 'urban', population: 'large-city', water: 'soft', lat: 50.3755, lng: -4.1427 },
  { name: 'Wolverhampton', slug: 'wolverhampton', county: 'West Midlands', region: 'Midlands', era: 'Victorian', character: 'urban', population: 'large-city', water: 'hard', lat: 52.5862, lng: -2.1283 },
  { name: 'Southampton', slug: 'southampton', county: 'Hampshire', region: 'South East', era: 'Victorian/Post-war', character: 'urban', population: 'large-city', water: 'hard', lat: 50.9097, lng: -1.4044 },
  { name: 'Reading', slug: 'reading', county: 'Berkshire', region: 'South East', era: 'Victorian/Modern', character: 'urban', population: 'large-city', water: 'hard', lat: 51.4543, lng: -0.9781 },
  { name: 'Derby', slug: 'derby', county: 'Derbyshire', region: 'East Midlands', era: 'Victorian', character: 'urban', population: 'large-city', water: 'hard', lat: 52.9225, lng: -1.4746 },
  { name: 'Newcastle', slug: 'newcastle', county: 'Tyne and Wear', region: 'North East', era: 'Georgian/Victorian', character: 'urban', population: 'large-city', water: 'soft', lat: 54.9783, lng: -1.6178 },
  { name: 'Stoke-on-Trent', slug: 'stoke-on-trent', county: 'Staffordshire', region: 'Midlands', era: 'Victorian', character: 'urban', population: 'large-city', water: 'soft', lat: 53.0027, lng: -2.1794 },
  { name: 'Swansea', slug: 'swansea', county: 'West Glamorgan', region: 'Wales', era: 'Victorian/Post-war', character: 'urban', population: 'large-city', water: 'soft', lat: 51.6214, lng: -3.9436 },
  { name: 'Portsmouth', slug: 'portsmouth', county: 'Hampshire', region: 'South East', era: 'Victorian/Post-war', character: 'urban', population: 'large-city', water: 'hard', lat: 50.8058, lng: -1.0872 },
  { name: 'York', slug: 'york', county: 'North Yorkshire', region: 'Yorkshire', era: 'Medieval/Georgian', character: 'urban', population: 'medium-city', water: 'hard', lat: 53.9600, lng: -1.0873 },
  { name: 'Peterborough', slug: 'peterborough', county: 'Cambridgeshire', region: 'East', era: 'Victorian/Modern', character: 'urban', population: 'medium-city', water: 'hard', lat: 52.5695, lng: -0.2405 },
  { name: 'Oxford', slug: 'oxford', county: 'Oxfordshire', region: 'South East', era: 'Medieval/Victorian', character: 'urban', population: 'medium-city', water: 'hard', lat: 51.7520, lng: -1.2577 },
  { name: 'Cambridge', slug: 'cambridge', county: 'Cambridgeshire', region: 'East', era: 'Georgian/Victorian', character: 'urban', population: 'medium-city', water: 'hard', lat: 52.2053, lng: 0.1218 },
  { name: 'Luton', slug: 'luton', county: 'Bedfordshire', region: 'East', era: 'Victorian/Post-war', character: 'urban', population: 'medium-city', water: 'hard', lat: 51.8787, lng: -0.4200 },
  { name: 'Northampton', slug: 'northampton', county: 'Northamptonshire', region: 'Midlands', era: 'Victorian/Post-war', character: 'urban', population: 'medium-city', water: 'hard', lat: 52.2405, lng: -0.9027 },
  { name: 'Aberdeen', slug: 'aberdeen', county: 'Aberdeenshire', region: 'Scotland', era: 'Georgian/Victorian', character: 'urban', population: 'large-city', water: 'soft', lat: 57.1497, lng: -2.0943 },
  { name: 'Ipswich', slug: 'ipswich', county: 'Suffolk', region: 'East', era: 'Victorian/Edwardian', character: 'urban', population: 'medium-city', water: 'hard', lat: 52.0567, lng: 1.1482 },
  { name: 'Norwich', slug: 'norwich', county: 'Norfolk', region: 'East', era: 'Victorian/Medieval', character: 'urban', population: 'medium-city', water: 'hard', lat: 52.6309, lng: 1.2974 },
  { name: 'Milton Keynes', slug: 'milton-keynes', county: 'Buckinghamshire', region: 'South East', era: 'Modern', character: 'suburban', population: 'medium-city', water: 'hard', lat: 52.0406, lng: -0.7594 },
  { name: 'Swindon', slug: 'swindon', county: 'Wiltshire', region: 'South West', era: 'Victorian/Modern', character: 'urban', population: 'medium-city', water: 'hard', lat: 51.5558, lng: -1.7797 },
  { name: 'Exeter', slug: 'exeter', county: 'Devon', region: 'South West', era: 'Georgian/Victorian', character: 'urban', population: 'medium-city', water: 'soft', lat: 50.7184, lng: -3.5339 },
  { name: 'Bath', slug: 'bath', county: 'Somerset', region: 'South West', era: 'Georgian', character: 'urban', population: 'medium-city', water: 'hard', lat: 51.3813, lng: -2.3598 },
  { name: 'Cheltenham', slug: 'cheltenham', county: 'Gloucestershire', region: 'South West', era: 'Regency/Victorian', character: 'urban', population: 'medium-city', water: 'hard', lat: 51.8994, lng: -2.0783 },
  { name: 'Bournemouth', slug: 'bournemouth', county: 'Dorset', region: 'South West', era: 'Victorian/Edwardian', character: 'urban', population: 'medium-city', water: 'hard', lat: 50.7192, lng: -1.8808 },
  { name: 'Gloucester', slug: 'gloucester', county: 'Gloucestershire', region: 'South West', era: 'Medieval/Victorian', character: 'urban', population: 'medium-city', water: 'hard', lat: 51.8642, lng: -2.2382 },
  { name: 'Blackpool', slug: 'blackpool', county: 'Lancashire', region: 'North West', era: 'Victorian/Edwardian', character: 'urban', population: 'medium-city', water: 'soft', lat: 53.8142, lng: -3.0503 },
  { name: 'Birkenhead', slug: 'birkenhead', county: 'Merseyside', region: 'North West', era: 'Victorian', character: 'urban', population: 'medium-city', water: 'soft', lat: 53.3935, lng: -3.0141 },
  { name: 'Wigan', slug: 'wigan', county: 'Greater Manchester', region: 'North West', era: 'Victorian', character: 'urban', population: 'medium-city', water: 'soft', lat: 53.5449, lng: -2.6344 },
  { name: 'Telford', slug: 'telford', county: 'Shropshire', region: 'Midlands', era: 'Modern', character: 'suburban', population: 'medium-city', water: 'soft', lat: 52.6783, lng: -2.4450 },
  { name: 'Dundee', slug: 'dundee', county: 'Angus', region: 'Scotland', era: 'Victorian', character: 'urban', population: 'large-city', water: 'soft', lat: 56.4620, lng: -2.9707 },
  { name: 'Huddersfield', slug: 'huddersfield', county: 'West Yorkshire', region: 'Yorkshire', era: 'Victorian', character: 'urban', population: 'medium-city', water: 'soft', lat: 53.6450, lng: -1.7798 },
  { name: 'Stockport', slug: 'stockport', county: 'Greater Manchester', region: 'North West', era: 'Victorian', character: 'urban', population: 'medium-city', water: 'soft', lat: 53.4083, lng: -2.1494 },
  { name: 'Basildon', slug: 'basildon', county: 'Essex', region: 'East', era: 'Post-war', character: 'suburban', population: 'medium-city', water: 'hard', lat: 51.5763, lng: 0.4887 },
  { name: 'Middlesbrough', slug: 'middlesbrough', county: 'North Yorkshire', region: 'North East', era: 'Victorian', character: 'urban', population: 'medium-city', water: 'soft', lat: 54.5742, lng: -1.2350 },
  { name: 'Doncaster', slug: 'doncaster', county: 'South Yorkshire', region: 'Yorkshire', era: 'Victorian', character: 'urban', population: 'medium-city', water: 'hard', lat: 53.5228, lng: -1.1286 },
  { name: 'Rochdale', slug: 'rochdale', county: 'Greater Manchester', region: 'North West', era: 'Victorian', character: 'urban', population: 'medium-city', water: 'soft', lat: 53.6097, lng: -2.1561 },
  { name: 'Barnsley', slug: 'barnsley', county: 'South Yorkshire', region: 'Yorkshire', era: 'Victorian', character: 'urban', population: 'medium-city', water: 'soft', lat: 53.5540, lng: -1.4796 },
  { name: 'Hartlepool', slug: 'hartlepool', county: 'County Durham', region: 'North East', era: 'Victorian', character: 'urban', population: 'medium-city', water: 'soft', lat: 54.6860, lng: -1.2125 },
  { name: 'Eastbourne', slug: 'eastbourne', county: 'East Sussex', region: 'South East', era: 'Victorian/Edwardian', character: 'urban', population: 'medium-city', water: 'hard', lat: 50.7689, lng: 0.2799 },
  { name: 'Bolton', slug: 'bolton', county: 'Greater Manchester', region: 'North West', era: 'Victorian', character: 'urban', population: 'medium-city', water: 'soft', lat: 53.5781, lng: -2.4282 },
  { name: 'Burnley', slug: 'burnley', county: 'Lancashire', region: 'North West', era: 'Victorian', character: 'urban', population: 'medium-city', water: 'soft', lat: 53.7892, lng: -2.2480 },
  { name: 'Warrington', slug: 'warrington', county: 'Cheshire', region: 'North West', era: 'Victorian/Modern', character: 'urban', population: 'medium-city', water: 'soft', lat: 53.3900, lng: -2.5970 },
  { name: 'Slough', slug: 'slough', county: 'Berkshire', region: 'South East', era: 'Post-war', character: 'urban', population: 'medium-city', water: 'hard', lat: 51.5105, lng: -0.5950 },
  { name: 'Hastings', slug: 'hastings', county: 'East Sussex', region: 'South East', era: 'Victorian', character: 'urban', population: 'medium-city', water: 'hard', lat: 50.8543, lng: 0.5730 },
  { name: 'Crawley', slug: 'crawley', county: 'West Sussex', region: 'South East', era: 'Post-war', character: 'suburban', population: 'medium-city', water: 'hard', lat: 51.1092, lng: -0.1872 },
  { name: 'Maidstone', slug: 'maidstone', county: 'Kent', region: 'South East', era: 'Victorian/Edwardian', character: 'urban', population: 'medium-city', water: 'hard', lat: 51.2720, lng: 0.5290 },
  { name: 'Colchester', slug: 'colchester', county: 'Essex', region: 'East', era: 'Victorian', character: 'urban', population: 'medium-city', water: 'hard', lat: 51.8959, lng: 0.8919 },
  { name: 'Canterbury', slug: 'canterbury', county: 'Kent', region: 'South East', era: 'Medieval/Victorian', character: 'urban', population: 'medium-city', water: 'hard', lat: 51.2802, lng: 1.0789 },
  { name: 'Guildford', slug: 'guildford', county: 'Surrey', region: 'South East', era: 'Victorian', character: 'urban', population: 'medium-city', water: 'hard', lat: 51.2362, lng: -0.5704 },
  { name: 'Chester', slug: 'chester', county: 'Cheshire', region: 'North West', era: 'Medieval/Georgian', character: 'urban', population: 'medium-city', water: 'soft', lat: 53.1905, lng: -2.8910 },
  { name: 'Salford', slug: 'salford', county: 'Greater Manchester', region: 'North West', era: 'Victorian', character: 'urban', population: 'medium-city', water: 'soft', lat: 53.4875, lng: -2.2901 },
  { name: 'Preston', slug: 'preston', county: 'Lancashire', region: 'North West', era: 'Victorian', character: 'urban', population: 'medium-city', water: 'soft', lat: 53.7632, lng: -2.7031 },
  { name: 'Blackburn', slug: 'blackburn', county: 'Lancashire', region: 'North West', era: 'Victorian', character: 'urban', population: 'medium-city', water: 'soft', lat: 53.7491, lng: -2.4852 },
  { name: 'Watford', slug: 'watford', county: 'Hertfordshire', region: 'East', era: 'Victorian/Edwardian', character: 'suburban', population: 'medium-city', water: 'hard', lat: 51.6565, lng: -0.3956 },
  { name: 'Stevenage', slug: 'stevenage', county: 'Hertfordshire', region: 'East', era: 'Post-war', character: 'suburban', population: 'medium-city', water: 'hard', lat: 51.9022, lng: -0.2005 },
  { name: 'Rotherham', slug: 'rotherham', county: 'South Yorkshire', region: 'Yorkshire', era: 'Victorian', character: 'urban', population: 'medium-city', water: 'hard', lat: 53.4300, lng: -1.3569 },
  { name: 'Mansfield', slug: 'mansfield', county: 'Nottinghamshire', region: 'East Midlands', era: 'Victorian', character: 'urban', population: 'medium-city', water: 'hard', lat: 53.1472, lng: -1.1987 },
  { name: 'Oxford', slug: 'oxford', county: 'Oxfordshire', region: 'South East', era: 'Medieval/Victorian', character: 'urban', population: 'medium-city', water: 'hard', lat: 51.7520, lng: -1.2577 },
  { name: 'Worthing', slug: 'worthing', county: 'West Sussex', region: 'South East', era: 'Victorian/Edwardian', character: 'urban', population: 'medium-city', water: 'hard', lat: 50.8120, lng: -0.3720 },
  { name: 'Southend-on-Sea', slug: 'southend-on-sea', county: 'Essex', region: 'East', era: 'Victorian/Edwardian', character: 'urban', population: 'medium-city', water: 'hard', lat: 51.5460, lng: 0.7077 },
  { name: 'Grimsby', slug: 'grimsby', county: 'Lincolnshire', region: 'East Midlands', era: 'Victorian', character: 'urban', population: 'medium-city', water: 'hard', lat: 53.5675, lng: -0.0804 },
  { name: 'Kingston upon Hull', slug: 'hull', county: 'East Yorkshire', region: 'Yorkshire', era: 'Victorian', character: 'urban', population: 'large-city', water: 'hard', lat: 53.7676, lng: -0.3274 },
  { name: 'Richmond', slug: 'richmond', county: 'Surrey', region: 'London', era: 'Victorian/Georgian', character: 'suburban', population: 'medium-city', water: 'hard', lat: 51.4613, lng: -0.3037 },
  { name: 'Croydon', slug: 'croydon', county: 'Greater London', region: 'London', era: 'Victorian/Post-war', character: 'urban', population: 'large-city', water: 'hard', lat: 51.3762, lng: -0.0982 },
  { name: 'Bromley', slug: 'bromley', county: 'Greater London', region: 'London', era: 'Victorian/Edwardian', character: 'suburban', population: 'large-city', water: 'hard', lat: 51.4039, lng: 0.0198 },
  { name: 'Enfield', slug: 'enfield', county: 'Greater London', region: 'London', era: 'Victorian/Edwardian', character: 'suburban', population: 'large-city', water: 'hard', lat: 51.6521, lng: -0.0807 },
  { name: 'Barnet', slug: 'barnet', county: 'Greater London', region: 'London', era: 'Edwardian/Inter-war', character: 'suburban', population: 'large-city', water: 'hard', lat: 51.6444, lng: -0.1997 },
  { name: 'Wembley', slug: 'wembley', county: 'Greater London', region: 'London', era: 'Inter-war', character: 'suburban', population: 'large-city', water: 'hard', lat: 51.5528, lng: -0.2977 },
  { name: 'Kingston', slug: 'kingston', county: 'Surrey', region: 'London', era: 'Victorian/Edwardian', character: 'suburban', population: 'medium-city', water: 'hard', lat: 51.4085, lng: -0.3064 },
  { name: 'Wimbledon', slug: 'wimbledon', county: 'Greater London', region: 'London', era: 'Victorian/Edwardian', character: 'suburban', population: 'medium-city', water: 'hard', lat: 51.4214, lng: -0.2064 },
  { name: 'Hackney', slug: 'hackney', county: 'Greater London', region: 'London', era: 'Victorian', character: 'urban', population: 'large-city', water: 'hard', lat: 51.5450, lng: -0.0553 },
  { name: 'Islington', slug: 'islington', county: 'Greater London', region: 'London', era: 'Georgian/Victorian', character: 'urban', population: 'large-city', water: 'hard', lat: 51.5416, lng: -0.1022 },
  { name: 'Hammersmith', slug: 'hammersmith', county: 'Greater London', region: 'London', era: 'Victorian', character: 'urban', population: 'large-city', water: 'hard', lat: 51.4927, lng: -0.2339 },
  { name: 'Lewisham', slug: 'lewisham', county: 'Greater London', region: 'London', era: 'Victorian/Edwardian', character: 'urban', population: 'large-city', water: 'hard', lat: 51.4615, lng: -0.0118 },
  { name: 'Harrow', slug: 'harrow', county: 'Greater London', region: 'London', era: 'Inter-war', character: 'suburban', population: 'large-city', water: 'hard', lat: 51.5836, lng: -0.3464 },
  { name: 'Ilford', slug: 'ilford', county: 'Greater London', region: 'London', era: 'Edwardian/Inter-war', character: 'suburban', population: 'large-city', water: 'hard', lat: 51.5579, lng: 0.0788 },
  { name: 'Romford', slug: 'romford', county: 'Greater London', region: 'London', era: 'Post-war', character: 'suburban', population: 'large-city', water: 'hard', lat: 51.5754, lng: 0.1858 },
  { name: 'Sutton', slug: 'sutton', county: 'Greater London', region: 'London', era: 'Victorian/Edwardian', character: 'suburban', population: 'medium-city', water: 'hard', lat: 51.3618, lng: -0.1945 },
  { name: 'Streatham', slug: 'streatham', county: 'Greater London', region: 'London', era: 'Victorian/Edwardian', character: 'urban', population: 'medium-city', water: 'hard', lat: 51.4279, lng: -0.1221 },
  { name: 'Tooting', slug: 'tooting', county: 'Greater London', region: 'London', era: 'Edwardian', character: 'urban', population: 'medium-city', water: 'hard', lat: 51.4277, lng: -0.1680 }
];

const SERVICES = [
  { name: 'Emergency Plumber', slug: 'emergency-plumber', type: 'emergency' },
  { name: 'Bathroom Installation', slug: 'bathroom-installation', type: 'premium' },
  { name: 'Boiler Repair', slug: 'boiler-repair', type: 'standard' },
  { name: 'Boiler Installation', slug: 'boiler-installation', type: 'premium' },
  { name: 'Blocked Drains', slug: 'blocked-drains', type: 'emergency' },
  { name: 'Leak Repair', slug: 'leak-repair', type: 'emergency' },
  { name: 'Wet Room Installation', slug: 'wet-room-installation', type: 'premium' },
  { name: 'Underfloor Heating', slug: 'underfloor-heating', type: 'premium' },
  { name: 'Central Heating', slug: 'central-heating', type: 'premium' },
  { name: 'Gas Engineer', slug: 'gas-engineer', type: 'standard' }
];

// Content structure variants — rotated by town index for variety
const STRUCTURES = [
  'problem-solution-proof',
  'local-expert-guide', 
  'cost-transparency-first',
  'emergency-urgency-focus',
  'quality-craftsmanship-focus'
];

function buildPrompt(town, service, structureVariant) {
  const structure = STRUCTURES[structureVariant % STRUCTURES.length];
  
  const emergencyPricing = `£80-£350 depending on the complexity and time of call-out`;
  const premiumPricing = service.slug === 'bathroom-installation' ? `£4,000-£15,000 depending on size, fixtures and finish` :
    service.slug === 'boiler-installation' ? `£1,800-£4,500 depending on boiler type and system complexity` :
    service.slug === 'wet-room-installation' ? `£5,000-£12,000 depending on size and waterproofing spec` :
    service.slug === 'underfloor-heating' ? `£2,500-£8,000 depending on coverage area and system type` :
    service.slug === 'central-heating' ? `£3,000-£6,000 for a full system installation` : `£500-£3,000`;
  const standardPricing = `£80-£500 depending on parts required and job complexity`;
  
  const pricing = service.type === 'emergency' ? emergencyPricing : 
    service.type === 'premium' ? premiumPricing : standardPricing;

  return `Write a unique, genuinely helpful 900-1100 word page about "${service.name}" services in ${town.name}, ${town.county}.

TOWN PROFILE:
- Location: ${town.name}, ${town.county}, ${town.region}
- Property era: ${town.era} (this shapes what plumbing problems are common)
- Character: ${town.character} (${town.population})
- Water hardness: ${town.water} water area (affects scale, boiler efficiency, pipe longevity)
- Coordinates: ${town.lat}, ${town.lng}

CONTENT STRUCTURE: Use the "${structure}" approach.

REQUIREMENTS:
1. Opening paragraph MUST reference something genuinely specific to ${town.name} — its property stock, local character, common issues caused by its water type or property era, or something distinctive about the area. Do NOT just say "${town.name} is a great place to live."
2. Include a section on what causes the most common ${service.name.toLowerCase()} issues in ${town.era.toLowerCase()} properties specifically
3. Include realistic pricing: ${pricing}
4. Include 3 FAQs that locals in ${town.name} actually ask about ${service.name.toLowerCase()}
5. Write naturally — vary sentence length, avoid corporate clichés like "our experienced team" or "we pride ourselves"
6. End with a clear call to action mentioning same-day availability

FORMAT: Return clean HTML using only these tags: <h2>, <h3>, <p>, <ul>, <li>, <strong>. No <html>, <body>, <head> tags. No markdown. Just the content HTML.

The content should read like it was written by someone who knows ${town.name} well — not a template with the town name swapped in.`;
}

async function callClaude(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });

    const options = {
      hostname: 'localhost',
      port: 8317,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-ant-placeholder',
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
          reject(new Error(`Parse error: ${e.message} — ${data.slice(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(60000, () => { req.destroy(); reject(new Error('timeout')); });
    req.write(body);
    req.end();
  });
}

async function generatePage(town, service, townIndex) {
  const outputDir = path.join(__dirname, '../src/data/content', service.slug);
  const outputFile = path.join(outputDir, `${town.slug}.json`);
  
  // Skip if already generated
  if (fs.existsSync(outputFile)) {
    return { status: 'skipped', town: town.name, service: service.slug };
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const prompt = buildPrompt(town, service, townIndex);
  
  try {
    const content = await callClaude(prompt);
    if (!content || content.length < 200) {
      return { status: 'empty', town: town.name, service: service.slug };
    }
    
    fs.writeFileSync(outputFile, JSON.stringify({
      town: town.name,
      slug: town.slug,
      service: service.name,
      serviceSlug: service.slug,
      county: town.county,
      region: town.region,
      content,
      generatedAt: new Date().toISOString()
    }, null, 2));
    
    return { status: 'ok', town: town.name, service: service.slug, chars: content.length };
  } catch (err) {
    return { status: 'error', town: town.name, service: service.slug, error: err.message };
  }
}

async function runBatch(tasks, concurrency) {
  const results = [];
  let i = 0;
  
  async function worker() {
    while (i < tasks.length) {
      const task = tasks[i++];
      const result = await task();
      results.push(result);
      
      if (result.status === 'ok') {
        process.stdout.write(`✓ ${result.service}/${result.town} (${result.chars} chars)\n`);
      } else if (result.status === 'skipped') {
        process.stdout.write(`- ${result.service}/${result.town} (skip)\n`);
      } else {
        process.stdout.write(`✗ ${result.service}/${result.town}: ${result.error || result.status}\n`);
      }
    }
  }
  
  const workers = Array(concurrency).fill(null).map(() => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  const CONCURRENCY = 8;
  
  console.log(`\nPlumberNearMe247 Content Generator`);
  console.log(`Towns: ${TOP_100_TOWNS.length} | Services: ${SERVICES.length} | Total: ${TOP_100_TOWNS.length * SERVICES.length} pages`);
  console.log(`Concurrency: ${CONCURRENCY} | Est. time: ~${Math.ceil((TOP_100_TOWNS.length * SERVICES.length * 35) / CONCURRENCY / 60)} minutes\n`);

  // Service-first: complete all towns per service before moving to next
  for (const service of SERVICES) {
    const existing = fs.readdirSync(path.join(__dirname, '../src/data/content', service.slug)).length
      .catch?.() || (() => {
        try { return fs.readdirSync(path.join(__dirname, '../src/data/content', service.slug)).length; }
        catch { return 0; }
      })();
    
    console.log(`\n--- ${service.name} ---`);
    
    const tasks = TOP_100_TOWNS.map((town, idx) => () => generatePage(town, service, idx));
    const results = await runBatch(tasks, CONCURRENCY);
    
    const ok = results.filter(r => r.status === 'ok').length;
    const skipped = results.filter(r => r.status === 'skipped').length;
    const errors = results.filter(r => r.status === 'error').length;
    
    console.log(`\n${service.name}: ${ok} generated, ${skipped} skipped, ${errors} errors`);
  }

  // Final count
  const total = fs.readdirSync(path.join(__dirname, '../src/data/content'))
    .reduce((sum, dir) => {
      try { return sum + fs.readdirSync(path.join(__dirname, '../src/data/content', dir)).length; }
      catch { return sum; }
    }, 0);

  console.log(`\nDone. Total content files: ${total}`);
  console.log(`Next: npm run build && git push`);
}

main().catch(console.error);
