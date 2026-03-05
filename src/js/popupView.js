import { onPickedColor } from './controller.js';

// ─── Copy to clipboard helper ────────────────────────────────────────────────
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback for environments where clipboard API is unavailable
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}

// ─── Attach copy listeners to a rendered container ───────────────────────────
// Called after innerHTML is set so the new elements exist in the DOM.
function addCopyListeners(container) {
  container.querySelectorAll('.color-component__color-box').forEach((box) => {
    box.addEventListener('click', () => {
      const hex = box.dataset.hex;
      copyToClipboard(hex);
      showCopyFeedback(box, hex);
    });
  });

  container
    .querySelectorAll('.color-component__color-format')
    .forEach((label) => {
      label.addEventListener('click', () => {
        copyToClipboard(label.textContent);
        showCopyFeedback(label, label.textContent);
      });
    });
}

// ─── Visual feedback: briefly show "Copied!" ─────────────────────────────────
function showCopyFeedback(el, text) {
  const original = el.textContent;
  const originalTitle = el.title;
  el.title = `✓ Copiado: ${text}`;
  el.style.outline = '2px solid #d6bd98';
  setTimeout(() => {
    el.title = originalTitle;
    el.style.outline = '';
    el.textContent = original;
  }, 1200);
}

// ─── getContainers ────────────────────────────────────────────────────────────
function getContainers() {
  return {
    selected: document.getElementById('selected-color'),
    similar: document.getElementById('similar-colors'),
    complementary: document.getElementById('complementary-color'),
  };
}

// ─── initEvents ──────────────────────────────────────────────────────────────
export async function initEvents() {
  const button = document.getElementById('submit-color__btn');
  if (button) {
    button.addEventListener('click', async () => {
      const palette = await onPickedColor();
      if (palette) {
        renderColorPallete(palette, getContainers());
      }
    });
  }

  // Also wire the selected-color hex/rgb labels for copy
  const hexLabel = document.getElementById('selected-hex-label');
  const rgbLabel = document.getElementById('selected-rgb-label');
  if (hexLabel) {
    hexLabel.style.cursor = 'pointer';
    hexLabel.title = 'Click para copiar HEX';
    hexLabel.addEventListener('click', () =>
      copyToClipboard(hexLabel.textContent),
    );
  }
  if (rgbLabel) {
    rgbLabel.style.cursor = 'pointer';
    rgbLabel.title = 'Click para copiar RGB';
    rgbLabel.addEventListener('click', () =>
      copyToClipboard(rgbLabel.textContent),
    );
  }
}

// ─── createColorItemHTML ─────────────────────────────────────────────────────
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
                title="Click para copiar HEX: ${hexLabel}"
                data-hex="${hexLabel}">
            </div>
            <span class="color-component__color-format ${hiddenClass}"
                title="Click para copiar RGB: ${rgbLabel}"
                data-rgb="${rgbLabel}">${rgbLabel}</span>
        </div>
    `;
};

// ─── renderColorPallete ───────────────────────────────────────────────────────
export function renderColorPallete(colorPalette, containers = {}) {
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
    addCopyListeners(selected);

    const selectedHexFormatLabel =
      document.getElementById('selected-hex-label');
    const selectedRgbFormatLabel =
      document.getElementById('selected-rgb-label');
    if (selectedHexFormatLabel) selectedHexFormatLabel.textContent = hex;
    if (selectedRgbFormatLabel) selectedRgbFormatLabel.textContent = rgb;
  }

  if (similar) {
    const nextThreeColors = colorPalette.slice(1, 4);
    similar.innerHTML = nextThreeColors
      .map(({ hex, rgb }) => createColorItemHTML(hex, rgb))
      .join('');
    addCopyListeners(similar);
  }

  if (complementary) {
    const lastColor = colorPalette.at(-1);
    const { hex, rgb } = lastColor;
    complementary.innerHTML = createColorItemHTML(hex, rgb);
    addCopyListeners(complementary);
  }
}
