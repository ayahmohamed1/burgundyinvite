const sharp = require('sharp');
const path = require('path');

async function processBottomFlowers() {
  const input = 'C:\\Users\\AYAH ELMAGHRABY\\.gemini\\antigravity-ide\\brain\\fa7766fc-1919-4d61-b623-05da08a90b15\\bottom_wildflowers_1792598260412.jpg';
  const output = path.join(__dirname, 'public', 'assets', 'bottom_flowers.png');

  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);

    // Near white background
    if (minVal > 246 && (maxVal - minVal) < 15) {
      data[i + 3] = 0;
    } else if (minVal > 235 && (maxVal - minVal) < 15) {
      const alpha = Math.round(255 * (1 - (minVal - 235) / 11));
      data[i + 3] = Math.min(data[i + 3], alpha);
    }
  }

  await sharp(data, {
    raw: { width, height, channels }
  })
  .png()
  .toFile(output);

  console.log('Saved bottom_flowers.png');
}

processBottomFlowers();
