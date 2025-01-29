import { z } from 'zod';

export const hexString = (length?: number) => {
  const base = z.string().regex(/^[0-9a-fA-F]+$/, 'Must be a hex string');
  return length ? base.length(length) : base;
};

export const satoshi = z.number().int().nonnegative();
export const blockHeight = z.number().int().nonnegative();
export const timestamp = z.number().int();
