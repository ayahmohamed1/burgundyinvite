const sharp = require('sharp');
const path = require('path');

async function processNewEnvelope() {
  const input = path.join(__dirname, 'public', 'assets', 'new_envelope.png');
  const output = path.join(__dirname, 'public', 'assets', 'new_envelope_clean.png');

  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // Make white background transparent
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Check if pixel is white or near white
    if (r > 248 && g > 248 && b > 248) {
      data[i + 3] = 0;
    } else if (r > 240 && g > 240 && b > 240) {
      const alpha = Math.round(255 * (1 - (r - 240) / 9));
      data[i + 3] = Math.min(data[i + 3], alpha);
    }
  }

  // Save and then trim transparent padding
  const trimmedBuffer = await sharp(data, {
    raw: { width, height, channels }
  })
  .png()
  .trim() // automatically trims transparent edges
  .toBuffer();

  await sharp(trimmedBuffer).png().toFile(output);
  console.log('Saved new_envelope_clean.png successfully!');
}

processNewEnvelope();
