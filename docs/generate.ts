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
    
    // Skip node_modules and declaration files
    if (fileName.includes('node_modules') || fileName.endsWith('.d.ts')) {
      continue;
    }

    // Look for Zod schemas
    if (sourceFile.getText().includes('z.object') || 
        sourceFile.getText().includes('z.enum')) {
      const types = generateTypeDocs(sourceFile, program);
      if (types.length > 0) {
        typesByFile.set(fileName, types);
      }
    }

    // Also collect methods from this file
    const fileMethods = generateMethodDocs(sourceFile, program);
    if (fileMethods.length > 0) {
      methods.push(...fileMethods);
    }
  }

  // Combine all types
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
const sourceFiles = getAllFiles({
  sourceDir: SOURCE_DIR,
  includeExtensions: ['.ts'],
  excludePatterns: [
    /\.test\.ts$/,
    /\.spec\.ts$/,
    /\.d\.ts$/,
    /\/dist\//,
    /\/build\//,
    /\/node_modules\//
  ]
});

// Generate and write documentation
const docs = generateDocs(sourceFiles);
writeDocs(
  path.join(DOCS_DIR, 'api-docs.json'),
  docs
);

console.log(`Documentation generated from ${sourceFiles.length} files at docs/api-docs.json`);