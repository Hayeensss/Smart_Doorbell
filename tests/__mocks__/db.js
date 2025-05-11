import { vi } from 'vitest';

export const db = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  limit: vi.fn().mockResolvedValue([]),
  first: vi.fn().mockResolvedValue({}),
};

export const eq = vi.fn();
export const desc = vi.fn();
export const and = vi.fn();
export const or = vi.fn();
export const gte = vi.fn();
export const lte = vi.fn();
export const sql = vi.fn();
export const inArray = vi.fn(); 