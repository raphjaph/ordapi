import * as ts from 'typescript';

export interface JSDocInfo {
  description: string;
  params: Record<string, string>;
  returns?: string;
  example?: string;
  tags: Record<string, string>;
}

/**
 * Extracts JSDoc documentation from TypeScript nodes in a file
 * @param filePath - Path to the TypeScript file
 * @param predicate - Function to identify the nodes we want to extract docs from
 * @returns Map of node identifiers to their documentation
 */
export function extractJSDoc(
  filePath: string,
  predicate: (node: ts.Node) => boolean = () => true
): Map<string, JSDocInfo> {
  const program = ts.createProgram([filePath], {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
  });
  
  const sourceFile = program.getSourceFile(filePath);
  if (!sourceFile) {
    console.warn(`Could not find source file: ${filePath}`);
    return new Map();
  }

  const docs = new Map<string, JSDocInfo>();

  function visit(node: ts.Node) {
    if (predicate(node)) {
      const nodeIdentifier = getNodeIdentifier(node);
      if (nodeIdentifier && sourceFile) {
        const documentation = extractNodeDocs(node, sourceFile);
        docs.set(nodeIdentifier, documentation);
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return docs;
}

/**
 * Gets a unique identifier for a node based on its type
 */
function getNodeIdentifier(node: ts.Node): string | null {
  if (ts.isMethodDeclaration(node) && ts.isIdentifier(node.name)) {
    return `method:${node.name.text}`;
  }
  if (ts.isTypeAliasDeclaration(node)) {
    return `type:${node.name.text}`;
  }
  if (ts.isInterfaceDeclaration(node)) {
    return `interface:${node.name.text}`;
  }
  if (ts.isClassDeclaration(node) && node.name) {
    return `class:${node.name.text}`;
  }
  if (ts.isFunctionDeclaration(node) && node.name) {
    return `function:${node.name.text}`;
  }
  if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
    return `variable:${node.name.text}`;
  }
  return null;
}

/**
 * Cleans up documentation text by removing initial dashes, stars and normalizing whitespace
 */
function cleanDocText(text: string): string {
  return text
    .trim()
    .replace(/^[-–—*]\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts JSDoc documentation from a specific node
 */
function extractNodeDocs(node: ts.Node, sourceFile: ts.SourceFile): JSDocInfo {
  const result: JSDocInfo = {
    description: '',
    params: {},
    tags: {}
  };

  const commentRanges = ts.getLeadingCommentRanges(
    sourceFile.text,
    node.getFullStart()
  );

  if (!commentRanges?.length) {
    return result;
  }

  const commentRange = commentRanges[commentRanges.length - 1];
  const commentLines = sourceFile.text
    .slice(commentRange.pos, commentRange.end)
    .replace(/\/\*\*|\*\/|\*/g, '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  let currentSection = 'description';
  let currentParam = '';

  for (const line of commentLines) {
    if (line.startsWith('@')) {
      const [tag, ...content] = line.slice(1).split(' ');
      const tagContent = content.join(' ').trim();

      switch (tag) {
        case 'param':
          const paramMatch = tagContent.match(/^{[^}]+}\s+(\w+)\s*(.*)$/);
          if (paramMatch) {
            currentParam = paramMatch[1];
            result.params[currentParam] = cleanDocText(paramMatch[2]);
          }
          currentSection = 'param';
          break;

        case 'returns':
        case 'return':
          result.returns = cleanDocText(tagContent);
          currentSection = 'returns';
          break;

        case 'example':
          result.example = cleanDocText(tagContent);
          currentSection = 'example';
          break;

        default:
          result.tags[tag] = cleanDocText(tagContent);
          currentSection = tag;
      }
    } else {
      switch (currentSection) {
        case 'description':
          result.description += (result.description ? ' ' : '') + cleanDocText(line);
          break;
        case 'param':
          if (currentParam) {
            const cleanedLine = cleanDocText(line);
            result.params[currentParam] = result.params[currentParam]
              ? result.params[currentParam] + ' ' + cleanedLine
              : cleanedLine;
          }
          break;
        case 'returns':
          const cleanedReturnLine = cleanDocText(line);
          result.returns = result.returns
            ? result.returns + ' ' + cleanedReturnLine
            : cleanedReturnLine;
          break;
        case 'example':
          const cleanedExampleLine = cleanDocText(line);
          result.example = result.example
            ? result.example + ' ' + cleanedExampleLine
            : cleanedExampleLine;
          break;
        default:
          if (result.tags[currentSection]) {
            const cleanedTagLine = cleanDocText(line);
            result.tags[currentSection] += ' ' + cleanedTagLine;
          }
      }
    }
  }

  return result;
}