import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initEvents, renderColorPallete } from '../../src/js/popupView.js';
import { onPickedColor } from '../../src/js/controller.js';

vi.mock('../../src/js/controller.js', () => ({
  onPickedColor: vi.fn(),
}));

describe('popupView', () => {
  let MockData;

  beforeEach(() => {
    vi.clearAllMocks();
    MockData = [
      { hex: '#FF5733', rgb: 'rgb(255, 87, 51)', label: 'selected' },
      { hex: '#FF3375', rgb: 'rgb(255, 51, 117)', label: 'similar' },
      { hex: '#FF3342', rgb: 'rgb(255, 51, 66)', label: 'similar' },
      { hex: '#FFBD33', rgb: 'rgb(255, 189, 51)', label: 'similar' },
      { hex: '#33DBFF', rgb: 'rgb(51, 219, 255)', label: 'complementary' },
    ];

    document.body.innerHTML = `
      <div id="selected-color"></div>
      <span class="info__hex" id="selected-hex-label">hex</span>
      <span class="info__rgb" id="selected-rgb-label">rgb</span>
      <div id="similar-colors"></div>
      <div id="complementary-color"></div>
      <input id="item-input"/>
      <button id="submit-color__btn">Añadir</button>
    `;

    global.EyeDropper = class {
      open() {
        return Promise.resolve({ sRGBHex: '#FF5733' });
      }
    };
  });

  // --- initEvents ---

  it('should call onPickedColor when button is clicked', async () => {
    const button = document.getElementById('submit-color__btn');
    initEvents();

    button.click();

    expect(onPickedColor).toHaveBeenCalled();
  });

  // --- renderColorPallete: input validation ---

  it('should receive the correct number of colors (5)', () => {
    renderColorPallete(MockData);
    expect(MockData.length).toBe(5);
  });

  // --- renderColorPallete: DOM structure ---

  it('should render 1 selected, 3 similar and 1 complementary component', () => {
    const containers = {
      selected: document.getElementById('selected-color'),
      similar: document.getElementById('similar-colors'),
      complementary: document.getElementById('complementary-color'),
    };

    renderColorPallete(MockData, containers);

    expect(containers.selected.childElementCount).toBe(1);
    expect(containers.similar.childElementCount).toBe(3);
    expect(containers.complementary.childElementCount).toBe(1);
  });

  // --- renderColorPallete: color box rendering ---

  it('should set the background-color of the selected box to the given hex', () => {
    const containers = {
      selected: document.getElementById('selected-color'),
    };
    const palette = [
      { hex: '#21DA68', rgb: 'rgb(33, 218, 104)', label: 'selected' },
    ];

    renderColorPallete(palette, containers);

    const colorBox = containers.selected.querySelector(
      '.color-component__color-box',
    );
    expect(colorBox.style.backgroundColor).toBe('rgb(33, 218, 104)');
  });

  it('should set the background-color of the complementary box to the given hex', () => {
    const containers = {
      complementary: document.getElementById('complementary-color'),
    };
    const palette = [
      { hex: '#800909', rgb: 'rgb(128, 9, 9)', label: 'complementary' },
    ];

    renderColorPallete(palette, containers);

    const colorBox = containers.complementary.querySelector(
      '.color-component__color-box',
    );
    expect(colorBox.style.backgroundColor).toBe('rgb(128, 9, 9)');
  });
});
