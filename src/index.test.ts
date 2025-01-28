import { expect, test, describe } from 'bun:test';
import { ApiClient, UserSchema } from './index';

describe('ApiClient', () => {
  test('validates user data', () => {
    const validUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
    };

    const result = UserSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  test('rejects invalid user data', () => {
    const invalidUser = {
      id: '1', // should be number
      name: '',
      email: 'not-an-email',
    };

    const result = UserSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });
});
