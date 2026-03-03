export function hexToRgb(hexFormat) {
    if (!hexFormat) return null;
    if (hexFormat.includes('#')) hexFormat = hexFormat.replace('#', '');
    if (hexFormat.length < 3 || hexFormat.length > 6) return null;

    if (hexFormat.length === 3) {
        hexFormat = hexFormat
            .split('')
            .map((char) => char + char)
            .join('');
    }

    const bigint = parseInt(hexFormat, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
}

/**
 * Public: hex string in → hex string out (complementary, 180° hue rotation)
 * @param {string} hexFormat - e.g. "#FF5733"
 * @returns {string|null}
 */
export function calculateComplementaryColor(hexFormat) {
    if (!hexFormat) return null;
    const rgb = hexToRgb(hexFormat);
    if (!rgb) return null;

    const { h, s, l } = rgbToHsl(rgb.r / 255, rgb.g / 255, rgb.b / 255);
    const comp = complementaryRgb255(h, s, l);
    return rgbToHex(comp.r, comp.g, comp.b);
}

/**
 * Public: hex string in → array of 3 analogous hex strings
 * @param {string} hexFormat - e.g. "#FF5733"
 * @returns {string[]|null}
 */
export function calculateSimilarColors(hexFormat) {
    if (!hexFormat) return null;
    const rgb = hexToRgb(hexFormat);
    if (!rgb) return null;

    const { h, s, l } = rgbToHsl(rgb.r / 255, rgb.g / 255, rgb.b / 255);
    return similarRgb255Arr(h, s, l).map((c) => rgbToHex(c.r, c.g, c.b));
}

// ─── Private Helpers ──────────────────────────────────────────────────────────

/** RGB (0-1) → HSL */
function rgbToHsl(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let h = 0,
        s = 0,
        l = (max + min) / 2;

    if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1));
        switch (max) {
            case r:
                h = 60 * (((g - b) / delta) % 6);
                break;
            case g:
                h = 60 * ((b - r) / delta + 2);
                break;
            case b:
                h = 60 * ((r - g) / delta + 4);
                break;
        }
    }
    if (h < 0) h += 360;
    return { h, s, l };
}

/** HSL → RGB (0-1) */
function hslToRgb(h, s, l) {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0,
        g = 0,
        b = 0;

    if (h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h < 300) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }

    return { r: r + m, g: g + m, b: b + m };
}

/** 0-255 channels → '#RRGGBB' */
function rgbToHex(r, g, b) {
    const toHex = (n) => n.toString(16).padStart(2, '0').toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Returns complementary color as {r,g,b} (0-255), given HSL */
function complementaryRgb255(h, s, l) {
    const rotatedH = (h + 180) % 360;
    const rgb01 = hslToRgb(rotatedH, s, l);
    return {
        r: Math.round(rgb01.r * 255),
        g: Math.round(rgb01.g * 255),
        b: Math.round(rgb01.b * 255),
    };
}

/** Returns 3 analogous colors as [{r,g,b}] (0-255), given HSL */
function similarRgb255Arr(h, s, l) {
    const angles = [-30, -15, 30];
    return angles.map((angle) => {
        let newHue = (h + angle) % 360;
        if (newHue < 0) newHue += 360;
        const rgb01 = hslToRgb(newHue, s, l);
        return {
            r: Math.round(rgb01.r * 255),
            g: Math.round(rgb01.g * 255),
            b: Math.round(rgb01.b * 255),
        };
    });
}

// ─── Storage ──────────────────────────────────────────────────────────────────

export function saveColorToStorage(color) {
    chrome.storage.local.set({ colorPalette: color });
}

export function getColorFromStorage() {
    return new Promise((resolve) => {
        chrome.storage.local.get('colorPalette', (result) => {
            resolve(result.colorPalette);
        });
    });
}

// ─── Palette Orchestrator ─────────────────────────────────────────────────────

/**
 * Builds the full 5-color atomic palette from a base hex string.
 * @param {string} hexFormat - e.g. "#FF5733"
 * @returns {{ hex: string, rgb: string, label: string }[]}
 */
export function generateFullPallete(hexFormat) {
    const { r, g, b } = hexToRgb(hexFormat);
    const { h, s, l } = rgbToHsl(r / 255, g / 255, b / 255);

    const similarArr = similarRgb255Arr(h, s, l);
    const comp = complementaryRgb255(h, s, l);

    const s0 = similarArr[0];
    const s1 = similarArr[1];
    const s2 = similarArr[2];

    return [
        { hex: hexFormat, rgb: `rgb(${r}, ${g}, ${b})`, label: 'selected' },
        { hex: rgbToHex(s0.r, s0.g, s0.b), rgb: `rgb(${s0.r}, ${s0.g}, ${s0.b})`, label: 'similar' },
        { hex: rgbToHex(s1.r, s1.g, s1.b), rgb: `rgb(${s1.r}, ${s1.g}, ${s1.b})`, label: 'similar' },
        { hex: rgbToHex(s2.r, s2.g, s2.b), rgb: `rgb(${s2.r}, ${s2.g}, ${s2.b})`, label: 'similar' },
        { hex: rgbToHex(comp.r, comp.g, comp.b), rgb: `rgb(${comp.r}, ${comp.g}, ${comp.b})`, label: 'complementary' },
    ];
}
