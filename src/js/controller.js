import {
  generateFullPallete,
  saveColorToStorage,
  getColorFromStorage,
} from './colorModel.js';

export async function onPickedColor() {
  if (!window.EyeDropper) {
    throw new Error('EyeDropper API no es compatible con este navegador.');
  }

  try {
    const eyeDropper = new EyeDropper();
    const result = await eyeDropper.open();

    const hexFormat = result.sRGBHex;
    saveColorToStorage(hexFormat);
    return generateFullPallete(hexFormat);
  } catch (error) {
    console.error('Selección cancelada o error:', error);
    return null;
  }
}

/**
 * Loads the last picked color from chrome.storage and returns the palette.
 * Returns null if no color has been saved yet.
 */
export async function loadSavedColor() {
  const hexFormat = await getColorFromStorage();
  if (!hexFormat) return null;
  return generateFullPallete(hexFormat);
}
