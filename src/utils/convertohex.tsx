// colorConverter.ts

/**
 * Converts RGB or HSL color format to HEX.
 *
 * @param color - An object representing the color. It can be:
 *   - For RGB: `{ r: number, g: number, b: number }`
 *   - For HSL: `{ h: number, s: number, l: number }`
 * @returns HEX color string (e.g., "#FFFFFF")
 */
const colorToHex = (color: {
  r?: number;
  g?: number;
  b?: number;
  h?: number;
  s?: number;
  l?: number;
}): string => {
  if (color.r !== undefined && color.g !== undefined && color.b !== undefined) {
    const toHex = (value: number) => value.toString(16).padStart(2, "0");
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`.toUpperCase();
  } else if (
    color.h !== undefined &&
    color.s !== undefined &&
    color.l !== undefined
  ) {
    // HSL to HEX
    const hslToRgb = (
      h: number,
      s: number,
      l: number
    ): [number, number, number] => {
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l - c / 2;
      let [r, g, b] = [0, 0, 0];

      if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
      else if (h >= 60 && h < 120) [r, g, b] = [x, c, 0];
      else if (h >= 120 && h < 180) [r, g, b] = [0, c, x];
      else if (h >= 180 && h < 240) [r, g, b] = [0, x, c];
      else if (h >= 240 && h < 300) [r, g, b] = [x, 0, c];
      else if (h >= 300 && h < 360) [r, g, b] = [c, 0, x];

      return [
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255),
      ];
    };

    const [r, g, b] = hslToRgb(color.h, color.s, color.l);
    return colorToHex({ r, g, b });
  } else {
    throw new Error("Invalid color format provided");
  }
};

export default colorToHex;
