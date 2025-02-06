import * as ts from 'typescript';
import { MethodDocumentation } from './types';
import { visitNodes } from './shared-utils';
import { extractJSDoc } from './utils/jsdoc-extractor';
import api from '../src/api';

/**
 * Generates documentation for all methods in a source file
 */
export function generateMethodDocs(
  sourceFile: ts.SourceFile,
  program: ts.Program
): MethodDocumentation[] {
  const methods: MethodDocumentation[] = [];
  const typeChecker = program.getTypeChecker();
  
  // Extract all method documentation from the file
  const methodDocumentation = extractJSDoc(
    sourceFile.fileName,
    node => ts.isMethodDeclaration(node)
  );

  // Process each documented method
  methodDocumentation.forEach((docs, identifier) => {
    const methodName = identifier.split(':')[1];
    
    if (!isValidMethod(methodName)) {
      return;
    }

    // Find the actual method node
    visitNodes(sourceFile, (node) => {
      if (ts.isMethodDeclaration(node) && 
          (node.name as ts.Identifier).text === methodName) {
        
        const { parameters, endpoint, httpMethod } = extractMethodInfo(node, typeChecker);

        methods.push({
          name: methodName,
          description: docs.description,
          parameters: parameters.map(param => ({
            ...param,
            description: docs.params[param.name] || ''
          })),
          endpoint,
          httpMethod,
          returnType: node.type?.getText(sourceFile) || 'Promise<void>',
          recursive: endpoint.startsWith('/r/'),
          sourceFile: sourceFile.fileName
        });
      }
    });
  });

  return methods;
}

/**
 * Checks if a method should be documented
 */
function isValidMethod(methodName: string): boolean {
  return Boolean(
    methodName && 
    !methodName.startsWith('_') && 
    !['fetch', 'fetchPost'].includes(methodName)
  );
}

interface MethodInfo {
  parameters: Array<{name: string; type: string}>;
  endpoint: string;
  httpMethod: 'GET' | 'POST';
}

function extractMethodInfo(
  methodNode: ts.MethodDeclaration, 
  typeChecker: ts.TypeChecker
): MethodInfo {
  const parameters = methodNode.parameters.map(param => ({
    name: (param.name as ts.Identifier).escapedText.toString(),
    type: param.type 
      ? typeChecker.typeToString(typeChecker.getTypeFromTypeNode(param.type))
      : 'any'
  }));

  const httpMethod = methodNode.getText().includes('this.fetchPost') ? 'POST' : 'GET';
  const methodName = (methodNode.name as ts.Identifier).escapedText.toString();
  const paramNames = parameters.map(p => p.name);
  const endpoint = buildEndpoint(methodName, paramNames);

  return {
    parameters,
    endpoint,
    httpMethod
  };
}

function buildEndpoint(methodName: string, paramNames: string[]): string {
  if (api[methodName] && typeof api[methodName] === 'string') {
    return api[methodName];
  }

  const pathFunction = api[methodName];
  if (typeof pathFunction === 'function') {
    const functionStr = pathFunction.toString();
    const urlMatch = functionStr.match(/['"`](.*?)['"`]/);
    if (urlMatch) {
      let url = urlMatch[1];
      paramNames.forEach(param => {
        url = url.replace(
          new RegExp(`\\$\\{${param}\\}`, 'g'), 
          `{${param}}`
        );
      });
      return url;
    }
  }

  return '';
}