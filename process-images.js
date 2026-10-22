const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'public', 'images');
const outDir = path.join(__dirname, 'public', 'assets');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function removeWhiteBackground(inputPath, outputPath, tolerance = 240, feather = 20) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  // 4 channels: R, G, B, A
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Check if pixel is close to white / light background
    // Calculate brightness and color deviation
    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);
    const isNeutral = (maxVal - minVal) < 25; // near grayscale/white
    
    if (minVal > tolerance && isNeutral) {
      data[i + 3] = 0; // fully transparent
    } else if (minVal > (tolerance - feather) && isNeutral) {
      // feathered edge
      const alpha = Math.round(255 * ((tolerance - minVal) / feather));
      data[i + 3] = Math.min(data[i + 3], Math.max(0, alpha));
    }
  }

  await sharp(data, {
    raw: {
      width,
      height,
      channels
    }
  })
  .png()
  .toFile(outputPath);
  
  console.log(`Saved transparent PNG: ${outputPath}`);
}

async function isolateDove(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  // Dove has cream/textured background around (250, 248, 242)
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Sample corners to find background color
    const isBg = (r > 240 && g > 235 && b > 225) && Math.abs(r - g) < 15 && Math.abs(g - b) < 20;
    if (isBg && (r > 245 && g > 240 && b > 230)) {
      data[i + 3] = 0;
    } else if (isBg) {
      const alpha = Math.round(255 * (1 - (r - 235) / 20));
      data[i + 3] = Math.min(data[i + 3], Math.max(0, alpha));
    }
  }

  await sharp(data, {
    raw: {
      width,
      height,
      channels
    }
  })
  .png()
  .toFile(outputPath);
  
  console.log(`Saved dove PNG: ${outputPath}`);
}

async function run() {
  try {
    // 1. Flowers bouquet (download - 2026-10-21T180604.307.jpg)
    await removeWhiteBackground(
      path.join(imgDir, 'download - 2026-10-21T180604.307.jpg'),
      path.join(outDir, 'bouquet.png'),
      242,
      18
    );

    // 2. Curtain / Drape (Haute Hijab...)
    await removeWhiteBackground(
      path.join(imgDir, 'Haute Hijab - Shop All Hijabs in Jersey, Chiffon, Woven, and More!.jpg'),
      path.join(outDir, 'curtain.png'),
      245,
      15
    );

    // 3. Heart petals (An Image Featuring A Heart Shape...)
    await removeWhiteBackground(
      path.join(imgDir, 'An Image Featuring A Heart Shape Formed By Scattered Red Rose Petals PNG Images _ PNG Free Download - Pikbest.jpg'),
      path.join(outDir, 'petals_heart.png'),
      235,
      20
    );

    // 4. Dove
    await isolateDove(
      path.join(imgDir, 'This Illustrator Gives Doves Distinct Personalities In A Charming Series Inspired By A Real Rescue B.jpg'),
      path.join(outDir, 'dove.png')
    );

    console.log('All processed successfully!');
  } catch (err) {
    console.error('Error processing:', err);
  }
}

run();
