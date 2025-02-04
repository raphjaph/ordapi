import fs from 'fs';
import path from 'path';

function escapeHtml(text) {
    return text
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function generateMethodCard(method) {
    const parameters = method.parameters?.length > 0 
      ? `
        <div class="p-6 space-y-6">
          <div>
            <h4 class="text-green-500 font-bold mb-3 uppercase text-sm tracking-wider">Parameters</h4>
            <div class="space-y-3">
              ${method.parameters.map(param => `
                <div class="bg-green-500/5 p-4 rounded-lg">
                  <div class="flex items-baseline gap-3 mb-1">
                    <code class="text-green-400 font-bold">${param.name}</code>
                    <code class="text-green-300/70 text-sm">${escapeHtml(param.type)}</code>
                  </div>
                  ${param.description ? `<p class="text-green-300/90 text-sm">${param.description}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      ` 
      : '';
  
    return `
      <div class="border border-green-500/20 bg-black rounded-lg overflow-hidden">
        <div class="border-b border-green-500/20 bg-green-500/5 p-6">
          <div class="flex items-baseline gap-4 mb-3">
            <h3 class="text-2xl font-bold font-mono text-green-500">
              ${method.name}
            </h3>
            <code class="text-green-300 text-md">→ ${escapeHtml(method.returnType)}</code>
          </div>
          ${method.description ? `<p class="text-green-300 mb-4">${method.description}</p>` : ''}
          <div class="flex items-center gap-3 text-sm">
            <span class="bg-green-500/10 text-green-500 px-2 py-1 rounded font-bold">
              ${method.httpMethod}
            </span>
            <code class="text-green-400">${method.endpoint}</code>
          </div>
        </div>
        ${parameters}
      </div>
    `;
  }

function generateTypeCard(type) {
  const propertiesSection = type.properties ? `
    <div class="p-6">
      <h4 class="text-green-500 font-bold mb-3 uppercase text-sm tracking-wider">Properties</h4>
      <div class="space-y-3">
        ${type.properties.map(prop => `
          <div class="bg-green-500/5 p-4 rounded-lg">
            <div class="flex items-baseline gap-3 mb-1">
              <code class="text-green-400 font-bold">${prop.name}</code>
              <code class="text-green-300/70 text-sm">${prop.type}</code>
            </div>
            ${prop.description ? `<p class="text-green-300/90 text-sm">${prop.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  const valuesSection = type.values ? `
    <div class="p-6">
      <h4 class="text-green-500 font-bold mb-3 uppercase text-sm tracking-wider">Values</h4>
      <div class="bg-green-500/5 p-4 rounded-lg">
        <code class="text-green-300 text-sm">
          ${type.values.join(' | ')}
        </code>
      </div>
    </div>
  ` : '';

  return `
    <div class="border border-green-500/20 bg-black rounded-lg overflow-hidden">
      <div class="border-b border-green-500/20 bg-green-500/5 p-6">
        <h3 class="text-2xl font-bold font-mono text-green-500 mb-2">
          ${type.name}
        </h3>
        ${type.description ? `<p class="text-green-300">${type.description}</p>` : 
          `<p class="text-green-300">Type defined in ${type.sourceFile}</p>`}
      </div>
      ${propertiesSection}
      ${valuesSection}
    </div>
  `;
}

function generateHtml() {
  const apiDocs = JSON.parse(fs.readFileSync('docs/api-docs.json', 'utf-8'));
  
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OrdAPI Documentation</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {}
            }
        }
    </script>
</head>
<body class="min-h-screen bg-black text-green-500">
    <div class="sticky top-0 bg-black border-b border-green-500/20 backdrop-blur-sm">
        <div class="max-w-5xl mx-auto px-6 py-6">
            <div class="flex flex-col gap-2">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold">OrdAPI v0.0.3</h1>
                        <p class="text-green-400 mt-1">Simple TypeScript client for ord API.</p>
                    </div>
                    <div class="flex gap-4">
                        <button 
                            onclick="window.open('https://github.com/raphjaph/ordapi', '_blank')"
                            class="px-4 py-2 border rounded transition-colors border-green-500/20 hover:border-green-500/40 text-green-500/70 hover:text-green-500"
                        >
                            GitHub
                        </button>
                        <button 
                            data-tab="methods" 
                            class="px-4 py-2 border rounded transition-colors border-green-500 bg-green-500/10 text-green-400"
                        >
                            Methods
                        </button>
                        <button 
                            data-tab="types" 
                            class="px-4 py-2 border rounded transition-colors border-green-500/20 hover:border-green-500/40 text-green-500/70"
                        >
                            Types
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <main class="max-w-5xl mx-auto px-6 py-8">
        <div id="methods-content" class="space-y-8">
            ${apiDocs.classMethods.map(generateMethodCard).join('')}
        </div>
        <div id="types-content" class="space-y-8 hidden">
            ${apiDocs.exportedTypes.map(generateTypeCard).join('')}
        </div>
    </main>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const buttons = document.querySelectorAll('button[data-tab]');
            const contents = {
                methods: document.getElementById('methods-content'),
                types: document.getElementById('types-content')
            };

            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const tab = button.getAttribute('data-tab');
                    
                    // Update buttons
                    buttons.forEach(b => {
                        if (b === button) {
                            b.classList.remove('border-green-500/20', 'text-green-500/70');
                            b.classList.add('border-green-500', 'bg-green-500/10', 'text-green-400');
                        } else {
                            b.classList.remove('border-green-500', 'bg-green-500/10', 'text-green-400');
                            b.classList.add('border-green-500/20', 'text-green-500/70');
                        }
                    });

                    // Update content
                    Object.entries(contents).forEach(([key, element]) => {
                        if (key === tab) {
                            element.classList.remove('hidden');
                        } else {
                            element.classList.add('hidden');
                        }
                    });
                });
            });
        });
    </script>
</body>
</html>`;

  // Create dist directory if it doesn't exist
  const distDir = path.join(process.cwd(), 'docs/dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Write the HTML file
  fs.writeFileSync(
    path.join(distDir, 'index.html'),
    htmlTemplate
  );

  console.log('Documentation HTML generated successfully!');
}

generateHtml();
