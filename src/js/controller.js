import { generateFullPallete } from './colorModel';

export async function onPickedColor() {
    if (!window.EyeDropper) {
        throw new Error('EyeDropper API no es compatible con este navegador.');
    }

    try {
        const eyeDropper = new EyeDropper();
        const result = await eyeDropper.open();

        const hexFormat = result.sRGBHex;
        return generateFullPallete(hexFormat);

    } catch (error) {
        // Se lanza si el usuario presiona ESC o cancela
        console.error('Selección cancelada o error:', error);
        return null;
    }



}
