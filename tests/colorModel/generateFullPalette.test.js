import { describe, it, expect } from 'vitest';
import { generateFullPallete } from '../../src/js/colorModel.js';

describe('generate Full Pallete', () => {
  it('should generate colorDTO from a hex string', () => {
    // 1. ARRANGE
    const hexFormat = '#FF5733';

    // 2. ACTUAR
    const result = generateFullPallete(hexFormat);

    // 3. OBSERVAR
    expect(result).toEqual([
      { hex: '#FF5733', rgb: 'rgb(255, 87, 51)', label: 'selected' },
      { hex: '#FF3375', rgb: 'rgb(255, 51, 117)', label: 'similar' },
      { hex: '#FF3342', rgb: 'rgb(255, 51, 66)', label: 'similar' },
      { hex: '#FFBD33', rgb: 'rgb(255, 189, 51)', label: 'similar' },
      { hex: '#33DBFF', rgb: 'rgb(51, 219, 255)', label: 'complementary' },
    ]);
  });
});
