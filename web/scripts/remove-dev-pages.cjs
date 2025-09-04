const fs = require('fs');
const path = require('path');

function removeIfExists(targetPath) {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
    console.log(`[prebuild] Removed: ${targetPath}`);
  } else {
    console.log(`[prebuild] Skipped (not found): ${targetPath}`);
  }
}

function main() {
  const isProd = process.env.NODE_ENV === 'production' || process.env.ASTRO_ENV === 'production';
  if (!isProd) {
    console.log('[prebuild] Not production, skipping removal of dev-only pages');
    return;
  }

  const projectRoot = path.resolve(__dirname, '..');
  const pagesDir = path.join(projectRoot, 'src', 'pages');
  removeIfExists(path.join(pagesDir, 'demo'));
  removeIfExists(path.join(pagesDir, 'test'));
}

main();
