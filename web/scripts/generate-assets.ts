/**
 * One-off asset generator: favicon.svg, PNG icons and per-page Open Graph
 * images. Run with: npm run icons
 * Requires sharp (devDependency). Outputs are committed to the repo.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const root = join(__dirname, '..');
const pub = join(root, 'public');

const markSvg = (ink: string, accent: string, bg?: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  ${bg ? `<rect width="32" height="32" rx="8" fill="${bg}"/>` : ''}
  <rect x="2" y="2" width="28" height="28" rx="8" fill="none" stroke="${ink}" stroke-width="2.4"/>
  <circle cx="16" cy="16" r="6.4" fill="none" stroke="${accent}" stroke-width="2.8"/>
  <circle cx="16" cy="16" r="1.7" fill="${accent}"/>
</svg>`;

const titleSize = (t: string) => (t.length <= 22 ? 64 : t.length <= 30 ? 54 : 46);

const ogImage = (title: string, subtitle: string) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#1e2924"/>
  <rect x="0" y="628" width="1200" height="2" fill="#175e54"/>
  <g transform="translate(80,72)">
    <rect x="0" y="0" width="44" height="44" rx="11" fill="none" stroke="#eceade" stroke-width="3.2"/>
    <circle cx="22" cy="22" r="9" fill="none" stroke="#8ecbbe" stroke-width="3.6"/>
    <circle cx="22" cy="22" r="2.3" fill="#8ecbbe"/>
    <text x="62" y="31" font-family="Georgia, 'Times New Roman', serif" font-size="25" fill="#eceade" letter-spacing="0.5">Glance</text>
  </g>
  <text x="80" y="330" font-family="Georgia, 'Times New Roman', serif" font-size="${titleSize(title)}" font-weight="bold" fill="#eceade" letter-spacing="-1.5">${title}</text>
  <text x="80" y="430" font-family="Georgia, 'Times New Roman', serif" font-size="28" fill="#aeb4a4">${subtitle}</text>
  <text x="80" y="566" font-family="Consolas, 'DejaVu Sans Mono', monospace" font-size="19" fill="#6f7a70">glance-win.vercel.app</text>
</svg>`;

const pages: Array<[string, string, string]> = [
  ['home', 'Lock screen widgets, minus the feed', 'Battery health, habit rings, calendar and tasks. Open source, MIT.'],
  ['widgets', 'The widget set', 'Battery+, habit rings, consistency graph, calendar, tasks, recap'],
  ['how-it-works', 'How it works', 'MSIX provider, Adaptive Cards, local collector, local SQLite'],
  ['roadmap', 'Milestones M0 to M6', 'Nothing has shipped yet. Status: planning.'],
  ['get-started', 'Not released yet', 'Star the repo, join the release list, hear when the first build ships'],
  ['faq', 'Questions, answered', 'Release status, data locality, privacy modes, license, platforms'],
  ['privacy', 'Privacy policy', 'Release list only, PostHog after consent, local-only app data'],
  ['terms', 'Terms of service', 'Open source, no warranty, draft for review'],
  ['imprint', 'Imprint', 'Operator details, draft for review']
];

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function main() {
  // Favicon SVG: same mark, currentColor friendly
  writeFileSync(join(pub, 'favicon.svg'), markSvg('#211e1a', '#175e54').trim());

  // Raster icons on paper background for the apple touch icon and manifest
  const iconSvg = (size: number) => Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#faf8f4"/><rect x="2.4" y="2.4" width="27.2" height="27.2" rx="6.4" fill="none" stroke="#211e1a" stroke-width="2.4"/><circle cx="16" cy="16" r="6.2" fill="none" stroke="#175e54" stroke-width="2.8"/><circle cx="16" cy="16" r="1.7" fill="#175e54"/></svg>`
  );
  const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" fill="#1e2924"/><circle cx="256" cy="256" r="104" fill="none" stroke="#8ecbbe" stroke-width="42"/><circle cx="256" cy="256" r="24" fill="#8ecbbe"/></svg>`;

  await sharp(iconSvg(180)).resize(180, 180).png().toFile(join(pub, 'apple-touch-icon.png'));
  await sharp(iconSvg(192)).resize(192, 192).png().toFile(join(pub, 'icon-192.png'));
  await sharp(iconSvg(512)).resize(512, 512).png().toFile(join(pub, 'icon-512.png'));
  await sharp(Buffer.from(maskableSvg)).resize(512, 512).png().toFile(join(pub, 'icon-maskable-512.png'));
  await sharp(iconSvg(32)).resize(32, 32).png().toFile(join(pub, 'favicon-32.png'));
  // ICO container with 16 and 32 px frames
  const ico16 = await sharp(iconSvg(16)).resize(16, 16).png().toBuffer();
  const ico32 = await sharp(iconSvg(32)).resize(32, 32).png().toBuffer();
  // Minimal ICO writer: PNG-compressed entries (valid in all modern browsers)
  const dir = Buffer.alloc(6 + 16 * 2);
  dir.writeUInt16LE(0, 0); dir.writeUInt16LE(1, 2); dir.writeUInt16LE(2, 4);
  const e1 = Buffer.alloc(16); e1.writeUInt8(16, 0); e1.writeUInt8(16, 1); e1.writeUInt8(0, 2); e1.writeUInt8(0, 3); e1.writeUInt16LE(1, 4); e1.writeUInt16LE(32, 6); e1.writeUInt32LE(ico16.length, 8); e1.writeUInt32LE(6 + 32, 12);
  const e2 = Buffer.alloc(16); e2.writeUInt8(32, 0); e2.writeUInt8(32, 1); e2.writeUInt8(0, 2); e2.writeUInt8(0, 3); e2.writeUInt16LE(1, 4); e2.writeUInt16LE(32, 6); e2.writeUInt32LE(ico32.length, 8); e2.writeUInt32LE(6 + 32 + ico16.length, 12);
  writeFileSync(join(pub, 'favicon.ico'), Buffer.concat([dir, e1, e2, ico16, ico32]));

  // OG images
  for (const [name, title, subtitle] of pages) {
    await sharp(Buffer.from(ogImage(esc(title), esc(subtitle)))).png().toFile(join(pub, 'og', `${name}.png`));
  }
  console.log('assets generated');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
