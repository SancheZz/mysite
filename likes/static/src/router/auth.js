import AuthUser from '@/parts/AuthUser/AuthUser';
import store from '@/store';
import { graph } from './';

export default {
  path: process.env.NODE_ENV === 'production'
    ? '/likes/auth'
    : '/auth',
  components: {
    content: AuthUser,
  },

  beforeEnter(to, from, next) {
    const { token } = store.getters.user;

    if (token) {
      next(graph.path);
    } else {
      next();
    }
  },
};
