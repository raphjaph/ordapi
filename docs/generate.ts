import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { CustomType, extractZodSchema } from './generateTypesDocs';
import { getMethodDocs, type MethodDoc } from './generateMethodsDocs';

interface Documentation {
  classMethods: MethodDoc[];
  exportedTypes: CustomType[];
}

function generateDocs(sourceFiles: string[]): Documentation {
  const options: ts.CompilerOptions = {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    allowJs: true,
    checkJs: true,
    noEmit: true,
    types: ['node'],
    skipLibCheck: true,
  };

  const program = ts.createProgram(sourceFiles, options);
  const methods: MethodDoc[] = [];
  
  // Sort source files by their base names
  const sortedFiles = [...sourceFiles].sort((a, b) => 
    path.basename(a).localeCompare(path.basename(b))
  );
  
  // Use OrderedMap to maintain file ordering
  const typesByFile = new Map<string, CustomType[]>();
  
  // First pass: collect types maintaining file order
  for (const sourceFile of sortedFiles) {
    const fileName = sourceFile;
    
    if (!fileName.endsWith('.ts') || fileName.includes('node_modules')) {
      continue;
    }

    const content = fs.readFileSync(fileName, 'utf8');
    
    if (content.includes('z.object') || content.includes('z.enum')) {
      const extracted = extractZodSchema(content, path.basename(fileName));
      if (extracted.length > 0) {
        typesByFile.set(fileName, extracted);
      }
    }
  }

  // Second pass: collect methods
  for (const sourceFile of program.getSourceFiles()) {
    const fileName = sourceFile.fileName;
    
    if (!fileName.endsWith('.ts') || fileName.includes('node_modules')) {
      continue;
    }

    function visit(node: ts.Node) {
      if (ts.isClassDeclaration(node)) {
        
        node.members.forEach(member => {
          if (ts.isMethodDeclaration(member)) {
            try {
              const doc = getMethodDocs(member, sourceFile);
              if (doc) {
                methods.push(doc);
              }
            } catch (error) {
              console.error('Error processing method:', error);
            }
          }
        });
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }

  // Combine types in file order
  const allTypes: CustomType[] = [];
  for (const [file, types] of typesByFile.entries()) {
    allTypes.push(...types);
  }

  return {
    classMethods: methods,
    exportedTypes: allTypes
  };
}

// Ensure the docs directory exists
const docsDir = path.join(process.cwd(), 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir);
}

// Generate documentation
const sourceDir = './src';
const sourceFiles = [
  ...fs.readdirSync(sourceDir)
    .filter(file => file.endsWith('.ts'))
    .map(file => path.join(sourceDir, file)),
  ...getAllFiles(path.join(sourceDir, 'schemas'))
    .filter(file => file.endsWith('.ts'))
].sort((a, b) => path.basename(a).localeCompare(path.basename(b))); // Sort all source files

const docs = generateDocs(sourceFiles);

fs.writeFileSync(
  path.join(docsDir, 'api-docs.json'), 
  JSON.stringify(docs, null, 2)
);

function getAllFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const files = fs.readdirSync(dir);
  return files.flatMap(file => {
    const fullPath = path.join(dir, file);
    return fs.statSync(fullPath).isDirectory() ? getAllFiles(fullPath) : fullPath;
  });
}