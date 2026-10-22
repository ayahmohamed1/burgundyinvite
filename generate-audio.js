const fs = require('fs');
const path = require('path');

// Generate a high quality romantic ambient piano & harp chord progression WAV file
function generateRomanticTrack() {
  const sampleRate = 44100;
  const duration = 24; // 24 seconds loop
  const totalSamples = sampleRate * duration;
  const numChannels = 2;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = totalSamples * blockAlign;

  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20);  // PCM format
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // 16-bit
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Musical notes frequencies (Canon in D / Wedding romantic progression: D - A - Bm - F#m - G - D - G - A)
  // Base chord frequencies in Hz:
  const chordProgression = [
    // D major: D3, F#3, A3, D4, F#4
    { bass: 146.83, notes: [220.00, 293.66, 369.99, 440.00, 587.33] },
    // A major: A2, E3, A3, C#4, E4
    { bass: 110.00, notes: [164.81, 220.00, 277.18, 329.63, 440.00] },
    // B minor: B2, F#3, B3, D4, F#4
    { bass: 123.47, notes: [185.00, 246.94, 293.66, 369.99, 493.88] },
    // F# minor: F#2, C#3, F#3, A3, C#4
    { bass: 92.50, notes: [138.59, 185.00, 220.00, 277.18, 369.99] },
    // G major: G2, D3, G3, B3, D4
    { bass: 98.00, notes: [146.83, 196.00, 246.94, 293.66, 392.00] },
    // D major: D3, A3, D4, F#4, A4
    { bass: 146.83, notes: [220.00, 293.66, 369.99, 440.00, 587.33] },
    // G major: G2, D3, G3, B3, D4
    { bass: 98.00, notes: [146.83, 196.00, 246.94, 293.66, 392.00] },
    // A major: A2, E3, A3, C#4, E4
    { bass: 110.00, notes: [164.81, 220.00, 277.18, 329.63, 440.00] }
  ];

  const chordDuration = duration / chordProgression.length; // 3 seconds per chord

  // Synthesize notes with soft attack, long decay, and gentle harmonics
  for (let s = 0; s < totalSamples; s++) {
    const t = s / sampleRate;
    const chordIndex = Math.floor(t / chordDuration) % chordProgression.length;
    const chord = chordProgression[chordIndex];
    const chordTime = t - (chordIndex * chordDuration);

    let left = 0;
    let right = 0;

    // Bass note (warm cello/sub piano)
    const bassEnv = Math.exp(-chordTime * 0.8) * Math.min(1, chordTime * 8);
    const bassWave = Math.sin(2 * Math.PI * chord.bass * t) * 0.35 +
                     Math.sin(2 * Math.PI * (chord.bass * 2) * t) * 0.12;
    left += bassWave * bassEnv;
    right += bassWave * bassEnv;

    // Arpeggio / harp notes inside chord
    const numNotes = chord.notes.length;
    const noteInterval = chordDuration / (numNotes + 1);

    for (let n = 0; n < numNotes; n++) {
      const noteTime = chordTime - (n * noteInterval * 0.7);
      if (noteTime > 0) {
        const freq = chord.notes[n];
        // Piano/harp envelope: instant attack, exponential decay
        const env = Math.exp(-noteTime * 1.5) * Math.min(1, noteTime * 50);
        // Rich harmonics (bell/piano chime)
        const harm1 = Math.sin(2 * Math.PI * freq * t);
        const harm2 = Math.sin(2 * Math.PI * freq * 2 * t) * 0.4;
        const harm3 = Math.sin(2 * Math.PI * freq * 3 * t) * 0.15;
        const harm4 = Math.sin(2 * Math.PI * freq * 4 * t) * 0.05;
        const tone = (harm1 + harm2 + harm3 + harm4) * env * 0.22;

        // Stereo panning
        const pan = (n / (numNotes - 1)) * 0.8 - 0.4; // -0.4 to +0.4
        left += tone * (0.5 - pan * 0.5);
        right += tone * (0.5 + pan * 0.5);
      }
    }

    // Add high melody sparkle
    const sparkleFreq = 880 + Math.sin(t * 1.5) * 220;
    const sparkle = Math.sin(2 * Math.PI * sparkleFreq * t) * 0.015 * Math.sin(t * Math.PI / duration);
    left += sparkle;
    right += sparkle;

    // Soft global fade in and fade out for seamless looping
    let masterFade = 1.0;
    if (t < 1.0) masterFade = t;
    else if (t > duration - 1.0) masterFade = (duration - t);

    left *= masterFade * 0.85;
    right *= masterFade * 0.85;

    // Clamp
    left = Math.max(-0.95, Math.min(0.95, left));
    right = Math.max(-0.95, Math.min(0.95, right));

    const offset = 44 + s * blockAlign;
    buffer.writeInt16LE(Math.round(left * 32767), offset);
    buffer.writeInt16LE(Math.round(right * 32767), offset + 2);
  }

  const outPath = path.join(__dirname, 'public', 'assets', 'romantic_melody.wav');
  fs.writeFileSync(outPath, buffer);
  console.log(`Generated romantic music at: ${outPath} (${(buffer.length / (1024 * 1024)).toFixed(2)} MB)`);
}

generateRomanticTrack();
