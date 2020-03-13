import UserHeader from '@/parts/UserHeader/UserHeader';
import UsersStat from '@/parts/UsersStat/UsersStat';
import store from '@/store';
import { auth } from './';

export default {
  path: process.env.NODE_ENV === 'production'
    ? '/likes/stats'
    : '/stats',
  components: {
    header: UserHeader,
    content: UsersStat,
  },
  props: {
    header: {
      type: 'stats',
    },
  },

  beforeEnter(to, from, next) {
    const { token } = store.getters.user;

    if (token) {
      next();
    } else {
      next(auth.path);
    }
  },
};
