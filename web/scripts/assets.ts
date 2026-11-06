import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { pages } from "../lib/content";
async function main() {
  const logo = await readFile("public/icon.svg");
  for (const [name, size] of [
    ["icon-32", 32],
    ["icon-192", 192],
    ["icon-512", 512],
    ["apple-touch-icon", 180],
  ] as const) {
    await sharp(logo).resize(size, size).png().toFile(`public/${name}.png`);
  }
  const png = await readFile("public/icon-32.png");
  const ico = Buffer.alloc(22);
  ico.writeUInt16LE(1, 2);
  ico.writeUInt16LE(1, 4);
  ico[6] = 32;
  ico[7] = 32;
  ico.writeUInt16LE(1, 10);
  ico.writeUInt16LE(32, 12);
  ico.writeUInt32LE(png.length, 14);
  ico.writeUInt32LE(22, 18);
  await writeFile("public/favicon.ico", Buffer.concat([ico, png]));
  await mkdir("public/og", { recursive: true });
  function escape(s: string) {
    return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
  }
  for (const [path, page] of Object.entries({
    ...pages,
    "/404": { title: "Nothing here to glance at." },
  })) {
    const words = page.title.split(" ");
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      if ((line + " " + word).length > 25) {
        lines.push(line);
        line = word;
      } else line += (line ? " " : "") + word;
    }
    if (line) lines.push(line);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f5f4ef"/><g fill="none" stroke="#305b45" stroke-width="5"><circle cx="82" cy="80" r="20"/><path d="M92 60a20 20 0 1 1 0 40"/></g><text x="128" y="91" fill="#202820" font-family="sans-serif" font-size="35">glance</text><text x="64" y="172" fill="#305b45" font-family="sans-serif" font-size="17" letter-spacing="3">WINDOWS 11 WIDGETS / IN PLANNING</text>${lines.map((l, i) => `<text x="60" y="${280 + i * 85}" font-family="sans-serif" font-size="76" fill="${i ? "#305b45" : "#202820"}" letter-spacing="-3">${escape(l)}</text>`).join("")}<path d="M64 540H1136" stroke="#d7dacf"/><text x="64" y="580" fill="#61695f" font-family="sans-serif" font-size="18">Ad-free. Local data. Open source.</text><text x="1136" y="580" text-anchor="end" fill="#61695f" font-family="sans-serif" font-size="18">${path === "/" ? "glance-win.vercel.app" : path}</text></svg>`;
    await sharp(Buffer.from(svg))
      .png()
      .toFile(`public/og/${path === "/" ? "home" : path.slice(1)}.png`);
  }
}
void main();
