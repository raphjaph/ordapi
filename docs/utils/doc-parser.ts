import * as ts from 'typescript';

export interface ParsedDoc {
  description: string;
  params: Record<string, string>;
  returnType?: string;
}

export function extractDocComment(node: ts.Node, sourceFile: ts.SourceFile): string {
  const ranges = ts.getLeadingCommentRanges(sourceFile.text, node.pos);
  if (!ranges || ranges.length === 0) return '';
  
  const commentRange = ranges[ranges.length - 1];
  return sourceFile.text.substring(commentRange.pos, commentRange.end);
}

export function parseDocComment(comment: string): ParsedDoc {
  if (!comment) {
    return { description: '', params: {} };
  }

  const result: ParsedDoc = {
    description: '',
    params: {},
  };

  const lines = comment
    .replace(/\/\*\*|\*\/|\*/g, '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  let currentSection = 'description';

  for (const line of lines) {
    if (line.startsWith('@param')) {
      const paramMatch = line.match(/@param\s+(\w+)\s*-?\s*(.*)/);
      if (paramMatch) {
        const [, name, description] = paramMatch;
        result.params[name] = description || '';
      }
      continue;
    }

    if (line.startsWith('@returns')) {
      const returnMatch = line.match(/@returns\s+(.*)/);
      if (returnMatch) {
        result.returnType = returnMatch[1];
      }
      continue;
    }

    if (!line.startsWith('@') && currentSection === 'description') {
      result.description += (result.description ? ' ' : '') + line;
    }
  }

  return result;
}