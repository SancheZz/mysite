const VK = require('vk-io').VK;
const EventTarget = require('./EventTarget');
const userSymbol = Symbol('user');
const postsSymbol = Symbol('posts');
const photosSymbol = Symbol('photos');

module.exports = class VkUser extends EventTarget {
  constructor(accessToken, user) {
    super();

    this.accessToken = accessToken;
    this[userSymbol] = user;
    this[postsSymbol] = new Map();
    this[photosSymbol] = new Map();
    this.load();
  }

  get posts() {
    return this[postsSymbol];
  }

  get photos() {
    return this[photosSymbol];
  }

  async load() {
    const userId = this[userSymbol].user_id;
    const accessToken = this.accessToken;
    const vk = new VK({
      token: accessToken,
    });

    async function getLikedUsers(type, item) {
      if (item.likes.count) {
        const likesResponse = await vk.api.likes.getList({
          owner_id: userId,
          item_id: item.id,
          type,
        });
        const usersResponse = await vk.api.users.get({
          user_ids: likesResponse.items.join(','),
          fields: ['photo_50'].join(','),
        });

        return usersResponse;
      }

      return [];
    }

    // posts
    const postsResponse = await vk.api.wall.get({
  		owner_id: userId,
  	});

    for (const post of postsResponse.items) {
      const users = await getLikedUsers('post', post);

      this[postsSymbol].set(post, users);
      this.emit('post', {
        type: 'post',
        accessToken,
        post,
        users,
      });
    }

    // photos
    const photosResponse = await vk.api.photos.getAll({
      owner_id: userId,
      extended: 1,
    });

    for (const photo of photosResponse.items) {
      const users = await getLikedUsers('photo', photo);

      this[photosSymbol].set(photo, users);
      this.emit('photo', {
        type: 'photo',
        accessToken,
        photo,
        users,
      });
    }
  }
};
