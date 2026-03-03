import { onPickedColor } from './controller';

export async function initEvents() {
    const button = document.getElementById('submit-color__btn');
    if (button) {
        button.addEventListener('click', async () => {
            const palette = await onPickedColor();
            if (palette) {
                const containers = {
                    selected: document.getElementById('selected-color'),
                    similar: document.getElementById('similar-colors'),
                    complementary: document.getElementById('complementary-color'),
                };
                renderColorPallete(palette, containers);
            }
        });
    }
}

export const createColorItemHTML = (
    hexLabel,
    rgbLabel,
    hideFormat = false,
    isSelected = false,
) => {
    const hiddenClass = hideFormat ? 'color-component__color-format--hidden' : '';

    return `
        <div class="color-component${isSelected ? ' color-component--main' : ''}">
            <div class="color-component__color-box"
                style="background-color: ${hexLabel};"
                title="Copiar color: ${hexLabel}">
            </div>
            <span class="color-component__color-format ${hiddenClass}"
                title="Copiar color: ${rgbLabel}">${rgbLabel}</span>
        </div>
    `;
};

export function renderColorPallete(colorPalette, containers = {}) {
    // const containers = {
    //   selected: document.getElementById('selected-color'),
    //   similar: document.getElementById('similar-colors'),
    //   complementary: document.getElementById('complementary-color'),
    // };

    if (
        !colorPalette ||
        !Array.isArray(colorPalette) ||
        colorPalette.length === 0 ||
        colorPalette.length > 5
    )
        return null;

    const { selected, similar, complementary } = containers;

    if (selected) {
        const hex = colorPalette[0].hex;
        const rgb = colorPalette[0].rgb;
        selected.innerHTML = createColorItemHTML(hex, rgb, true);
    }

    if (similar) {
        const nextThreeColors = colorPalette.slice(1, 4);

        similar.innerHTML = nextThreeColors
            .map(({ hex, rgb }) => createColorItemHTML(hex, rgb))
            .join('');
    }

    if (complementary) {
        const lastColor = colorPalette.at(-1);
        const { hex, rgb } = lastColor;
        complementary.innerHTML = createColorItemHTML(hex, rgb);
    }
}
