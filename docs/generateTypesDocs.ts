import * as fs from 'fs';
import * as path from 'path';

interface Property {
  name: string;
  type: string;
  description: string;
}

export interface CustomType {
  name: string;
  type: 'enum' | 'object';
  description: string;
  properties?: Property[];
  values?: string[];
  sourceFile: string;
}

function parseZodType(zodType: string): string {
  const typeMap = {
    'z.string()': 'string',
    'z.number()': 'number',
    'z.boolean()': 'boolean'
  };
 
  const type = zodType.trim();
  
  if (type.endsWith('Schema')) {
    return type.replace('Schema', '');
  }
  
  if (type.includes('.nullable()')) {
    const baseType = type.replace('.nullable()', '');
    return `${parseZodType(baseType)} | null`;
  }
 
  for (const [key, baseType] of Object.entries(typeMap)) {
    if (type.startsWith(key)) {
      return baseType;
    }
  }
 
  if (type.startsWith('z.array')) {
    const innerMatch = type.match(/z\.array\((.*)\)/);
    if (!innerMatch) return 'unknown[]';
    return `${parseZodType(innerMatch[1])}[]`;
  }
 
  if (type.startsWith('z.record')) {
    const matches = type.match(/z\.record\((.*?),\s*([\s\S]*?)\)(?![\s\S]*\)$)/);
    if (!matches) return 'Record<string, unknown>';
    const [_, keyType, valueType] = matches;
    const parsedValueType = parseZodType(valueType.trim());
    const parsedKeyType = parseZodType(keyType.trim());
    
    return `Record<${parsedKeyType}, ${parsedValueType}>`;
  }
 
  if (type.startsWith('z.tuple')) {
    const innerMatch = type.match(/z\.tuple\(\[(.*)\]\)/);
    if (!innerMatch) return '[unknown]';
    const types = innerMatch[1].split(',').map(t => parseZodType(t.trim()));
    return `[${types.join(', ')}]`;
  }
    
  if (type.includes('z.enum')) {
    return type.match(/\[(.*?)\]/)?.[1]
      .split(',')
      .map(v => v.trim().replace(/['"]/g, ''))
      .join(' | ') || 'enum';
  }
 
  return type.replace('z.', '');
}

function findTypeDescription(typeName: string, typeFileContent: string): string {
  const regex = new RegExp(
    `\\/\\*\\*([^*]*\\*+(?:[^/*][^*]*\\*+)*)\\/\\s*export\\s+type\\s+${typeName}\\b`,
    'g'
  );
  
  const match = regex.exec(typeFileContent);
  if (!match) return '';
  
  return match[1]
    .split('\n')
    .map(line => line.trim()
      .replace(/^\*\s*/, '')
      .replace(/\s*\*\/$/, '')
    )
    .filter(Boolean)
    .join(' ')
    .trim();
}

export function extractZodSchema(schemaContent: string, filename: string): CustomType[] {
  let typeFileContent = '';
  try {
    const typeFilePath = path.join(process.cwd(), 'src', 'types', 'index.ts');
    if (fs.existsSync(typeFilePath)) {
      typeFileContent = fs.readFileSync(typeFilePath, 'utf8');
    }
  } catch (error) {
    console.warn('Could not read types file:', error);
  }

  const schemaRegex = /export\s+const\s+(\w+Schema)\s*=\s*z\.([\s\S]*?);(?=\s*(?:export|$))/g;
  const types: CustomType[] = [];
  let match;

  while ((match = schemaRegex.exec(schemaContent)) !== null) {
    const [fullMatch, schemaName, definition] = match;
    const typeName = schemaName.replace('Schema', '');
    const description = findTypeDescription(typeName, typeFileContent);

    if (definition.includes('enum')) {
      const enumMatch = fullMatch.match(/\[(.*?)\]/s);
      const enumValues = enumMatch ? 
        enumMatch[1]
          .split(',')
          .map(v => v.trim().replace(/['"]/g, ''))
          .filter(Boolean)
          .sort() : [];
        
      types.push({
        name: typeName,
        type: 'enum',
        description,
        values: enumValues,
        sourceFile: filename
      });
    } else if (definition.includes('object')) {
      const properties: Property[] = [];
      const propsMatch = definition.match(/object\(\{([\s\S]*?)\}\)/s);
      
      if (propsMatch) {
        const propsContent = propsMatch[1];
        const propLines = propsContent.split('\n');
        
        const props = propLines
          .map(line => {
            const propMatch = line.match(/^\s*(\w+):\s*(.*?)(?:,\s*$|$)/);
            if (propMatch) {
              const [_, propName, propType] = propMatch;
              if (propName && propType) {
                return {
                  name: propName.trim(),
                  type: parseZodType(propType.trim()),
                  description: ''
                };
              }
            }
            return null;
          })
          .filter((prop): prop is Property => prop !== null)
          .sort((a, b) => a.name.localeCompare(b.name));
        
        properties.push(...props);
      }
      
      types.push({
        name: typeName,
        type: 'object',
        description,
        properties,
        sourceFile: filename
      });
    }
  }

  return types;
}

export function getAllTypesByFiles(files: string[]): CustomType[] {
  const sortedFiles = [...files].sort((a, b) => path.basename(a).localeCompare(path.basename(b)));
  const typesMap = new Map<string, CustomType[]>();
  
  for (const file of sortedFiles) {
    if (!file.endsWith('.ts')) continue;
    
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('z.object') || content.includes('z.enum')) {
      const types = extractZodSchema(content, path.basename(file));
      typesMap.set(file, types);
    }
  }

  const allTypes: CustomType[] = [];
  for (const file of sortedFiles) {
    const types = typesMap.get(file);
    if (types) {
      allTypes.push(...types);
    }
  }
  
  return allTypes;
}