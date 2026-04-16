import { GetStaticProps, GetStaticPaths } from 'next'
import Layout from '@/components/Layout'
import LeadForm from '@/components/LeadForm'
import ServiceCard from '@/components/ServiceCard'
import { services, getServiceBySlug, Service } from '@/lib/services'
import { towns } from '@/lib/towns'
import { locale } from '@/lib/locale'
import { CheckIcon, StarIcon } from '@/components/Icons'
import Link from 'next/link'
import Image from 'next/image'

interface ServicePageProps {
  service: Service
  otherServices: Service[]
}

const serviceContent: Record<string, {
  intro: string
  whatItIs: string
  whenToCall: string[]
  whatInvolves: string[]
  costFactors: string[]
  faqs: { q: string; a: string }[]
}> = {
  emergency: {
    intro: `A plumbing emergency can strike at any time — a burst pipe at midnight, a boiler failure on Christmas morning, or a blocked drain backing up into your bathroom. When it happens, you need a qualified plumber at your door fast, not in three days. Our network of emergency plumbers covers ${towns.length}+ towns and cities across the UK, with average response times of under 60 minutes.`,
    whatItIs: `Emergency plumbing covers any plumbing fault that poses an immediate risk to your property or wellbeing. This includes burst or frozen pipes, major leaks, sewage backups, loss of hot water in winter, and boiler breakdowns. Unlike routine plumbing work, emergency jobs are prioritised and attended the same day — often within the hour.`,
    whenToCall: [
      'Burst or leaking pipe causing water damage',
      'Complete loss of hot water or heating in cold weather',
      'Sewage backing up into bath, sink or toilet',
      'Flooding from an internal source',
      'Gas leak — smell of gas or CO alarm sounding',
      'Boiler making banging, whistling or gurgling noises',
      'No water supply to the property',
    ],
    whatInvolves: [
      'Rapid assessment of the fault and immediate isolation if needed',
      'Temporary repair to stop damage spreading',
      'Full diagnosis of the root cause',
      'Permanent repair or replacement of faulty components',
      'Test and reinstatement of the system',
      'Written report for insurance purposes if required',
    ],
    costFactors: [
      'Time of call-out — evenings and weekends carry a premium',
      'Nature of the fault — a washer replacement vs a full pipe reroute',
      'Parts required — boiler components vary widely in cost',
      'Access difficulty — under floors, behind tiles, in loft spaces',
      'Whether a temporary or permanent fix is needed on the day',
    ],
    faqs: [
      { q: 'How quickly can an emergency plumber reach me?', a: 'In most towns and cities in our network, average response time is 30-90 minutes. Rural areas may take up to 2 hours. We aim to have someone with you within the hour in all cases.' },
      { q: 'Is there a call-out charge?', a: 'Most of our partner plumbers charge no separate call-out fee — their hourly rate starts from when they arrive. Some charge a small mobilisation fee for overnight or weekend call-outs, which will always be disclosed upfront.' },
      { q: 'What counts as a plumbing emergency?', a: 'Any fault causing active water damage, loss of heating in winter, sewage backup, or a suspected gas leak. If you\'re unsure, call anyway — a qualified plumber can advise whether it needs immediate attention.' },
      { q: 'Will my home insurance cover emergency plumbing?', a: 'Many home insurance policies include emergency plumbing cover. Check your policy documents. Our plumbers can provide a detailed report and invoice in the format required by most insurers.' },
    ],
  },
  bathroom: {
    intro: `A new bathroom is one of the highest-return home improvements you can make — adding up to 5% to your property value while transforming one of the rooms you use every single day. The quality of the tradesperson is what makes the difference between a bathroom that lasts 20 years and one that causes problems within 5.`,
    whatItIs: `Bathroom installation covers the complete removal of your existing bathroom and fitting of a new one — including all plumbing, tiling, plastering, electrics, and finishing. A full installation typically takes 5-10 days depending on the size of the bathroom and complexity of the design. Our partner bathroom fitters are Gas Safe registered, fully insured, and experienced with all styles from traditional to contemporary.`,
    whenToCall: [
      'Planning a full bathroom renovation or refurbishment',
      'Moving into a new property with an outdated bathroom',
      'Upgrading from a bath-only to a bath and shower combination',
      'Installing an en-suite in a bedroom',
      'Converting a bedroom or storage space into a new bathroom',
      'Replacing ageing pipework as part of a renovation',
      'Installing a wet room or accessible bathroom',
    ],
    whatInvolves: [
      'Initial consultation and design — layout planning, fixture selection',
      'Strip out of existing bathroom including sanitaryware and tiles',
      'First fix plumbing — pipework routing, waste runs, supply points',
      'Plastering and waterproofing of walls',
      'Tiling — floors and walls to agreed specification',
      'Second fix plumbing — installation of bath, WC, basin, shower',
      'Electrical work — lighting, extractor fan, heated towel rail',
      'Finishing — sealant, accessories, final clean',
    ],
    costFactors: [
      'Size of the bathroom — square metreage affects tiling and materials',
      'Quality of sanitaryware chosen — entry level to designer brands',
      'Complexity of layout changes — moving soil stack is expensive',
      'Tiling specification — porcelain, natural stone, or ceramic',
      'Whether plastering is required — damp or damaged walls add cost',
      'Heated towel rail and underfloor heating add-ons',
      'En-suite vs family bathroom — access and soil stack proximity',
    ],
    faqs: [
      { q: 'How long does a bathroom installation take?', a: 'A standard bathroom replacement typically takes 5-7 working days. More complex projects involving layout changes, wet rooms, or extensive tiling can take 8-14 days. Your fitter will give a detailed programme before starting.' },
      { q: 'Do I need planning permission for a new bathroom?', a: 'In most cases, no. Bathroom installations are permitted development. The exception is if you\'re converting a bedroom to a bathroom in a listed building, or making external changes. Your fitter will advise.' },
      { q: 'Can I stay in my house during the installation?', a: 'Yes — most homeowners stay put. You\'ll be without a functioning bathroom for 3-5 days at peak, so having access to another WC or making arrangements with a neighbour or gym is advisable.' },
      { q: 'What guarantee will I get?', a: 'Our partner fitters typically offer 12 months labour guarantee and pass through manufacturer warranties on sanitaryware and fixtures (usually 2-10 years). All work is to Part P building regulations.' },
    ],
  },
  'boiler-installation': {
    intro: `A new boiler is the single most impactful home improvement for energy efficiency and heating reliability. Modern A-rated condensing boilers are up to 30% more efficient than boilers installed before 2005, delivering significant savings on energy bills every year. With gas boilers facing a phaseout deadline of 2035, choosing the right boiler now matters more than ever.`,
    whatItIs: `Boiler installation involves the removal of your existing boiler and fitting of a new unit by a Gas Safe registered engineer. A straightforward like-for-like replacement takes 4-8 hours. Moving the boiler to a new location or changing from a regular to a combi system requires additional pipework and typically takes 1-2 days. All installations include commissioning, manufacturer registration, and a Building Regulations Compliance Certificate.`,
    whenToCall: [
      'Boiler over 10 years old and becoming unreliable',
      'Heating bills increasing despite same usage patterns',
      'Boiler requiring frequent repairs — more than once per year',
      'Pressure constantly dropping — indicating a system fault',
      'Radiators slow to heat up or not reaching temperature',
      'Planning a home extension requiring additional heating capacity',
      'Switching from oil or electric to gas central heating',
    ],
    whatInvolves: [
      'Full assessment of your heating system and hot water demand',
      'Boiler sizing calculation — ensuring correct output for your property',
      'Removal and safe disposal of old boiler',
      'Installation of new boiler to manufacturer specification',
      'System flush to remove sludge and debris',
      'Magnetic filter installation — protects the new boiler',
      'Commissioning and testing of all zones and controls',
      'Manufacturer warranty registration and benchmark documentation',
    ],
    costFactors: [
      'Type of boiler — combi, system, or regular (heat only)',
      'Brand and model — budget to premium range',
      'Whether it is a like-for-like replacement or new installation',
      'Flue route — standard or extended flue run',
      'System condition — a dirty system may need a powerflush first',
      'Controls — standard or smart thermostat (Nest, Hive, etc)',
      'Extended warranty option — typically 5-10 years',
    ],
    faqs: [
      { q: 'Which boiler brand is most reliable?', a: 'Worcester Bosch, Vaillant, and Baxi consistently top reliability surveys. Worcester Bosch is the UK\'s best-selling brand for good reason — parts availability and engineer familiarity are excellent. Your installer will recommend the right model for your property size and usage.' },
      { q: 'How long does a boiler installation take?', a: 'A like-for-like combi boiler replacement typically takes one day. New installations, system conversions, or relocating the boiler take 1-3 days depending on pipework required.' },
      { q: 'What warranty will I get?', a: 'Most manufacturers offer 5-10 year warranties when installed by an approved engineer and registered at the time of installation. Worcester Bosch offers up to 12 years on selected models.' },
      { q: 'Do I need to be home for the installation?', a: 'Yes — an adult needs to be present throughout the installation. The engineer will need access to the boiler location, hot water cylinder if applicable, and usually the loft and airing cupboard.' },
    ],
  },
  'boiler-repair': {
    intro: `A faulty boiler is more than an inconvenience — in winter, it is a genuine emergency. The UK sees over 1.7 million boiler breakdowns annually. The key to minimising inconvenience is fast, accurate diagnosis by a Gas Safe registered engineer who carries the right parts for your boiler model.`,
    whatItIs: `Boiler repair covers diagnosis and rectification of any fault with your gas boiler or central heating system. Common faults include ignition failure, pressure loss, pump failure, diverter valve issues, PCB faults, and heat exchanger blockages. Most repairs can be completed on the first visit if the engineer carries the right parts — which is why using an experienced local specialist matters.`,
    whenToCall: [
      'No heating or hot water',
      'Boiler firing but radiators not heating up',
      'Pressure gauge reading below 1 bar or above 3 bar',
      'Boiler displaying a fault code or error light',
      'Banging, whistling, or kettling noises from boiler',
      'Pilot light keeps going out',
      'Boiler cutting out repeatedly — lockout mode',
      'Radiators cold at top but warm at bottom — needs bleeding',
    ],
    whatInvolves: [
      'Visual inspection and fault code analysis',
      'Gas pressure and flow rate checks',
      'Component testing — pump, PCB, sensors, diverter valve',
      'Flue and combustion analysis',
      'Identification of faulty component',
      'Replacement of part and full system test',
      'Pressure check and recommissioning',
      'Advice on preventing recurrence',
    ],
    costFactors: [
      'Nature of the fault — minor vs major component failure',
      'Part availability — common parts vs specialist components',
      'Age of boiler — older models may require sourcing obsolete parts',
      'Whether a powerflush is needed alongside the repair',
      'Time of call-out — emergency rates apply out of hours',
      'Labour time — complex faults take longer to diagnose and fix',
    ],
    faqs: [
      { q: 'Why does my boiler keep losing pressure?', a: 'The three most common causes are a small leak somewhere in the system (check radiator valves and visible pipework), a faulty pressure relief valve, or a failing expansion vessel. A Gas Safe engineer can diagnose this on the first visit.' },
      { q: 'Is it worth repairing an old boiler?', a: 'As a rule of thumb, if the repair cost exceeds one year\'s worth of the efficiency savings a new boiler would deliver, replacement makes more sense. For boilers over 12 years old with a major fault, replacement is usually more economical.' },
      { q: 'My boiler shows a fault code — what does it mean?', a: 'Fault codes vary by manufacturer. Common ones: E1/F1 usually indicates ignition failure, E2/F2 is often a sensor fault, E9 is an overheat lockout. Share your boiler make, model and fault code with our team and we can advise before the engineer arrives.' },
      { q: 'How can I prevent boiler breakdowns?', a: 'Annual servicing is the single most effective preventive measure — it catches developing faults before they cause a breakdown. Also ensure your system has a magnetic filter fitted (removes sludge that damages the heat exchanger) and keep boiler pressure between 1-1.5 bar.' },
    ],
  },
  'blocked-drains': {
    intro: `Blocked drains are the UK\'s most common plumbing problem — affecting over 3 million households every year. Left untreated, a blocked drain escalates from a slow-clearing sink to a sewage backup in your bathroom or garden. Professional drain clearance resolves the blockage completely, not just temporarily, using equipment that removes the root cause rather than pushing it further down the pipe.`,
    whatItIs: `Drain clearance covers unblocking of any internal or external drain — from kitchen sinks and bathroom wastes to external inspection chambers and main sewer connections. Methods include high-pressure water jetting, mechanical rodding, and CCTV survey for persistent or recurring blockages. Most blockages are cleared on the first visit.`,
    whenToCall: [
      'Sink, bath or shower draining slowly',
      'Toilet flushing but not clearing properly',
      'Gurgling sounds from drains when water runs elsewhere',
      'Smell of sewage inside or outside the property',
      'Water backing up into bath or shower when toilet is flushed',
      'Inspection chamber lid lifting or overflowing',
      'Multiple fixtures blocked simultaneously — main drain issue',
    ],
    whatInvolves: [
      'Inspection of accessible drain access points',
      'Identification of blockage location and type',
      'High-pressure water jetting to clear blockage',
      'Mechanical rodding for stubborn or root-based blockages',
      'CCTV survey if blockage cause is unclear',
      'Clearance verification — running water test',
      'Report on condition of drain and recommendations',
    ],
    costFactors: [
      'Location of blockage — internal waste vs external main drain',
      'Severity — partial restriction vs complete blockage',
      'Cause — grease, roots, collapsed pipe, or foreign object',
      'Access — some drains require excavation',
      'Whether CCTV survey is required to locate the fault',
      'Time of call-out — emergency rates for out-of-hours',
    ],
    faqs: [
      { q: 'Can I unblock a drain myself?', a: 'For minor sink blockages, a plunger or drain cleaning product may clear it. For anything beyond a single slow-clearing waste — particularly if multiple fixtures are affected or there is sewage smell — call a professional. DIY attempts on main drains can push blockages further and make the problem worse.' },
      { q: 'What causes blocked drains?', a: 'In kitchens, the main culprit is cooking fat and grease solidifying on pipe walls. In bathrooms, hair and soap build-up. In external drains, tree roots are a major cause — particularly in older clay pipe systems. Wipes, nappies and sanitary products flushed down toilets are a growing cause of main sewer blockages.' },
      { q: 'Will you need to dig up my garden?', a: 'Rarely. High-pressure jetting clears the vast majority of blockages without any excavation. Excavation is only needed when a pipe has collapsed or when a root intrusion has caused structural damage that jetting cannot resolve.' },
      { q: 'How do I prevent blocked drains?', a: 'Never pour cooking fat down the sink — let it solidify and bin it. Use a hair catcher in the shower. Never flush wipes, even "flushable" ones. Have your drains CCTV surveyed every 3-5 years if you have mature trees near your property.' },
    ],
  },
  'leak-repair': {
    intro: `A hidden water leak can cause thousands of pounds of damage before it becomes visible. Escape of water is one of the most common causes of home insurance claims in the UK — and that doesn\'t include the disruption of drying out and redecoration. Modern leak detection technology means our engineers can locate leaks beneath floors and behind walls without unnecessary destruction.`,
    whatItIs: `Leak detection and repair covers locating and fixing any water leak in your plumbing system — whether visible or concealed. We use thermal imaging cameras, acoustic detection equipment, and tracer gas to pinpoint leaks in buried or concealed pipework without exploratory damage. Once located, the leak is repaired and the system pressure-tested to confirm the fix.`,
    whenToCall: [
      'Unexplained increase in water bill',
      'Damp patches appearing on walls, floors or ceilings',
      'Sound of running water when all taps are off',
      'Water meter spinning when no water is being used',
      'Hot spots on floor (could indicate underfloor heating leak)',
      'Mould or mildew appearing in unusual locations',
      'Boiler pressure constantly dropping',
    ],
    whatInvolves: [
      'Initial assessment and water meter check to confirm active leak',
      'Thermal imaging survey of suspected areas',
      'Acoustic listening equipment to pinpoint leak in pipes',
      'Tracer gas detection for buried or concealed pipework',
      'Minimal access excavation or removal to expose leak',
      'Repair or replacement of leaking section',
      'Pressure test to confirm repair',
      'Reinstatement of any disturbed surfaces',
    ],
    costFactors: [
      'Location of leak — accessible vs concealed or buried',
      'Detection method required — acoustic vs tracer gas vs thermal',
      'Pipe material — copper, plastic, lead, or cast iron',
      'Access difficulty — under concrete, behind tiles, in ceiling',
      'Extent of repair — small section vs pipe run replacement',
      'Whether reinstatement of surfaces is included',
    ],
    faqs: [
      { q: 'How do I know if I have a hidden leak?', a: 'The most reliable test is to turn off all water-using appliances and check your water meter. If the dial is still moving, you have an active leak. Other signs include unexplained damp, a musty smell, or your boiler pressure dropping regularly.' },
      { q: 'Will you need to break up my floor or walls?', a: 'Modern detection equipment means we can locate most leaks without breaking anything. Once located, access is minimal — often a single tile or small section of flooring. We aim to leave the smallest possible access point.' },
      { q: 'Will my insurance cover the leak repair?', a: 'Most buildings insurance covers damage caused by escape of water. The repair itself may or may not be covered depending on your policy. We provide a detailed report and invoice to support any insurance claim.' },
      { q: 'How long does leak detection take?', a: 'Detection typically takes 1-3 hours depending on the size of the property and complexity of the leak. Repair time varies — a simple pipe joint repair takes under an hour, while a burst underground main may take a full day.' },
    ],
  },
  'wet-room-installation': {
    intro: `Wet rooms have become one of the fastest-growing bathroom trends in the UK — combining the luxury of a walk-in shower with a minimalist, open-plan aesthetic that makes even small bathrooms feel significantly larger. They also add genuine accessibility value, making them ideal for multi-generational households or those planning for the long term. A well-installed wet room, however, is entirely dependent on the quality of the waterproofing beneath the tiles.`,
    whatItIs: `A wet room is a fully waterproofed bathroom where the shower area is open — no tray, no enclosure, just a drain in the floor. The entire room is tanked (waterproofed) and tiled, with the floor graded to direct water to the drain. Wet rooms require specialist installation — a poorly tanked wet room will cause water damage within months. Our partner installers are experienced wet room specialists with certified tanking systems.`,
    whenToCall: [
      'Planning a bathroom renovation with a contemporary feel',
      'Want a walk-in shower without the visual weight of an enclosure',
      'Accessibility requirements — step-free shower access',
      'Small bathroom that would benefit from a more open feel',
      'Converting an en-suite to a wet room format',
      'Replacing a worn shower tray and enclosure',
    ],
    whatInvolves: [
      'Structural assessment — floor must support the weight of tile and water',
      'Floor grading — creating the fall to the drain',
      'Full tanking of floor and walls using certified waterproofing system',
      'Drain installation — linear or centre drain depending on layout',
      'Tile installation — non-slip floor tiles, wall tiles to specification',
      'Glass screen fitting if required',
      'Shower valve, head and handset installation',
      'Final seal and grouting with anti-mould products',
    ],
    costFactors: [
      'Size of the wet room — square metreage of tanking and tiling',
      'Drain type — standard point drain vs linear channel drain',
      'Tile specification — porcelain, natural stone, or large format',
      'Whether underfloor heating is included',
      'Glass screen vs fully open format',
      'Structural work required — floor strengthening',
      'Whether existing bathroom strip-out is included',
    ],
    faqs: [
      { q: 'Are wet rooms suitable for all properties?', a: 'Most properties can accommodate a wet room. The key requirement is a structurally sound floor that can be levelled and graded. Suspended timber floors can be used but require additional preparation. A survey by an experienced installer will identify any issues.' },
      { q: 'Will a wet room devalue my property?', a: 'No — a well-installed wet room adds value and appeal, particularly in the current market. The caveat is quality of installation: a poorly done wet room with inadequate waterproofing will cause damage and deter buyers. Always use a specialist with a certified tanking system.' },
      { q: 'How long does a wet room take to install?', a: 'Typically 7-12 working days for a full installation including strip-out, tanking, tiling, and fitting. The tanking membrane needs to cure before tiling begins, which adds time compared to a standard bathroom.' },
      { q: 'How do I keep a wet room clean?', a: 'Squeegee the walls and floor after each use to prevent limescale and soap scum build-up. Use a daily shower spray. Clean the linear drain weekly. Re-seal grout lines annually with a penetrating grout sealer. With proper maintenance a wet room should look as good at 10 years as day one.' },
    ],
  },
  'central-heating': {
    intro: `A full central heating installation is one of the largest investments a homeowner makes in their property — and one that delivers returns every single day through comfort, lower bills, and increased property value. Whether you\'re installing heating for the first time in an older property, extending an existing system into an addition, or replacing an ageing system entirely, the quality of design and installation determines how well it performs for the next 20 years.`,
    whatItIs: `Central heating installation covers the design and fitting of a complete gas central heating system — including boiler, radiators, pipework, controls, and a magnetic filter. For new installations this includes full pipework runs throughout the property. For upgrades it may involve adding radiators, replacing the heat source, or improving controls and zoning. All work is carried out by Gas Safe registered engineers.`,
    whenToCall: [
      'Property has no central heating — converting from storage heaters or electric',
      'Existing system over 15 years old and inefficient',
      'Home extension requiring additional heating capacity',
      'Radiators not heating evenly across the property',
      'Converting from oil or LPG to mains gas',
      'Adding smart controls — zoning and programmable thermostats',
      'Replacing a back boiler with a modern combi or system boiler',
    ],
    whatInvolves: [
      'Heat loss calculation — sizing the system correctly for the property',
      'System design — boiler output, radiator sizing, pipework routes',
      'First fix — pipework runs, radiator connections, boiler position',
      'Boiler and controls installation',
      'Radiator installation and balancing',
      'System fill, flush, and inhibitor dosing',
      'Magnetic filter installation',
      'Commissioning — balancing, setting controls, pressure testing',
      'Handover — demonstrating controls and providing documentation',
    ],
    costFactors: [
      'Number of radiators — size of property is the primary driver',
      'Boiler type and brand — combi vs system vs regular',
      'Whether it is a new installation or replacement',
      'Pipework runs — easier in new build vs retrofitting in occupied property',
      'Controls specification — standard or smart zoning',
      'Whether a magnetic filter and scale reducer are included',
      'Underfloor heating zones as part of the system',
    ],
    faqs: [
      { q: 'How long does a central heating installation take?', a: 'A complete new installation in an average 3-bedroom house takes 3-5 days. Larger properties or those requiring extensive pipework chasing take longer. Replacement of an existing system where pipework is already in place typically takes 1-2 days.' },
      { q: 'What size boiler do I need?', a: 'Boiler output is calculated based on the heat loss of your property — insulation levels, number of radiators, hot water demand, and property size. An undersized boiler won\'t heat the property effectively; an oversized one is inefficient. Your installer will calculate the correct output.' },
      { q: 'Should I get a combi or system boiler?', a: 'Combi boilers are ideal for most modern homes up to 4 bedrooms — no cylinder, instant hot water, compact. System boilers with a hot water cylinder are better for larger homes or properties with multiple bathrooms requiring simultaneous hot water. Your installer will advise based on your usage patterns.' },
      { q: 'How much will a new central heating system save me?', a: 'Replacing an old G-rated boiler with a modern A-rated system delivers meaningful annual energy savings, and adding smart controls and zoning saves even more. The payback period on a full system replacement is typically 5-8 years through energy savings alone.' },
    ],
  },
  'underfloor-heating': {
    intro: `Underfloor heating has moved from a luxury to a mainstream choice in UK homes — and it\'s easy to see why. It delivers perfectly even warmth from the ground up, eliminates cold spots, runs at a lower flow temperature than radiators (making it ideal for heat pumps), and frees up wall space by removing radiators entirely. With the move away from gas boilers accelerating, UFH systems are increasingly specified as part of future-proofed heating installations.`,
    whatItIs: `Underfloor heating comes in two main types: wet systems (warm water pumped through pipes under the floor) and electric systems (heating cables or mats). Wet systems are more economical to run long-term and work with any heat source including heat pumps. Electric systems are cheaper to install and ideal for single rooms or retrofits. Our partner installers design and fit both systems across all floor types.`,
    whenToCall: [
      'New build or extension where UFH can be designed in from the start',
      'Ground floor renovation where screed or floor build-up can be accommodated',
      'Bathroom or kitchen renovation — both ideal UFH candidates',
      'Removing radiators for a cleaner, more minimalist interior',
      'Installing a heat pump — UFH is the ideal distribution system',
      'Single room electric UFH for bathroom comfort',
    ],
    whatInvolves: [
      'System design — zoning, pipe spacing, manifold location',
      'Sub-floor preparation — insulation board to prevent downward heat loss',
      'Pipe or mat installation to design specification',
      'Manifold installation and connection to heat source',
      'Screed or floor covering over wet system',
      'Zone controls and thermostat installation',
      'Commissioning — pressure test, zone balancing, temperature setting',
      'Handover and controls instruction',
    ],
    costFactors: [
      'Wet vs electric system — wet is higher to install, lower to run',
      'Floor area — primary cost driver',
      'Floor type — screed, floating floor, or low-profile overlay system',
      'Number of zones and complexity of controls',
      'Whether a new manifold and controls are required',
      'Heat source compatibility — may require mixing valve with existing boiler',
      'Insulation below the system — critical for efficiency',
    ],
    faqs: [
      { q: 'Can underfloor heating be retrofitted in an existing property?', a: 'Yes — modern low-profile overlay systems add as little as 15mm to floor height, making retrofit feasible in most rooms. The main constraint is door clearance and transition to adjacent floor levels. Your installer will assess suitability.' },
      { q: 'How long does underfloor heating take to warm up?', a: 'Wet UFH systems embedded in screed take 2-3 hours to reach operating temperature from cold — they are designed to be left on at a lower temperature rather than switched on and off. Electric systems warm up within 20-30 minutes. Smart controls compensate by pre-heating based on your schedule.' },
      { q: 'Is underfloor heating compatible with all floor coverings?', a: 'Most floor coverings are compatible — tile, stone, engineered wood, LVT, and carpet (with a tog rating below 1.5). Solid wood is more restrictive due to moisture sensitivity. Your installer will specify compatible floor coverings as part of the design.' },
      { q: 'Can I add underfloor heating to a heat pump system?', a: 'UFH is actually the ideal distribution system for heat pumps — it operates at the low flow temperatures (35-45°C) that heat pumps produce most efficiently. A well-designed UFH system with a heat pump is the most energy-efficient heating combination available.' },
    ],
  },
  'gas-engineer': {
    intro: `Gas safety is not an area for compromise. Every year in the UK, carbon monoxide poisoning from faulty gas appliances affects thousands of people — with around 60 deaths annually. For landlords, a valid Gas Safety Record (CP12) is a legal requirement without exception. For homeowners, annual servicing is the single most effective way to keep appliances safe, efficient, and under warranty.`,
    whatItIs: `Our Gas Safe registered engineers carry out the full range of gas safety work — annual boiler servicing, landlord gas safety inspections (CP12 certificates), appliance installation and fault diagnosis, and carbon monoxide alarm installation. All engineers hold valid Gas Safe registration and carry ID cards that can be verified on the Gas Safe Register website.`,
    whenToCall: [
      'Annual boiler service — recommended for all properties',
      'Landlord gas safety inspection — legally required annually for rental properties',
      'Moving into a new property and wanting peace of mind',
      'Smell of gas — call immediately, do not use any electrical switches',
      'CO alarm sounding — evacuate and call immediately',
      'Purchasing a property — pre-purchase gas safety inspection',
      'Installing a new gas appliance — cooker, fire, or hob',
    ],
    whatInvolves: [
      'Visual inspection of boiler, flue, and all gas appliances',
      'Combustion analysis — checking gas/air ratio and CO levels in flue',
      'Gas pressure and flow rate measurement',
      'Heat exchanger inspection — primary cause of CO incidents',
      'Safety device testing — overheat thermostat, pressure relief valve',
      'Flue integrity check — ensuring products of combustion are vented safely',
      'Carbon monoxide detector test if fitted',
      'Issue of Gas Safety Record (CP12) where applicable',
    ],
    costFactors: [
      'Number of gas appliances to be inspected',
      'Whether it is a service, safety check, or both',
      'Single property vs multi-property landlord discount',
      'Whether remedial work is identified and carried out',
      'Location and travel time',
    ],
    faqs: [
      { q: 'How often should a boiler be serviced?', a: 'Annually. Most boiler manufacturers require annual servicing to maintain the warranty. It also keeps the boiler running efficiently and catches developing faults before they become breakdowns or safety issues.' },
      { q: 'What is a CP12 certificate?', a: 'A CP12 (formerly known as a Gas Safety Record) is the document issued after a gas safety inspection of a rental property. Landlords must have one issued annually by a Gas Safe registered engineer and provide a copy to tenants within 28 days of issue. Failure to comply carries an unlimited fine.' },
      { q: 'How do I check an engineer is Gas Safe registered?', a: 'Ask to see their Gas Safe ID card — every registered engineer carries one. You can also verify registration and the appliances they are qualified to work on at gassaferegister.co.uk. Never allow an unregistered person to work on your gas appliances.' },
      { q: 'What should I do if I smell gas?', a: 'Do not turn any electrical switches on or off. Do not use a mobile phone inside the property. Open windows and doors. Turn off the gas at the meter if safe to do so. Evacuate and call the National Gas Emergency line: 0800 111 999. Call a Gas Safe engineer once the immediate emergency is handled.' },
    ],
  },
}

