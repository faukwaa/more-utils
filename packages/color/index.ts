/*
获取颜色的 RGB 值,0-255
*/
export function colorRgb(colorHex: string) {
  if (colorHex.indexOf('#') === 0)
    colorHex = colorHex.slice(1)

  // convert 3-digit hex to 6-digits.
  if (colorHex.length === 3)
    colorHex = colorHex[0] + colorHex[0] + colorHex[1] + colorHex[1] + colorHex[2] + colorHex[2]

  if (colorHex.length !== 6)
    throw new Error('Invalid HEX color.')

  const r: number = Number.parseInt(colorHex.slice(0, 2), 16)
  const g: number = Number.parseInt(colorHex.slice(2, 4), 16)
  const b: number = Number.parseInt(colorHex.slice(4, 6), 16)

  return {
    r,
    g,
    b,
  }
}

/*
获取颜色的灰度值，大于 186 时为亮色，小于等于 186 时为暗色
*/
export function grayValue(colorHex: string) {
  const rgb = colorRgb(colorHex)
  return rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114
}

/*
生成背景色上的文字色
*/
export function colorOnBg(colorHex: string) {
  const gray = grayValue(colorHex)
  return gray > 186 ? '#000000' : '#FFFFFF'
}

/**
 * @description: 颜色反转
 * @export
 * @param {string} colorHex 颜色值
 * @param {boolean} [bw] 是否黑白，反转的时候是否直接转黑或白
 */
export function reserveColor(colorHex: string, bw?: boolean) {
  const rgb = colorRgb(colorHex)

  if (bw)
    return colorOnBg(colorHex)

  const r = (255 - rgb.r).toString(16).padStart(2, '0')
  const g = (255 - rgb.g).toString(16).padStart(2, '0')
  const b = (255 - rgb.b).toString(16).padStart(2, '0')

  return `#${r}${g}${b}`
}

/**
 * Calculates the middle color between two given colors.
 * rgb 减得负数时，abs 取绝对值，reserve 取 255 减去绝对值
 *
 * @param {string} colorHex - The hexadecimal color value of the first color.
 * @param {'abs' | 'reserve'} [type] - The type of calculation to perform. Defaults to 'abs'.
 * @returns {string} The hexadecimal color value of the middle color.
 */
export function middleColor(colorHex: string, type: 'abs' | 'reserve' = 'abs') {
  const reserveColorHex = reserveColor(colorHex)
  const rgb = colorRgb(colorHex)
  const reserveRgb = colorRgb(reserveColorHex)

  if (type === 'abs') {
    const r = Math.abs(rgb.r - reserveRgb.r).toString(16).padStart(2, '0')
    const g = Math.abs(rgb.g - reserveRgb.g).toString(16).padStart(2, '0')
    const b = Math.abs(rgb.b - reserveRgb.b).toString(16).padStart(2, '0')

    return `#${r}${g}${b}`
  }
  else {
    const r = (rgb.r - reserveRgb.r >= 0 ? rgb.r - reserveRgb.r : 255 + (rgb.r - reserveRgb.r)).toString(16).padStart(2, '0')
    const g = (rgb.g - reserveRgb.g >= 0 ? rgb.g - reserveRgb.g : 255 + (rgb.g - reserveRgb.g)).toString(16).padStart(2, '0')
    const b = (rgb.b - reserveRgb.b >= 0 ? rgb.b - reserveRgb.b : 255 + (rgb.b - reserveRgb.b)).toString(16).padStart(2, '0')

    return `#${r}${g}${b}`
  }
}
