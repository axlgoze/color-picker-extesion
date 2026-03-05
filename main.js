import { initEvents, renderColorPallete } from './src/js/popupView.js';
import { loadSavedColor } from './src/js/controller.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Restore the last picked color before wiring the button
  const savedPalette = await loadSavedColor();
  if (savedPalette) {
    const containers = {
      selected: document.getElementById('selected-color'),
      similar: document.getElementById('similar-colors'),
      complementary: document.getElementById('complementary-color'),
    };
    renderColorPallete(savedPalette, containers);
  }

  initEvents();
});
