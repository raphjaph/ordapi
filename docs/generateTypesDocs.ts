import * as ts from 'typescript';
import { TypeDocumentation, TypeProperty } from './types';
import { parseZodType } from './utils/zod-type-parser';
import { extractJSDoc } from './utils/jsdoc-extractor';

export function generateTypeDocs(
  sourceFile: ts.SourceFile,
  program: ts.Program
): TypeDocumentation[] {
  const types: TypeDocumentation[] = [];
  
  // First collect all schema names from this file
  const schemaNames: string[] = [];
  ts.forEachChild(sourceFile, node => {
    if (ts.isVariableStatement(node)) {
      const declaration = node.declarationList.declarations[0];
      if (ts.isIdentifier(declaration.name) && 
          declaration.name.text.endsWith('Schema')) {
        schemaNames.push(declaration.name.text);
      }
    }
  });

  if (schemaNames.length === 0) {
    return [];
  }

  // Find types/index.ts file for documentation
  const typesFile = program.getSourceFiles().find(sf => 
    sf.fileName.includes('types/index.ts')
  );

  // Get documentation from types/index.ts
  const typeDocumentation = typesFile 
    ? extractJSDoc(
        typesFile,
        node => ts.isTypeAliasDeclaration(node) &&
          schemaNames.some(schema => 
            node.name.text === schema.replace('Schema', '')
          )
      )
    : new Map();

  // Process schemas with documentation
  ts.forEachChild(sourceFile, node => {
    if (!ts.isVariableStatement(node)) return;

    const declaration = node.declarationList.declarations[0];
    if (!ts.isIdentifier(declaration.name) || 
        !declaration.name.text.endsWith('Schema')) {
      return;
    }

    const schemaName = declaration.name.text;
    const typeName = schemaName.replace('Schema', '');
    const docs = typeDocumentation.get(`type:${typeName}`);
    const description = docs?.description || `Type defined in ${sourceFile.fileName}`;
    
    const initializer = declaration.initializer;
    if (!initializer) return;

    const typeText = sourceFile.text.slice(initializer.pos, initializer.end);
    
    if (typeText.includes('z.enum')) {
      types.push(extractEnumType(
        typeName,
        typeText,
        description,
        sourceFile.fileName
      ));
    } else if (typeText.includes('z.object')) {
      const objectType = extractObjectType(
        typeName,
        initializer,
        description,
        docs?.params || {},
        sourceFile.fileName,
        program.getTypeChecker()
      );
      types.push(objectType);
    }
  });

  return types.sort((a, b) => a.name.localeCompare(b.name));
}

function extractEnumType(
  name: string,
  typeText: string,
  description: string,
  sourceFile: string
): TypeDocumentation {
  const enumMatch = typeText.match(/\[(.*?)\]/s);
  const values = enumMatch
    ? enumMatch[1]
        .split(',')
        .map(v => v.trim().replace(/['"]/g, ''))
        .filter(Boolean)
        .sort()
    : [];

  return {
    name,
    kind: 'enum',
    description,
    values,
    sourceFile
  };
}

function extractObjectType(
  name: string,
  node: ts.Expression,
  description: string,
  paramDocs: Record<string, string>,
  sourceFile: string,
  typeChecker: ts.TypeChecker
): TypeDocumentation {
  const properties: TypeProperty[] = [];
  
  if (ts.isCallExpression(node)) {
    const objectArg = node.arguments[0];
    if (ts.isObjectLiteralExpression(objectArg)) {
      objectArg.properties.forEach(prop => {
        if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
          const propName = prop.name.text;
          const propType = parseZodType(prop.initializer.getText());
          
          properties.push({
            name: propName,
            type: propType,
            description: paramDocs[propName] || ''
          });
        }
      });
    }
  }

  return {
    name,
    kind: 'object',
    description,
    properties: properties.sort((a, b) => a.name.localeCompare(b.name)),
    sourceFile
  };
}