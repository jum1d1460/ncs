#!/usr/bin/env node

const { execSync } = require('child_process');

function getStagedFiles() {
  try {
    const out = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    return out.split('\n').map((s) => s.trim()).filter(Boolean);
  } catch (_err) {
    console.error('[sync-progress] No se pudo obtener archivos staged.');
    process.exit(2);
  }
}

function main() {
  if (process.env.SYNC_PROGRESS_SKIP === '1') {
    console.log('[sync-progress] Saltado por SYNC_PROGRESS_SKIP=1');
    process.exit(0);
  }

  const staged = getStagedFiles();
  const codeChanged = staged.some((f) => f.startsWith('web/') || f.startsWith('cms/'));
  const specsChanged = staged.some((f) => f.startsWith('.agent-os/specs/'));
  const roadmapChanged = staged.includes('.agent-os/product/roadmap.md');
  const docsChanged = specsChanged || roadmapChanged;

  if (codeChanged && !docsChanged) {
    console.error('\n[sync-progress] Cambios en código detectados sin actualizar checkboxes en:');
    console.error('  - .agent-os/specs/**/tasks.md');
    console.error('  - .agent-os/product/roadmap.md');
    console.error('\nAcción requerida: Marca los ítems correspondientes con [x] según la regla Post-completion sync.');
    console.error('Sugerencia: añade los edits a este commit o usa SYNC_PROGRESS_SKIP=1 para saltar (no recomendado).');
    process.exit(1);
  }

  console.log('[sync-progress] OK');
  process.exit(0);
}

main();
