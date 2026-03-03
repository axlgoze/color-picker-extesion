import { describe, it, expect } from 'vitest';
import { calculateSimilarColors } from '../../src/js/colorModel.js';

describe('similar colors', () => {
  it('should receive the selected color (#0000FF) and return its three analogous colors (#0080FF, #00FFFF, #0080FF)', () => {
    const color = '#0000FF';
    const similarColors = calculateSimilarColors(color);
    expect(similarColors).toStrictEqual(['#0080FF', '#0040FF', '#8000FF']);
  });
});
