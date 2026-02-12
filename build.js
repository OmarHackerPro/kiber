/**
 * Build script: generates index.html from assets/partials/
 * Run: node build.js
 * No index.html exists until you run this.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PARTIALS = path.join(ROOT, 'assets', 'partials');

function read(relativePath) {
  return fs.readFileSync(path.join(PARTIALS, relativePath), 'utf8').trim();
}

const head = read('head/head.html');
const nav = read('layout/nav.html');
const content = read('layout/content.html');
const sidebar = read('layout/sidebar.html');
const modals = read('components/modals.html');

const indexHtml = `<!DOCTYPE html>
<html lang="en" translate="no">
<head>
${head}
</head>
<body>
${nav}

<main class="layout">
  <div class="content-area">
${content}
  </div>
${sidebar}
</main>

${modals}

<script src="assets/js/data/translations.js"></script>
<script src="assets/js/components/nav.js"></script>
<script src="assets/js/components/language.js"></script>
<script src="assets/js/components/theme.js"></script>
<script src="assets/js/components/rss.js"></script>
<script src="assets/js/components/search-tooltip.js"></script>
<script src="assets/js/components/filters.js"></script>
<script src="assets/js/features/news-grid.js"></script>
<script src="assets/js/features/news-modal.js"></script>
<script src="assets/js/features/breaking.js"></script>
<script src="assets/js/features/sidebar.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, 'index.html'), indexHtml, 'utf8');
console.log('Built index.html from assets/partials/');
