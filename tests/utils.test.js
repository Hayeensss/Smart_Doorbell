import { describe, it, expect } from 'vitest';

// Simple function to test
function sum(a, b) {
  return a + b;
}

describe('Utils', () => {
  it('should add two numbers correctly', () => {
    expect(sum(1, 2)).toBe(3);
  });
}); 