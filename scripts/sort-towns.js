const fs = require('fs');
const path = require('path');

const towns = JSON.parse(fs.readFileSync('/var/www/plumbernearme247/src/data/uk-towns.json', 'utf8'));

// Population estimates for major UK towns/cities
const populations = {
  'london': 9000000, 'birmingham': 1150000, 'leeds': 793000, 'glasgow': 635000,
  'sheffield': 584000, 'manchester': 553000, 'edinburgh': 524000, 'liverpool': 498000,
  'bristol': 467000, 'cardiff': 362000, 'leicester': 355000, 'coventry': 352000,
  'bradford': 349000, 'nottingham': 321000, 'kingston-upon-hull': 260000,
  'hull': 260000, 'newcastle-upon-tyne': 300000, 'newcastle': 300000,
  'stoke-on-trent': 256000, 'wolverhampton': 254000, 'plymouth': 263000,
  'southampton': 253000, 'reading': 232000, 'derby': 257000, 'luton': 214000,
  'swindon': 222000, 'norwich': 213000, 'oxford': 152000, 'cambridge': 123000,
  'york': 153000, 'portsmouth': 205000, 'milton-keynes': 229000,
  'peterborough': 202000, 'swansea': 241000, 'southend-on-sea': 182000,
  'middlesbrough': 174000, 'bolton': 194000, 'sunderland': 275000,
  'blackpool': 149000, 'northampton': 215000, 'ipswich': 133000,
  'telford': 170000, 'slough': 164000, 'exeter': 130000, 'cheltenham': 116000,
  'guildford': 77000, 'bath': 88000, 'worcester': 100000, 'gloucester': 129000,
  'shrewsbury': 72000, 'salford': 255000, 'wakefield': 99000, 'barnsley': 91000,
  'doncaster': 109000, 'rotherham': 109000, 'huddersfield': 162000,
  'blackburn': 117000, 'burnley': 73000, 'preston': 114000, 'stockport': 136000,
  'wigan': 103000, 'warrington': 209000, 'chester': 79000, 'crewe': 72000,
  'hereford': 55000, 'lincoln': 97000, 'chesterfield': 103000,
  'colchester': 122000, 'basildon': 174000, 'chelmsford': 114000,
  'crawley': 106000, 'worthing': 110000, 'brighton': 277000,
  'eastbourne': 102000, 'hastings': 92000, 'maidstone': 107000,
  'medway': 278000, 'tunbridge-wells': 115000, 'folkestone': 46000,
  'dover': 45000, 'canterbury': 55000, 'ashford': 77000,
  'watford': 96000, 'st-albans': 82000, 'stevenage': 87000,
  'hemel-hempstead': 81000, 'hatfield': 39000, 'welwyn': 43000,
  'harlow': 82000, 'braintree': 46000, 'waltham-abbey': 21000,
  'bedford': 106000, 'dunstable': 55000, 'wellingborough': 49000,
  'kettering': 56000, 'corby': 70000, 'rushden': 32000,
  'wisbech': 31000, 'ely': 20000, 'huntingdon': 24000,
  'st-ives': 17000, 'march': 20000, 'spalding': 30000,
  'grantham': 41000, 'boston': 35000, 'skegness': 19000,
  'grimsby': 88000, 'scunthorpe': 82000, 'gainsborough': 20000,
  'mansfield': 100000, 'newark': 38000, 'retford': 22000,
  'worksop': 43000, 'loughborough': 57000, 'hinckley': 45000,
  'rugby': 70000, 'nuneaton': 90000, 'tamworth': 76000,
  'lichfield': 32000, 'stafford': 67000, 'stoke': 256000,
  'newcastle-under-lyme': 75000, 'burton-on-trent': 72000,
  'walsall': 269000, 'west-bromwich': 154000, 'dudley': 313000,
  'solihull': 123000, 'redditch': 84000, 'kidderminster': 56000,
  'bromsgrove': 30000, 'halesowen': 55000, 'smethwick': 77000,
};

// Sort towns by population (highest first), unknowns go to end
const sorted = [...towns].sort((a, b) => {
  const popA = populations[a.slug] || populations[a.name?.toLowerCase().replace(/\s+/g, '-')] || 0;
  const popB = populations[b.slug] || populations[b.name?.toLowerCase().replace(/\s+/g, '-')] || 0;
  return popB - popA;
});

fs.writeFileSync('/var/www/plumbernearme247/src/data/uk-towns.json', JSON.stringify(sorted, null, 2));
console.log(`Sorted ${sorted.length} towns by population`);
console.log('Top 20:');
sorted.slice(0, 20).forEach((t, i) => {
  const pop = populations[t.slug] || populations[t.name?.toLowerCase().replace(/\s+/g, '-')] || 'unknown';
  console.log(`${i+1}. ${t.name} (${pop})`);
});
