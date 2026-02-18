/**
 * Build script: regenerates templates/index.html from static/partials/
 * Run: node build.js
 * NOTE: The FastAPI app (main.py) serves templates/index.html directly.
 *       Only run this if you need to rebuild the template from partials.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PARTIALS = path.join(ROOT, 'static', 'partials');

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

<script src="/static/js/data/translations.js"></script>
<script src="/static/js/components/nav.js"></script>
<script src="/static/js/components/language.js"></script>
<script src="/static/js/components/theme.js"></script>
<script src="/static/js/components/rss.js"></script>
<script src="/static/js/components/search-tooltip.js"></script>
<script src="/static/js/components/filters.js"></script>
<script src="/static/js/features/news-grid.js"></script>
<script src="/static/js/features/news-modal.js"></script>
<script src="/static/js/features/breaking.js"></script>
<script src="/static/js/features/sidebar.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, 'templates', 'index.html'), indexHtml, 'utf8');
console.log('Built templates/index.html from static/partials/');
