/**
 * Converts a Zod type string into its TypeScript equivalent
 */
export function parseZodType(zodType: string): string {
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