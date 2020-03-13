import UserHeader from '@/parts/UserHeader/UserHeader';
import GraphShapes from '@/parts/GraphShapes/GraphShapes';
import store from '@/store';
import { auth } from './';

export default {
  path: process.env.NODE_ENV === 'production'
    ? '/likes/graph'
    : '/graph',
  components: {
    header: UserHeader,
    content: GraphShapes,
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
