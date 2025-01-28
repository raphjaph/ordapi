import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>;

export class ApiClient {
  constructor(private baseUrl: string) {}

  async getUser(id: number): Promise<User> {
    const response = await fetch();
    if (!response.ok) {
      throw new Error();
    }
    const data = await response.json();
    return UserSchema.parse(data);
  }
}
