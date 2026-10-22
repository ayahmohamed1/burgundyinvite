const sharp = require('sharp');
const path = require('path');

async function extractRightBouquet() {
  const input = path.join(__dirname, 'public', 'assets', 'new_envelope_clean.png');
  const output = path.join(__dirname, 'public', 'assets', 'header_bouquet.png');

  // Let's crop the right-side bouquet from the envelope
  // First get metadata
  const meta = await sharp(input).metadata();
  console.log('Envelope dimensions:', meta.width, meta.height);

  // The right bouquet is on the right side, starting around x: 65% of width, y: 35% of height
  const bouquetX = Math.round(meta.width * 0.65);
  const bouquetY = Math.round(meta.height * 0.35);
  const bouquetW = meta.width - bouquetX;
  const bouquetH = meta.height - bouquetY;

  await sharp(input)
    .extract({ left: bouquetX, top: bouquetY, width: bouquetW, height: bouquetH })
    .trim()
    .toFile(output);

  console.log('Saved header_bouquet.png');
}

extractRightBouquet();