export default function ServicePage({ service, otherServices }: ServicePageProps) {
  const topTowns = towns.slice(0, 80)
  const content = serviceContent[service.slug] || serviceContent['boiler-repair']

  return (
    <Layout
      title={`${service.name} — ${locale.certification} | PlumberNearMe247`}
      description={`Professional ${service.name.toLowerCase()} across the UK. ${locale.certification}. Get a free quote today.`}
      canonical={`https://${locale.domain}/${service.slug}`}
    >
      {/* Hero */}
      <section className="bg-gradient-to-b from-navy-900 to-navy-950">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <nav className="text-sm text-slate-400 mb-4">
                <Link href="/" className="hover:text-blue-400">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-white">{service.name}</span>
              </nav>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                {service.name}
              </h1>
              <p className="text-lg text-slate-300 mb-5 leading-relaxed">{content.intro}</p>
              <div className="bg-navy-800 border border-white/10 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <StarIcon className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-semibold">What is included</span>
                </div>
                <ul className="space-y-2">
                  {service.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-slate-300 text-sm">
                      <CheckIcon className="w-4 h-4 text-green-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <LeadForm preselectedService={service.key} />
          </div>
        </div>
      </section>

      {/* What it is */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">What is {service.name}?</h2>
            <p className="text-slate-300 leading-relaxed">{content.whatItIs}</p>
          </div>
          <div>
            <div className="relative rounded-xl overflow-hidden aspect-video">
              <Image
                src={service.image}
                alt={service.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* When to call */}
      <section className="bg-navy-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-white mb-8">When Do You Need {service.name}?</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {content.whenToCall.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-navy-800/50 rounded-lg p-4 border border-white/5">
                <CheckIcon className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What it involves */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">What the Service Involves</h2>
            <ol className="space-y-4">
              {content.whatInvolves.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <span className="text-slate-300 pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">What Affects the Job?</h2>
            <ul className="space-y-3">
              {content.costFactors.map((factor, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <span className="text-blue-400 font-bold shrink-0">—</span>
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-navy-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {content.faqs.map((faq, i) => (
              <div key={i} className="bg-navy-800 border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3">{faq.q}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find by town */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-2">Find {service.name} Near You</h2>
        <p className="text-slate-400 mb-6">We cover {towns.length}+ towns and cities across the UK. Click your location for local pricing and availability.</p>
        <div className="flex flex-wrap gap-2">
          {topTowns.map(town => (
            <Link
              key={town.slug}
              href={`/${service.slug}/${town.slug}`}
              className="bg-navy-800 border border-white/5 hover:border-blue-500/30 rounded-lg px-3 py-1.5 text-sm text-slate-300 hover:text-blue-400 transition-all"
            >
              {town.name}
            </Link>
          ))}
          <span className="bg-navy-800/50 border border-white/5 rounded-lg px-3 py-1.5 text-sm text-slate-500">
            +{towns.length - 80} more towns
          </span>
        </div>
      </section>

      {/* Other services */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white mb-6">Other Plumbing Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {otherServices.map(s => (
            <ServiceCard key={s.key} service={s} />
          ))}
        </div>
      </section>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: services.map(s => ({ params: { service: s.slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const service = getServiceBySlug(params?.service as string)
  if (!service) return { notFound: true }
  return {
    props: {
      service,
      otherServices: services.filter(s => s.key !== service.key),
    },
  }
}
