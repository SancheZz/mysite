const EventTarget = require('./EventTarget');
const usersSymbol = Symbol('users');

module.exports = class UsersCollection extends EventTarget {
  constructor() {
    super();
    this[usersSymbol] = [];
  }

  add(user) {
    const conditionExistence = this[usersSymbol]
      .some(({ user_id }) => user_id === user.user_id);

    if (conditionExistence) {
      return;
    }

    for (const eventType of ['post', 'photo']) {
      user.on(eventType, event => this.emit(eventType, event));
    }
  }
};
