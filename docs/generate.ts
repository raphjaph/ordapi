import * as path from 'path';
import { Documentation, MethodDocumentation, TypeDocumentation } from './types';
import { generateTypeDocs } from './generateTypesDocs';
import { generateMethodDocs } from './generateMethodsDocs';
import {
  getAllFiles,
  createTSProgram,
  writeDocs
} from './shared-utils';

function generateDocs(sourceFiles: string[]): Documentation {
  const program = createTSProgram(sourceFiles);
  const methods: MethodDocumentation[] = [];
  const typesByFile = new Map<string, TypeDocumentation[]>();
  // First pass: collect types
  for (const sourceFile of program.getSourceFiles()) {
    const fileName = sourceFile.fileName;
    
    if (fileName.includes('node_modules')) {
      continue;
    }

    if (sourceFile.getText().includes('z.object') || 
        sourceFile.getText().includes('z.enum')) {
      const types = generateTypeDocs(sourceFile, program);
      if (types.length > 0) {
        typesByFile.set(fileName, types);
      }
    }
  }

  // Second pass: collect methods
  for (const sourceFile of program.getSourceFiles()) {
    const fileName = sourceFile.fileName;
    
    if (fileName.includes('node_modules')) {
      continue;
    }

    methods.push(...generateMethodDocs(sourceFile, program));
  }

  // Combine all types preserving file order
  const allTypes = Array.from(typesByFile.values()).flat();

  return {
    methods: methods.sort((a, b) => a.name.localeCompare(b.name)),
    types: allTypes.sort((a, b) => a.name.localeCompare(b.name))
  };
}

// Main execution
const SOURCE_DIR = './src';
const DOCS_DIR = path.join(process.cwd(), 'docs');

// Get source files
const sourceFiles = [
  ...getAllFiles({
    sourceDir: SOURCE_DIR,
    includeExtensions: ['.ts']
  }),
  ...getAllFiles({
    sourceDir: path.join(SOURCE_DIR, 'schemas'),
    includeExtensions: ['.ts'], 
  }),
  ...getAllFiles({
    sourceDir: path.join(SOURCE_DIR, 'types'),
    includeExtensions: ['.ts'], 
  })
];

// Generate documentation
const docs = generateDocs(sourceFiles);

// Write the documentation to file
writeDocs(
  path.join(DOCS_DIR, 'api-docs.json'),
  docs
);

console.log('Documentation generated successfully at docs/api-docs.json');