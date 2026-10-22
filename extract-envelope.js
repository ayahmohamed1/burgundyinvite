const sharp = require('sharp');
const path = require('path');

async function extractEnvelope() {
  const inputPath = path.join(__dirname, 'public', 'images', 'photo_2026-10-21_18-16-19.jpg');
  const outputPath = path.join(__dirname, 'public', 'assets', 'envelope.png');

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // Let's sample the top-left background color
  // In photo_2026-10-21_18-16-19.jpg, the background is around (240-250, 235-245, 230-240)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Detect background: light cream/beige
      // Note: Amelia & James text is near top (around y < 50), we can remove that header text so only envelope and flowers remain, or we can keep it
      const isLightBg = (r > 215 && g > 210 && b > 200 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20);
      const isHeaderArea = y < 55; // text "We're getting married Amelia & James"
      const isFooterArea = y > 530; // text "Click here to open"

      if (isLightBg || isHeaderArea || isFooterArea) {
        data[idx + 3] = 0;
      }
    }
  }

  await sharp(data, {
    raw: { width, height, channels }
  })
  .png()
  .toFile(outputPath);

  console.log('Saved envelope.png');
}

extractEnvelope();
