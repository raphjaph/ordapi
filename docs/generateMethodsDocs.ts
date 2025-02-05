import * as ts from 'typescript';
import { extractDocComment, parseDocComment } from './utils/doc-parser';
import api from '../src/api';

export interface MethodDoc {
  name: string;
  parameters: {
    name: string;
    type: string;
    description: string;
  }[];
  description: string;
  endpoint: string;
  httpMethod: 'GET' | 'POST';
  returnType: string;
  recursive: boolean;
}

export function getMethodDocs(node: ts.MethodDeclaration, sourceFile: ts.SourceFile): MethodDoc | null {
  const nameIdentifier = node.name as ts.Identifier;
  const name = nameIdentifier.escapedText.toString();
  
  if (!name || name.startsWith('_') || ['fetch', 'fetchPost'].includes(name)) {
    return null;
  }

  const comment = extractDocComment(node, sourceFile);
  const docInfo = parseDocComment(comment);

  const endpoint = (() => {
    const pathFunction = api[name];
    if (!pathFunction) return '';

    if (typeof pathFunction === 'string') {
      return pathFunction;
    }

    const params = node.parameters.map(p => 
      (p.name as ts.Identifier).escapedText.toString()
    );
    
    const functionStr = pathFunction.toString();
    const urlMatch = functionStr.match(/['"`](.*?)['"`]/);
    if (urlMatch) {
      let url = urlMatch[1];
      params.forEach(param => {
        url = url.replace(
          new RegExp(`\\$\\{${param}\\}`, 'g'), 
          `{${param}}`
        );
      });
      return url;
    }
    return '';
  })();

  const parameters = node.parameters.map(param => {
    const paramName = (param.name as ts.Identifier).escapedText.toString();
    const paramType = param.type 
      ? sourceFile.text.slice(param.type.pos, param.type.end).trim()
      : 'any';
    
    return {
      name: paramName,
      type: paramType,
      description: docInfo.params[paramName] || ''
    };
  });

  const methodText = sourceFile.text.slice(node.pos, node.end);
  const httpMethod = methodText.includes('this.fetchPost') ? 'POST' : 'GET';

  return {
    name,
    parameters,
    description: docInfo.description,
    endpoint,
    httpMethod,
    returnType: node.type?.getText(sourceFile) || 'Promise<void>',
    recursive: endpoint.startsWith('/r/')
  };
}