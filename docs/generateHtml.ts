import fs from 'fs';
import path from 'path';

function generateHtml() {
  const config = {
    repoAddress: 'https://github.com/raphjaph/ordapi',
    version: 'v0.0.3'
  };
  const scriptsContent = fs.readFileSync('docs/scripts.js', 'utf-8');
  const apiDocs = JSON.parse(fs.readFileSync('docs/api-docs.json', 'utf-8'));
  const cssContent = fs.readFileSync('docs/styles.css', 'utf-8');
  const typeNames = new Set(apiDocs.types.map(type => type.name));

  function createTypeLink(type) {
    const escaped = type.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    let result = escaped;
    const typeMatches = [...type.matchAll(/[A-Z][a-zA-Z0-9]*/g)];
    
    for (let i = typeMatches.length - 1; i >= 0; i--) {
      const match = typeMatches[i];
      const typeName = match[0];
      if (typeNames.has(typeName)) {
        const startPos = result.indexOf(typeName, match.index);
        if (startPos !== -1) {
          result = 
            result.slice(0, startPos) +
            `<a href="#${typeName}" class="type-link">${typeName}</a>` +
            result.slice(startPos + typeName.length);
        }
      }
    }
    return result;
  }

  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OrdAPI Documentation</title>
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="styles.css">
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        custom: {
                            base: 'var(--color-base)',
                            muted: 'var(--color-muted)',
                            accent: 'var(--color-accent)',
                            background: 'var(--color-background)'
                        }
                    },
                    fontSize: {
                        'body-sm': 'var(--text-body-sm)',
                        'body': 'var(--text-body)',
                        'title': 'var(--text-title)',
                        'header': 'var(--text-header)'
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-custom-background text-custom-base">
    <div class="main-layout">
        <header class="sticky-header">
            <nav class="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 class="text-header font-bold">OrdAPI ${config.version}</h1>
                    <p class="text-body-sm text-custom-muted mt-1">Simple TypeScript client for ord API.</p>
                </div>
                <div class="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto justify-end sm:justify-start">
                    <button 
                        onclick="window.open('${config.repoAddress}', '_blank')"
                        class="nav-button border border-custom-base/[var(--border-opacity)] text-custom-muted"
                    >
                        GitHub
                    </button>
                    <button 
                        data-tab="methods" 
                        class="nav-button active"
                    >
                        Methods
                    </button>
                    <button 
                        data-tab="types" 
                        class="nav-button"
                    >
                        Types
                    </button>
                </div>
            </nav>
        </header>

        <div class="content-wrapper">
            <main class="max-w-5xl mx-auto h-full relative">
                <div id="methods-content" class="tab-content active">
                    <div class="space-y-6">
                        ${apiDocs.methods.map(method => `
                            <article class="doc-section">
                                <header class="doc-header">
                                    <div class="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-2">
                                        <h3 class="text-title font-bold font-mono">${method.name}</h3>
                                        <code class="text-body-sm text-custom-muted">→ ${createTypeLink(method.returnType)}</code>
                                    </div>
                                    ${method.description ? `<p class="text-body-sm text-custom-muted mb-3">${method.description}</p>` : ''}
                                    <div class="flex flex-wrap items-center gap-2">
                                        ${method.recursive ? `<span class="bg-custom-accent text-custom-base px-2 py-1 rounded font-bold text-body-sm">RECURSIVE</span>` : ''}
                                        <span class="bg-custom-accent text-custom-base px-2 py-1 rounded font-bold text-body-sm">${method.httpMethod}</span>
                                        <code class="text-custom-muted text-body-sm break-all">${method.endpoint}</code>
                                    </div>
                                </header>
                                ${method.parameters?.length > 0 ? `
                                    <button class="w-full p-4 sm:p-6 text-left" data-collapse-trigger>
                                        <h4 class="text-custom-base font-bold uppercase text-body-sm tracking-wider flex items-center gap-2">
                                            Parameters
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </h4>
                                    </button>
                                    <div class="section-content pb-4 pr-4 pl-4 sm:pb-6 sm:pl-6 sm:pr-6 space-y-2">
                                        ${method.parameters.map(param => `
                                            <div class="bg-custom-accent p-3 rounded-lg">
                                                <div class="flex flex-wrap items-baseline gap-2">
                                                    <code class="text-custom-base text-body-sm font-bold">${param.name}</code>
                                                    <code class="text-custom-muted text-body-sm">${createTypeLink(param.type)}</code>
                                                </div>
                                                ${param.description ? `<p class="text-custom-muted text-body-sm">${param.description}</p>` : ''}
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </article>
                        `).join('')}
                    </div>
                </div>

        <div id="types-content" class="tab-content">
    <div class="space-y-6">
        ${apiDocs.types.map(type => `
            <article class="doc-section" id="${type.name}">
                <header class="doc-header">
                    <h3 class="text-title font-bold font-mono mb-1">${type.name}</h3>
                    <p class="text-body-sm text-custom-muted">
                        ${type.description || `Type defined in ${type.sourceFile}`}
                    </p>
                </header>
                ${type.properties ? `
                    <button class="w-full p-4 sm:p-6 text-left" data-collapse-trigger>
                        <h4 class="text-custom-base font-bold uppercase text-body-sm tracking-wider flex items-center gap-2">
                            Properties
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </h4>
                    </button>
                    <div class="section-content pb-4 pr-4 pl-4 sm:pb-6 sm:pl-6 sm:pr-6 space-y-2">
                        ${type.properties.map(prop => `
                            <div class="bg-custom-accent p-3 rounded-lg">
                                <div class="flex flex-wrap items-baseline gap-2">
                                    <code class="text-custom-base text-body-sm font-bold">${prop.name}</code>
                                    <code class="text-custom-muted text-body-sm">${createTypeLink(prop.type)}</code>
                                </div>
                                ${prop.description ? `<p class="text-custom-muted text-body-sm">${prop.description}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                ${type.values ? `
                    <button class="w-full p-4 sm:p-6 text-left" data-collapse-trigger>
                        <h4 class="text-custom-base font-bold uppercase text-body-sm tracking-wider flex items-center gap-2">
                            Values
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </h4>
                    </button>
                    <div class="section-content pb-4 pr-4 pl-4 sm:pb-6 sm:pl-6 sm:pr-6">
                        <div class="bg-custom-accent p-3 rounded-lg">
                            <code class="text-custom-muted text-body-sm break-all">
                                ${type.values.join(' | ')}
                            </code>
                        </div>
                    </div>
                ` : ''}
            </article>
        `).join('')}
    </div>
</div>
</main>
</div>
</div>
    <script src="scripts.js"></script>
</body>
</html>`;

  const distDir = path.join(process.cwd(), 'docs/dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  fs.copyFileSync(
    path.join(process.cwd(), 'docs/favicon.ico'),
    path.join(distDir, 'favicon.ico')
  );

  fs.writeFileSync(
    path.join(distDir, 'index.html'),
    htmlTemplate
  );

  fs.writeFileSync(
    path.join(distDir, 'styles.css'),
    cssContent
  );

  fs.writeFileSync(path.join(distDir, 'scripts.js'), scriptsContent);

  console.log('Documentation HTML generated successfully!');
}

generateHtml();