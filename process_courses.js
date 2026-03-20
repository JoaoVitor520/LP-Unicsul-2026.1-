import fs from 'fs';

// ============================================================
// SCRIPT SIMPLES: Lê raw_courses.txt (5 colunas tab-separated)
// e gera src/data/courses.ts SEM NENHUMA LÓGICA DE ADIVINHAÇÃO.
// Tudo vem diretamente do arquivo.
// Colunas: TÍTULO | MODALIDADE | GRAU | ÁREA | DURAÇÃO
// ============================================================

const raw = fs.readFileSync('raw_courses.txt', 'utf8').trim();
const lines = raw.split('\n');

const courses = lines.map((line, idx) => {
  const parts = line.trim().split('\t').map(s => s?.trim() || '');
  
  // Precisa ter exatamente 5 colunas
  if (parts.length < 5) {
    console.warn(`⚠️  Linha ${idx + 1} tem menos de 5 colunas, ignorando: "${line.trim().substring(0, 60)}..."`);
    return null;
  }
  
  const [title, modality, category, area, duration] = parts;
  
  if (!title) return null;
  
  // Escapar aspas duplas no título (segurança)
  const safeTitle = title.replace(/"/g, '\\"');

  return `  { id: ${idx + 1}, title: "${safeTitle}", category: "${category}", duration: "${duration}", modality: "${modality}", area: "${area}" }`;
}).filter(Boolean);

const output = `export const FIXED_COURSES = [\n${courses.join(',\n')}\n];\n`;

if (!fs.existsSync('src/data')) {
  fs.mkdirSync('src/data', { recursive: true });
}

fs.writeFileSync('src/data/courses.ts', output);

// ── Relatório final ──
const areaCounts = {};
courses.forEach(c => {
  const match = c.match(/area: "([^"]+)"/);
  if (match) areaCounts[match[1]] = (areaCounts[match[1]] || 0) + 1;
});

console.log(`\n✅ Gerado src/data/courses.ts com ${courses.length} cursos (ZERO adivinhação).`);
console.log('\n📊 Distribuição por Área:');
Object.entries(areaCounts).sort((a, b) => b[1] - a[1]).forEach(([area, count]) => {
  console.log(`   ${area}: ${count} cursos`);
});
console.log('');
