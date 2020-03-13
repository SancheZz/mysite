/**
 * createFuncCounter
 * create wrapped function for call original function not more than given count
 *
 * @return {Function}  wrapped function
 */
const createFuncCounter = (function () {
  const funcs = new WeakMap();
  const counter = new WeakMap();
  const timeouts = new WeakMap();

  /**
   * create singleton
   *
   * @param  {Function} func  function will be wrapped
   * @param  {Number}   count of calls per second
   * @return {Function}       wrapped function
   */
  return function (func, count) {
    if (!funcs.has(func)) {
      funcs.set(func, count);
      counter.set(func, 0);
    }

    /**
     * wrapped function
     *
     * @param  {Array} ...args arguments
     * @return {*}
     */
    return function (...args) {
      /**
       * setToZero
       * remove id of timeout for given function
       */
      function setToZero() {
        if (counter.has(func)) {
          counter.set(func, 0);
          timeouts.delete(func);
        }
      }

      if (!timeouts.has(func)) {
        timeouts.set(func, setTimeout(setToZero, 1000));
      }

      if (counter.has(func)) {
        counter.set(func, counter.get(func) + 1);
      }

      if (counter.get(func) <= funcs.get(func)) {
        return func.apply(this, args);
      }
    };
  };
})();

export default createFuncCounter;
