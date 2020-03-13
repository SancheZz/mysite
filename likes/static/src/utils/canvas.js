const KOEF_TEXT = 1.2;

/**
 * createBufferContext
 * create canvas with given width and height and return its context
 *
 * @param  {String | Number} width
 * @param  {String | Number} height
 * @return {CanvasRenderingContext2D}
 */
export function createBufferContext(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  return canvas.getContext('2d');
}


/**
 * calculateFontSize
 * return max font size of given text, which places in single line
 * in given canvas context
 *
 * @param  {CanvasRenderingContext2D} context
 * @param  {Number} currentFontSize
 * @param  {String} text
 * @return {Object}
 */
export function calculateFontSize(context, currentFontSize = 1, text = 'Like') {
  const { width, height } = context.canvas;
  context.font = `${currentFontSize}px Helvetica, Arial, sans-serif`;
  const textWidth = context.measureText(text).width;

  if (
    currentFontSize * KOEF_TEXT > width
    || currentFontSize * KOEF_TEXT > height
  ) {
    return {
      width: textWidth,
      fontSize: currentFontSize,
    };
  }

  return calculateFontSize(currentFontSize + 2, text);
}
