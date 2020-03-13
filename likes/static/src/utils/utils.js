/**
 * getRandomInt
 * return random integer in range
 *
 * @param  {Number} min
 * @param  {Number} max
 * @return {Number}
 */
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * makeMods
 * build tag classes by base and modificators
 *
 * @param  {String} base base class
 * @param  {Array}  mods modificators
 * @return {Array}       classes
 */
export function makeMods(base, mods) {
  return mods.map(mod => `${base}--${mod}`)
    .concat(base);
}
