const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const out = path.join(__dirname, "..", "assets", "images");
fs.mkdirSync(out, { recursive: true });

const GREEN = "#2F5D50";
const CREAM = "#F6F1E9";
const CORAL = "#E07A5F";

function svg({ bg, rounded = false, scale = 1 }) {
  const rect = bg
    ? `<rect width="1024" height="1024" rx="${rounded ? 230 : 0}" fill="${bg}"/>`
    : "";
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  ${rect}
  <g transform="translate(512 512) scale(${scale}) translate(-512 -512)">
    <polyline points="300,540 450,690 740,360" fill="none" stroke="${CREAM}"
      stroke-width="96" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="765" cy="262" r="58" fill="${CORAL}"/>
  </g>
</svg>`);
}

async function main() {
  await sharp(svg({ bg: GREEN })).png().toFile(path.join(out, "icon.png"));
  await sharp(svg({ scale: 0.7 })).png().toFile(path.join(out, "android-icon-foreground.png"));
  await sharp(svg({ bg: GREEN, rounded: true }))
    .png()
    .toFile(path.join(out, "splash-icon.png"));
  await sharp(svg({ bg: GREEN, rounded: true }))
    .resize(48, 48)
    .png()
    .toFile(path.join(out, "favicon.png"));
  console.log("Icons created in assets/images");
}

main();