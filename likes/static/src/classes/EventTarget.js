const listenersSymbol = Symbol('listeners');

export default class EventTarget {
  constructor() {
    this[listenersSymbol] = {};
  }

  on(type, func) {
    const listeners = this[listenersSymbol];
    if (!listeners[type]) {
      listeners[type] = new Set();
    }

    listeners[type].add(func);
  }

  off(type, func) {
    const listeners = this[listenersSymbol];
    if (listeners[type]) {
      listeners[type].delete(func);
    }
  }

  emit(type, value) {
    const listeners = this[listenersSymbol];
    if (listeners[type]) {
      for (const listener of listeners[type]) {
        listener.call(this, value);
      }
    }
  }
}
