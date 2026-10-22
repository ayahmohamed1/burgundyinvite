const sharp = require('sharp');
const path = require('path');

async function cleanRightBouquet() {
  const input = path.join(__dirname, 'public', 'assets', 'header_bouquet.png');
  const output = path.join(__dirname, 'public', 'assets', 'header_bouquet_clean.png');

  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Envelope color on top-left: deep burgundy red (r: 70-130, g < 35, b < 45)
      if (x < width * 0.48 && y < height * 0.55) {
        if (r > 50 && r < 140 && g < 45 && b < 55) {
          data[idx + 3] = 0; // transparent
        }
      }
    }
  }

  await sharp(data, {
    raw: { width, height, channels }
  })
  .png()
  .trim()
  .toFile(output);

  console.log('Saved header_bouquet_clean.png');
}

cleanRightBouquet();
