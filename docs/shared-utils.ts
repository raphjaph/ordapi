import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { TypeDocumentation, MethodDocumentation } from './types';

export interface FileProcessingOptions {
  sourceDir: string;
  excludePatterns?: RegExp[];
  includeExtensions?: string[];
}

/**
 * Gets all files recursively from a directory matching specified criteria
 */
export function getAllFiles({
  sourceDir,
  excludePatterns = [/node_modules/],
  includeExtensions = ['.ts']
}: FileProcessingOptions): string[] {
  if (!fs.existsSync(sourceDir)) {
    return [];
  }

  const files = fs.readdirSync(sourceDir);
  return files.flatMap(file => {
    const fullPath = path.join(sourceDir, file);
    
    if (excludePatterns.some(pattern => pattern.test(fullPath))) {
      return [];
    }

    if (fs.statSync(fullPath).isDirectory()) {
      return getAllFiles({
        sourceDir: fullPath,
        excludePatterns,
        includeExtensions
      });
    }

    return includeExtensions.some(ext => file.endsWith(ext)) ? [fullPath] : [];
  });
}

/**
 * Creates a TypeScript program from source files
 */
export function createTSProgram(sourceFiles: string[]): ts.Program {
  const options: ts.CompilerOptions = {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    allowJs: true,
    checkJs: true,
    noEmit: true,
    types: ['node'],
    skipLibCheck: true,
  };

  return ts.createProgram(sourceFiles, options);
}

/**
 * Ensures output directory exists and writes documentation to JSON file
 */
export function writeDocs(
  outputPath: string,
  documentation: { methods: MethodDocumentation[]; types: TypeDocumentation[]; }
): void {
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(
    outputPath,
    JSON.stringify(documentation, null, 2)
  );
}

/**
 * Node visitor helper for TypeScript AST
 */
export function visitNodes(
  node: ts.Node, 
  visitor: (node: ts.Node) => void
): void {
  visitor(node);
  ts.forEachChild(node, node => visitNodes(node, visitor));
}