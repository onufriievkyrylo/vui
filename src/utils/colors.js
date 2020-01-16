export const hexToRgb = hex => {
  const bigint = Number.parseInt(hex, 16)
  const red = (bigint >> 16) & 255
  const green = (bigint >> 8) & 255
  const blue = bigint & 255
  return { red, green, blue }
}

export const hexToHsl = hex => {
  const { red, green, blue } = hexToRgb(hex)
  console.log(red, green, blue)
  const rgb = { red: red / 255, green: green / 255, blue: blue / 255 }
  const max = Math.max(rgb.red, rgb.green, rgb.blue)
  const min = Math.min(rgb.red, rgb.green, rgb.blue)
  const hsl = { hue: 0, saturation: 0, lightness: (max + min) / 2 }
  if (max !== min) {
    const diff = max - min
    hsl.saturation = hsl.lightness > 0.5 ? diff / (2 - max - min) : diff / (max + min)
    if (max === rgb.red) hsl.hue = (rgb.green - rgb.blue) / diff + (rgb.green < rgb.blue ? 6 : 0)
    else if (max === rgb.green) hsl.hue = (rgb.blue - rgb.red) / diff + 2
    else if (max === rgb.blue) hsl.hue = (rgb.red - rgb.green) / diff + 4
    hsl.hue /= 6
  }
  hsl.hue *= 360
  hsl.saturation = `${hsl.saturation * 100}%`
  hsl.lightness = `${hsl.lightness * 100}%`
  console.log(hsl)
  return hsl
}
