import EventTarget from '@/classes/EventTarget';

const userIdSymbol = Symbol('userId');
const likesSymbol = Symbol('likes');
const statusSymbol = Symbol('status');
const sizeSymbol = Symbol('size');
const readyStateSymbol = Symbol('ready');
const imageSymbol = Symbol('image');

export default class Shape extends EventTarget {
  constructor(userId, imageURL) {
    super();

    this[userIdSymbol] = userId;
    this[likesSymbol] = 0;
    this[sizeSymbol] = 1;
    this[statusSymbol] = 'unset';
    this[readyStateSymbol] = 'loading';

    const image = new Image();
    image.src = imageURL;
    image.addEventListener('load', () => {
      this[imageSymbol] = image;
      this[readyStateSymbol] = 'loaded';
      this.emit('load');
    }, false);
  }

  get userId() {
    return this[userIdSymbol];
  }

  get likes() {
    return this[likesSymbol];
  }

  set likes(value) {
    if (value !== this[likesSymbol]) {
      this[likesSymbol] = value;
      this[statusSymbol] = 'increment';
    }
  }

  get size() {
    switch (true) {
      case this[sizeSymbol] < 2 && this[statusSymbol] === 'increment':
        this[sizeSymbol] += 0.1;
        break;

      case this[sizeSymbol] >= 2 && this[statusSymbol] === 'increment':
        this[statusSymbol] = 'decrement';
        break;

      case this[sizeSymbol] > 1 && this[statusSymbol] === 'decrement':
        this[sizeSymbol] -= 0.1;
        break;

      default:
        this[statusSymbol] = 'unset';
    }

    return this[sizeSymbol];
  }

  get readyState() {
    return this[readyStateSymbol];
  }

  get image() {
    return this[imageSymbol];
  }
}
