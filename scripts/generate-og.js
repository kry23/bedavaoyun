// Generate simple OG images as SVG → converted to data for placeholder
// Since we don't have canvas on Node.js, we create SVG-based HTML files
// that can be screenshotted, OR we create simple PNG placeholders
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'og');

// Simple BMP-like image generator (no deps needed)
// Creates a 1200x630 image with colored background, emoji, and text
function createPNG(width, height, bgR, bgG, bgB) {
  // Create a minimal valid PNG with solid color
  // PNG structure: signature + IHDR + IDAT + IEND

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = createChunk('IHDR', ihdrData);

  // IDAT - raw pixel data with zlib
  // For simplicity, create uncompressed deflate blocks
  const rawRow = Buffer.alloc(1 + width * 3); // filter byte + RGB
  rawRow[0] = 0; // no filter
  for (let x = 0; x < width; x++) {
    rawRow[1 + x * 3] = bgR;
    rawRow[1 + x * 3 + 1] = bgG;
    rawRow[1 + x * 3 + 2] = bgB;
  }

  // Build uncompressed deflate stream
  const rowSize = rawRow.length;
  const totalRaw = rowSize * height;

  // Use zlib
  const zlib = require('zlib');
  const rawData = Buffer.alloc(totalRaw);
  for (let y = 0; y < height; y++) {
    rawRow.copy(rawData, y * rowSize);
  }
  const compressed = zlib.deflateSync(rawData, { level: 1 });
  const idat = createChunk('IDAT', compressed);

  // IEND
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crcData = Buffer.concat([typeBuf, data]);

  // CRC32
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < crcData.length; i++) {
    crc ^= crcData[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  crc ^= 0xFFFFFFFF;
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc >>> 0);

  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

// Game configs
const games = [
  { slug: 'default', bg: [99, 102, 241] },       // indigo (primary)
  { slug: 'minesweeper', bg: [239, 68, 68] },     // red
  { slug: 'game2048', bg: [245, 158, 11] },       // amber
  { slug: 'snake', bg: [16, 185, 129] },          // emerald
  { slug: 'wordle', bg: [99, 102, 241] },         // indigo
];

// Create small placeholder OG images (1200x630 solid color)
// Real OG images should be designed properly later
games.forEach(({ slug, bg }) => {
  const png = createPNG(1200, 630, bg[0], bg[1], bg[2]);
  const filePath = path.join(outDir, `${slug}.png`);
  fs.writeFileSync(filePath, png);
  console.log(`Created ${slug}.png (${png.length} bytes)`);
});

console.log('Done! Note: These are solid-color placeholders.');
console.log('For production, replace with designed OG images (1200x630px).');
