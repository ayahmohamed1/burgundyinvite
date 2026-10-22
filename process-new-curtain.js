const sharp = require('sharp');
const path = require('path');

async function processCurtain() {
  const input = path.join(__dirname, 'public', 'images', 'new_curtain_raw.jpg');
  const output = path.join(__dirname, 'public', 'assets', 'curtain.png');

  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // The bottom-right is white background (r, g, b > 240)
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);
    const diff = maxVal - minVal;

    // Detect white/light background
    if (minVal > 245 && diff < 15) {
      data[i + 3] = 0; // fully transparent
    } else if (minVal > 225 && diff < 20) {
      // Soft antialiased feathered edge
      const alpha = Math.round(255 * (1 - (minVal - 225) / 20));
      data[i + 3] = Math.min(data[i + 3], alpha);
    }
  }

  await sharp(data, {
    raw: { width, height, channels }
  })
  .png()
  .toFile(output);

  console.log('Saved transparent curtain.png successfully!');
}

processCurtain();
