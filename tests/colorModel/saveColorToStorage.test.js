import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  saveColorToStorage,
  getColorFromStorage,
} from '../../src/js/colorModel.js';

describe('saveColorToStorage (chrome.storage)', () => {
  beforeEach(() => {
    let fakeStorage = {};

    global.chrome = {
      storage: {
        local: {
          set: vi.fn().mockImplementation((data) => {
            fakeStorage = { ...fakeStorage, ...data };
            return Promise.resolve();
          }),
          get: vi.fn().mockImplementation((key, callback) => {
            const result = { [key]: fakeStorage[key] };
            if (callback) {
              callback(result);
            }
            return Promise.resolve(result);
          }),
        },
      },
    };
  });

  it('should save the color palette in chrome.storage.local', async () => {
    const colorPalette = ['#FFFF00', '#0080FF', '#0000FF', '#8000FF'];

    await saveColorToStorage(colorPalette);

    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      colorPalette,
    });
  });

  it('should actually store the value', async () => {
    const colorPalette = ['#FFFF00', '#0080FF', '#0000FF', '#8000FF'];

    await saveColorToStorage(colorPalette);

    const result = await chrome.storage.local.get('colorPalette');

    expect(result.colorPalette).toStrictEqual(colorPalette);
  });

  it('should retrieve the value using getColorFromStorage', async () => {
    const colorPalette = ['#FFFF00', '#0080FF', '#0000FF', '#8000FF'];

    await saveColorToStorage(colorPalette);

    const result = await getColorFromStorage();

    expect(result).toStrictEqual(colorPalette);
  });
});
