import { describe, it, expect, beforeEach, vi } from 'vitest';
import { onPickedColor } from '../../src/js/controller.js';

describe('controller.js: onPickedColor', () => {
    beforeEach(() => {
        global.EyeDropper = class {
            open() {
                return Promise.resolve({ sRGBHex: '#FF5733' });
            }
        };
    });

    it('should return the full color palette when EyeDropper picks a color', async () => {
        const palette = await onPickedColor();

        expect(palette).toHaveLength(5);
        expect(palette[0]).toMatchObject({ hex: '#FF5733', label: 'selected' });
        expect(palette[4]).toMatchObject({ label: 'complementary' });
    });

    it('should return null and log an error if EyeDropper is cancelled', async () => {
        vi.spyOn(global.EyeDropper.prototype, 'open').mockRejectedValue(
            new Error('User cancelled'),
        );
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        const color = await onPickedColor();

        expect(color).toBeNull();
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should throw if EyeDropper API is not supported', async () => {
        delete global.EyeDropper;

        await expect(() => onPickedColor()).rejects.toThrow(
            'EyeDropper API no es compatible con este navegador.',
        );
    });
});
