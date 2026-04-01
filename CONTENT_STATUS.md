# Content Generation Status

**Last updated:** 2026-04-01
**Status:** PAUSED — 47% complete

## Progress
- Total target: 5,550 pages (555 towns × 10 services)
- Completed: 2,591 pages
- Missing: 2,959 pages

## Per Service
| Service | Done | Missing |
|---------|------|---------|
| emergency-plumber | 82 | 473 |
| bathroom-installation | 0 | 555 | ← PRIORITY (highest lead value)
| boiler-repair | 0 | 555 |
| boiler-installation | 506 | 49 |
| blocked-drains | 522 | 33 |
| leak-repair | 522 | 33 |
| wet-room-installation | 522 | 33 |
| underfloor-heating | 437 | 118 |
| central-heating | 0 | 555 |
| gas-engineer | 0 | 555 |

## Why Paused
Tom hit 50% weekly Claude usage during generation.
Using template fallback content for missing pages at launch.

## Resume Plan
1. Max 500 pages per session to protect usage
2. Start with bathroom-installation (highest lead value £8k+ jobs)
3. Then central-heating, gas-engineer, boiler-repair
4. Run generate-lean.js in /scripts/ — uses CLI proxy port 8317, no API key
5. Command: `node scripts/generate-lean.js`

## Template Fallback
Missing pages currently use static template with town name injected.
Replace with Sonnet-generated content gradually.
