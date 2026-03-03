import { describe, it, expect } from 'vitest';
import { hexToRgb } from '../../src/js/colorModel.js';

describe('colorModel.js', () => {
  it('should receive the color in HEX format (#FF5733) and convert it to rgb(255, 87, 51)', () => {
    const color = '#FF5733';
    const rgbColor = hexToRgb(color);
    expect(rgbColor).toStrictEqual({ r: 255, g: 87, b: 51 });
  });
  it('should receive the color in HEX format (#000000) and convert it to rgb(0, 0, 0)', () => {
    const color = '#000000';
    const rgbColor = hexToRgb(color);
    expect(rgbColor).toStrictEqual({ r: 0, g: 0, b: 0 });
  });
  it('should receive the color in HEX format (#FFFFFF) and convert it to rgb(255, 255, 255)', () => {
    const color = '#FFFFFF';
    const rgbColor = hexToRgb(color);
    expect(rgbColor).toStrictEqual({ r: 255, g: 255, b: 255 });
  });
  it('should receive a null input and return null', () => {
    const color = null;
    const rgbColor = hexToRgb(color);
    expect(rgbColor).toBe(null);
  });
  it('should receive an empty string input and return null', () => {
    const color = '';
    const rgbColor = hexToRgb(color);
    expect(rgbColor).toBe(null);
  });
  it('should receive a 3 character (#FFF) string input and return rgb(255, 255, 255)', () => {
    const color = '#FFF';
    const rgbColor = hexToRgb(color);
    expect(rgbColor).toStrictEqual({ r: 255, g: 255, b: 255 });
  });
  it('Should receive an invalid length and return null', () => {
    const color = '#FF57333';
    const rgbColor = hexToRgb(color);
    expect(rgbColor).toBe(null);
  });
});
