import * as ts from 'typescript';

/**
 * Base interface for documented items
 */
export interface DocumentedItem {
  name: string;
  description: string;
  sourceFile: string;
}

/**
 * Represents a method parameter
 */
export interface Parameter {
  name: string;
  type: string;
  description: string;
}

/**
 * Documentation for an API method
 */
export interface MethodDocumentation extends DocumentedItem {
  parameters: Parameter[];
  endpoint: string;
  httpMethod: 'GET' | 'POST';
  returnType: string;
  recursive: boolean;
}

/**
 * Represents a property in a type definition
 */
export interface TypeProperty extends Parameter {}

/**
 * Documentation for a type definition
 */
export interface TypeDocumentation extends DocumentedItem {
  kind: 'enum' | 'object';
  properties?: TypeProperty[];
  values?: string[];
}

/**
 * Complete API documentation
 */
export interface Documentation {
  methods: MethodDocumentation[];
  types: TypeDocumentation[];
}

/**
 * Represents parsed JSDoc comments
 */
export interface ParsedComment {
  description: string;
  params: Record<string, string>;
  returns?: string;
  example?: string;
}

/**
 * Configuration for processing source files
 */
export interface FileProcessingConfig {
  sourceDir: string;
  excludePatterns?: RegExp[];
  includeExtensions?: string[];
}

/**
 * Options for generating documentation
 */
export interface GenerateOptions {
  outputDir: string;
  sourceDir: string;
  typeDescriptionsPath?: string;
}

/**
 * Node visitor function type
 */
export type NodeVisitor = (node: ts.Node) => void;