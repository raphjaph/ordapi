import * as ts from 'typescript';

/**
 * Represents a method parameter documentation
 */
interface ParameterDoc {
  name: string;
  type: string;
  description: string;
}

/**
 * Represents a method documentation
 */
export interface MethodDoc {
  name: string;
  parameters: ParameterDoc[];
  description: string;
  endpoint: string;
  httpMethod: 'GET' | 'POST';
  returnType: string;
  responseSchema: string;
}

/**
 * Map of method names to their corresponding API endpoints
 */
const API_MAP = {
  getAddressInfo: '/address/{address}',
  getBlock: '/block/{heightOrHash}',
  getBlockCount: '/blockcount',
  getBlockHashByHeight: '/blockhash/{height}',
  getLatestBlockHash: '/blockhash',
  getLatestBlockHeight: '/blockheight',
  getLatestBlocks: '/blocks',
  getLatestBlockTime: '/blocktime',
  getInscription: '/inscription/{id}',
  getInscriptionChild: '/inscription/{id}/{child}',
  getLatestInscriptions: '/inscriptions',
  getInscriptionsByPage: '/inscriptions/{page}',
  getInscriptionsByBlock: '/inscriptions/block/{height}',
  getInscriptionsByIds: '/inscriptions',
  getOutput: '/output/{outpoint}',
  getOutputs: '/outputs',
  getOutputsByAddress: '/outputs/{address}?type={type}',
  getRune: '/rune/{name}',
  getLatestRunes: '/runes',
  getRunesByPage: '/runes/{page}',
  getSat: '/sat/{number}',
  getTransaction: '/tx/{txId}',
  getServerStatus: '/status'
};

interface ParsedJSDoc {
    description: string;
    params: Record<string, string>;
    returns?: string;
  }
  
  function parseJSDocComment(comment: string): ParsedJSDoc {
    const lines = comment
      .replace(/\/\*\*|\*\/|\*/g, '') 
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);
  
    const result: ParsedJSDoc = {
      description: '',
      params: {},
    };
  
    let currentSection = 'description';
    
    for (const line of lines) {
      if (line.startsWith('@param')) {
        // Format: @param {type} name - description
        const paramMatch = line.match(/@param\s+\{([^}]+)\}\s+(\w+)\s*-?\s*(.*)/);
        if (paramMatch) {
          const [, , name, description] = paramMatch;
          result.params[name] = description;
        }
      } else if (line.startsWith('@returns')) {
        // Format: @returns {type} description
        const returnsMatch = line.match(/@returns\s+\{([^}]+)\}\s+(.*)/);
        if (returnsMatch) {
          const [, , description] = returnsMatch;
          result.returns = description;
        }
      } else if (!line.startsWith('@')) {
        if (currentSection === 'description') {
          result.description += (result.description ? '\n' : '') + line;
        }
      }
    }
  
    return result;
  }
  
  function extractJSDocComment(node: ts.Node, sourceFile: ts.SourceFile): string {
    const ranges = ts.getLeadingCommentRanges(sourceFile.text, node.pos);
    if (!ranges || ranges.length === 0) return '';
    const commentRange = ranges[ranges.length - 1];
    return sourceFile.text.substring(commentRange.pos, commentRange.end);
  }
  
  export function getMethodDocs(node: ts.MethodDeclaration, sourceFile: ts.SourceFile): MethodDoc | null {
    const nameIdentifier = node.name as ts.Identifier;
    const name = nameIdentifier.escapedText.toString();
    if (!name || name.startsWith('_') || ['fetch', 'fetchPost'].includes(name)) return null;
  
    const jsDoc = parseJSDocComment(extractJSDocComment(node, sourceFile));

    const start = node.pos;
    const end = node.end;
    const methodText = sourceFile.text.slice(start, end);
  
    return {
      name,
      parameters: node.parameters.map(param => {
        const paramName = (param.name as ts.Identifier).escapedText.toString();
        const paramType = param.type 
          ? sourceFile.text.slice(param.type.pos, param.type.end).trim()
          : 'any';
        
        return {
          name: paramName,
          type: paramType,
          description: jsDoc.params[paramName] || ''
        };
      }),
      description: jsDoc.description,
      endpoint: API_MAP[name] || '',
      httpMethod: methodText.includes('this.fetchPost') ? 'POST' : 'GET',
      returnType: node.type?.getText(sourceFile) || 'Promise<void>',
      responseSchema: (() => {
        const fetchMatch = methodText.match(/this\.fetch\([^,]+,\s*([\w.()]+)/);
        if (!fetchMatch) return '';
        
        const schema = fetchMatch[1];
        if (schema.includes('z.array')) {
          const arrayMatch = schema.match(/z\.array\((\w+Schema)\)/);
          return arrayMatch?.[1] || '';
        }
        if (schema.includes('z.number')) return 'z.number()';
        
        return schema;
      })(),
    };
  }