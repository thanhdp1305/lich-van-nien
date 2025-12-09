const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "docs/browser");
const dst = path.join(__dirname, "docs");

function copyDir(src, dst) {
  if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });

  for (const file of fs.readdirSync(src)) {
    const srcPath = path.join(src, file);
    const dstPath = path.join(dst, file);

    if (fs.lstatSync(srcPath).isDirectory()) {
      copyDir(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

// copy
copyDir(src, dst);

// xoá thư mục browser
fs.rmSync(src, { recursive: true, force: true });

console.log("✔ Build moved to docs/ (browser removed)");
