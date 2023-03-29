import { describe, expect, test } from '@jest/globals';
import { sum } from '../src/mockclass';

describe('sum module', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });

  test('adds 1 + 0 to equal 1', () => {
    expect(sum(1, 0)).toBe(1);
  });

  test('adds 1 + 1 to equal 2', () => {
    expect(sum(1, 1)).toBe(2);
  });
});
