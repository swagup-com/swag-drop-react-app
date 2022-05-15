/* eslint-disable no-nested-ternary */
/* eslint-disable no-bitwise */
const changeColorLightness = (color, percent = -20) => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const B = ((num >> 8) & 0x00ff) + amt;
  const G = (num & 0x0000ff) + amt;

  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
    (G < 255 ? (G < 1 ? 0 : G) : 255)
  )
    .toString(16)
    .slice(1)}`;
};

const isLightColor = color => {
  // color in HEX
  if (!color) return false;
  const colorHex = color.toUpperCase().replace('#', '');
  const colorRGB = +`0x${colorHex.replace(colorHex.length < 5 && /./g, '$&$&')}`;

  const R = colorRGB >> 16;
  const G = (colorRGB >> 8) & 255;
  const B = colorRGB & 255;

  const hsp = Math.sqrt(0.299 * (R * R) + 0.587 * (G * G) + 0.114 * (B * B));

  // Using the HSP value, determine whether the color is light
  return hsp > 220;
};

const isHexColor = color => {
  if (!color) return false;
  return /^#?([0-9A-F]{6}|[0-9A-F]{3})$/i.test(color);
};

export { changeColorLightness, isLightColor, isHexColor };
