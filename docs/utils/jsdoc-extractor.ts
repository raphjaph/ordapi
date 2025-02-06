import * as ts from 'typescript';

export interface JSDocInfo {
  description: string;
  params: Record<string, string>;
  returns?: string;
  example?: string;
  tags: Record<string, string>;
}

export function extractJSDoc(
  sourceFile: ts.SourceFile,
  predicate: (node: ts.Node) => boolean = () => true
): Map<string, JSDocInfo> {
  const docs = new Map<string, JSDocInfo>();
  
  function visit(node: ts.Node) {
    if (predicate(node)) {
      const nodeIdentifier = getNodeIdentifier(node);
      if (nodeIdentifier) {
        const documentation = extractNodeDocs(node, sourceFile);
        if (documentation.description || Object.keys(documentation.params).length > 0) {
          docs.set(nodeIdentifier, documentation);
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  
  visit(sourceFile);
  console.log(`Extracted ${docs.size} documentation entries from ${sourceFile.fileName}`);
  return docs;
}

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

function cleanDocText(text: string): string {
  return text
    .trim()
    .replace(/^[-–—*]\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractNodeDocs(node: ts.Node, sourceFile: ts.SourceFile): JSDocInfo {
  const result: JSDocInfo = {
    description: '',
    params: {},
    tags: {}
  };

  // Get JSDoc nodes
  const jsDocs = ((node as any).jsDoc || []) as ts.JSDoc[];
  
  for (const jsDoc of jsDocs) {
    // Extract description from the main JSDoc comment
    if (jsDoc.comment) {
      const commentText = typeof jsDoc.comment === 'string' 
        ? jsDoc.comment 
        : Array.isArray(jsDoc.comment)
          ? jsDoc.comment.map(part => part.text).join(' ')
          : '';
      
      result.description += (result.description ? ' ' : '') + cleanDocText(commentText);
    }

    // Process JSDoc tags
    if (jsDoc.tags) {
      for (const tag of jsDoc.tags) {
        if (ts.isJSDocParameterTag(tag) && tag.name) {
          const paramName = tag.name.getText();
          const comment = tag.comment 
            ? (typeof tag.comment === 'string' ? tag.comment : tag.comment.map(part => part.text).join(' '))
            : '';
          result.params[paramName] = cleanDocText(comment);
        }
        else if (ts.isJSDocReturnTag(tag)) {
          const comment = tag.comment 
            ? (typeof tag.comment === 'string' ? tag.comment : tag.comment.map(part => part.text).join(' '))
            : '';
          result.returns = cleanDocText(comment);
        }
        else if (ts.isJSDoc(tag)) {
          const tagName = (tag as any).tagName?.escapedText;
          if (tagName) {
            const comment = tag.comment 
              ? (typeof tag.comment === 'string' ? tag.comment : tag.comment.map(part => part.text).join(' '))
              : '';
            result.tags[tagName] = cleanDocText(comment);
          }
        }
      }
    }
  }

  // Fallback to looking for leading comments if no JSDoc is found
  if (!result.description) {
    const commentRanges = ts.getLeadingCommentRanges(
      sourceFile.text,
      node.getFullStart()
    );

    if (commentRanges?.length) {
      const commentRange = commentRanges[commentRanges.length - 1];
      result.description = cleanDocText(
        sourceFile.text
          .slice(commentRange.pos, commentRange.end)
          .replace(/\/\*\*|\*\/|\*/g, '')
      );
    }
  }

  return result;
}