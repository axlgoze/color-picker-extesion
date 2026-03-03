import { describe, it, expect } from 'vitest';
import { calculateComplementaryColor } from '../../src/js/colorModel';

describe('complementary color', () => {
  it('should receive the selected color (#FF0000) and return its complementary color (#00FFFF)', () => {
    const color = '#FF0000';
    const complementaryColor = calculateComplementaryColor(color);
    expect(complementaryColor).toBe('#00FFFF');
  });
  it('should receive the selected color (#0000FF) and return its complementary color (#FFFF00)', () => {
    const color = '#0000FF';
    const complementaryColor = calculateComplementaryColor(color);
    expect(complementaryColor).toBe('#FFFF00');
  });
  it('should receive the selected color (#808080) and return its complementary color (#808080)', () => {
    const color = '#808080';
    const complementaryColor = calculateComplementaryColor(color);
    expect(complementaryColor).toBe('#808080');
  });
  it('should receive a null input and return null', () => {
    const color = null;
    const rgbColor = calculateComplementaryColor(color);
    expect(rgbColor).toBeNull();
  });
  it('should receive an empty string input and return null', () => {
    const color = '';
    const rgbColor = calculateComplementaryColor(color);
    expect(rgbColor).toBeNull();
  });
});
