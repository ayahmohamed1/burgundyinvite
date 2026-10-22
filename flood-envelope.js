const sharp = require('sharp');
const path = require('path');

async function floodFillEnvelope() {
  const inputPath = path.join(__dirname, 'public', 'images', 'photo_2026-10-21_18-16-19.jpg');
  const outputPath = path.join(__dirname, 'public', 'assets', 'envelope.png');

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const visited = new Uint8Array(width * height);
  const queue = [];

  function isBackgroundPixel(x, y) {
    const idx = (y * width + x) * channels;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    // Background paper is pale warm gray/beige: around r:225-255, g:220-255, b:215-255
    // But text at top "Amelia & James" has dark pixels (r < 100).
    // If y < 70, it's the top margin above the envelope.
    // If y > 510, it's the bottom margin below the envelope.
    if (y < 65 || y > 515) return true;

    // Check if pixel is light background
    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);
    const diff = maxVal - minVal;

    // Light beige paper has high brightness and low saturation
    return (minVal > 200 && diff < 30);
  }

  // Push all border pixels
  for (let x = 0; x < width; x++) {
    queue.push([x, 0]);
    queue.push([x, height - 1]);
    visited[0 * width + x] = 1;
    visited[(height - 1) * width + x] = 1;
  }
  for (let y = 0; y < height; y++) {
    queue.push([0, y]);
    queue.push([width - 1, y]);
    visited[y * width + 0] = 1;
    visited[y * width + (width - 1)] = 1;
  }

  // BFS
  let head = 0;
  while (head < queue.length) {
    const [cx, cy] = queue[head++];
    const pIdx = (cy * width + cx) * channels;
    data[pIdx + 3] = 0; // make transparent

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nPos = ny * width + nx;
        if (!visited[nPos]) {
          visited[nPos] = 1;
          if (isBackgroundPixel(nx, ny)) {
            queue.push([nx, ny]);
          }
        }
      }
    }
  }

  // Feather the boundary slightly
  await sharp(data, {
    raw: { width, height, channels }
  })
  .png()
  .toFile(outputPath);

  console.log('Saved flood-filled envelope.png');
}

floodFillEnvelope();
