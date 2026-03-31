const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, '..', 'public', 'images');

// Size configs per category
const configs = {
  hero: { width: 1200, height: 600, quality: 80 },
  services: { width: 600, height: 400, quality: 80 },
  gallery: { width: 800, height: 600, quality: 80 },
  blog: { width: 800, height: 500, quality: 75 },
  inline: { width: 600, height: 400, quality: 75 },
  area: { width: 800, height: 400, quality: 75 },
  about: { width: 600, height: 400, quality: 80 },
  bg: { width: 1200, height: 800, quality: 70 },
  results: { width: 800, height: 600, quality: 80 },
  before: { width: 800, height: 600, quality: 80 },
};

async function optimise() {
  let totalBefore = 0, totalAfter = 0, count = 0;

  for (const [category, config] of Object.entries(configs)) {
    const dir = path.join(IMG_DIR, category);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      totalBefore += stat.size;

      try {
        const buffer = await sharp(filePath)
          .resize(config.width, config.height, { fit: 'cover', position: 'centre' })
          .jpeg({ quality: config.quality, progressive: true })
          .toBuffer();
        
        fs.writeFileSync(filePath, buffer);
        totalAfter += buffer.length;
        count++;
      } catch (e) {
        console.error(`Failed: ${file} — ${e.message}`);
      }
    }
    console.log(`✓ ${category}: ${files.length} images optimised`);
  }

  console.log(`\nTotal: ${count} images`);
  console.log(`Before: ${(totalBefore / 1024 / 1024).toFixed(1)}MB`);
  console.log(`After:  ${(totalAfter / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Saved:  ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)}MB (${Math.round((1 - totalAfter/totalBefore) * 100)}%)`);
}

optimise();
