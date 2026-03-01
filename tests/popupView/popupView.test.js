import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initEvents, renderColorPallete } from '../../src/js/popupView.js';
import { onPickedColor } from '../../src/js/controller.js';

vi.mock('../../src/js/controller.js', () => ({
    onPickedColor: vi.fn()
}));

describe('popupView', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        // Preparamos el escenario
        document.body.innerHTML = `
            <div id="selected-color"></div>
            <div id="similar-colors"></div>
            <div id="complementary-color"></div>
            <input id="item-input"/>
            <button id="submit-color__btn">Añadir</button>
        `;
        global.EyeDropper = class {
            open() {
                // Simulamos que el usuario selecciona un color
                return Promise.resolve({ sRGBHex: '#be3131ff' });
            }
        };
    });

    it('Should get a color from DOM', async () => {
        // ARRANGE
        const button = document.getElementById('submit-color__btn');
        const mockHex = '#fff';
        initEvents();

        // ACTUAR
        button.click();

        // OBSERVAR
        expect(onPickedColor).toHaveBeenCalledWith(mockHex);
    })

    it('should receive the correct number of colors in Array (["#d82020ff", "#23b1aaff", "#be3131ff", "#792ab9ff", "#fff"])', () => {
        const MockData = ["#d82020ff", "#23b1aaff", "#be3131ff", "#792ab9ff", "#fff"];
        renderColorPallete(MockData);
        expect(MockData.length).toBe(5);
    });

    it('should render all color components in all sections (selected,similar,complementary) correctly', () => {

        // PREAPARE
        const containers = {
            selected: document.getElementById('selected-color'),
            similar: document.getElementById('similar-colors'),
            complementary: document.getElementById('complementary-color')
        };

        const mockColorPallete = ["#d82020ff", "#23b1aaff", "#be3131ff", "#792ab9ff", "#fff"];

        // ACTUAR
        renderColorPallete(mockColorPallete, containers);

        // OBSERVAR
        expect(containers.selected.childElementCount).toBe(1);
        expect(containers.similar.childElementCount).toBe(3);
        expect(containers.complementary.childElementCount).toBe(1);
    });


    it('Should fill the color component with the selected collor #21da68ff', () => {
        // 1. ARRANGE
        const containers = {
            selected: document.getElementById('selected-color'),
        };
        const mockColorPallete = ["#21da68ff"];

        // 2. ACTUAR
        renderColorPallete(mockColorPallete, containers);

        // 3. OBSERVAR
        const container = document.getElementById('selected-color');
        const colorBox = container.querySelector('.color-component__color-box');

        expect(colorBox.style.backgroundColor).toBe('rgb(33, 218, 104)');
    });

    it('Should fill the color component with the complementary collor #800909ff', () => {
        // 1. ARRANGE
        const containers = {
            complementary: document.getElementById('complementary-color'),
        };
        const mockColorPallete = ["#800909ff"];

        // 2. ACTUAR
        renderColorPallete(mockColorPallete, containers);

        // 3. OBSERVAR
        const container = document.getElementById('complementary-color');
        const colorBox = container.querySelector('.color-component__color-box');

        expect(colorBox.style.backgroundColor).toBe('rgb(128, 9, 9)');
    });

    it('should call onPickedColor when the add button is clicked', () => {
        // 1. ARRANGE
        initEvents();
        const button = document.getElementById('submit-color__btn');

        // 2. ACT
        button.click();

        // 3. ASSERT
        // Verificamos que la función mockeada del controlador fue llamada
        expect(onPickedColor).toHaveBeenCalled();

        // Si tu código pasa un argumento específico (como '#fff'), verifícalo:
        expect(onPickedColor).toHaveBeenCalledWith('#fff');
    });



    it('should put rgb color ()', () => {
        // 1. ARRANGE


        // 2. ACTUAR


        // 3. OBSERVAR
        expect().toBe();









    });