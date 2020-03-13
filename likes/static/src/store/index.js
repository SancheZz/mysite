import Vue from 'vue';
import Vuex from 'vuex';
import { createVkData } from '@/store/plugins';
import { request } from '@/utils';

Vue.use(Vuex);

function createUser(state, user) {
  if (!state.users[user.id]) {
    Vue.set(state.users, user.id, {
      posts: [],
      photos: [],
      user,
    });
  }

  return state.users[user.id];
}

function addUserData(state, user, data) {
  const existenceUser = createUser(state, user);

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      existenceUser[key] = existenceUser[key].concat(value);
    }
  }

  return existenceUser;
}

export default new Vuex.Store({
  plugins: [createVkData],

  /**
   * State
   */
  state: {
    userId: undefined,
    accessToken: undefined,
    users: {},
  },

  /**
   * Getters
   */
  getters: {
    user(state) {
      return {
        id: state.userId,
        token: state.accessToken,
      };
    },
    likers(state) {
      return Object.values(state.users)
        .map(({ user, ...data }) => {
          const photosLikesCount = data.photos.length;
          const postsLikesCount = data.posts.length;

          return Object.assign({
            likes: photosLikesCount + postsLikesCount,
            postsLikesCount,
            photosLikesCount,
          }, user);
        });
    },
    likesCount(state) {
      return Object.values(state.users)
        .reduce((result, { photos, posts }) => {
          return result + photos.length + posts.length;
        }, 0);
    },
  },

  /**
   * Mutations
   */
  mutations: {
    setUser(state, { userId, accessToken }) {
      state.userId = userId;
      state.accessToken = accessToken;
    },
    setPhoto(state, { photo, user }) {
      addUserData(state, user, {
        photos: [photo],
      });
    },
    setPost(state, { post, user }) {
      addUserData(state, user, {
        posts: [post],
      });
    },
  },

  /**
   * Actions
   */
  actions: {
    async auth({ commit }, payload) {
      const userResponse = await request({
        path: '/likes/api/auth',
        params: payload,
      });
      const user = userResponse.response;

      commit('setUser', user);
      return user;
    },
  },
});
