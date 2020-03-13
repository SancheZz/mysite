import Vue from 'vue';
import Router from 'vue-router';
import auth from './auth';
import graph from './graph';
import stats from './stats';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    auth,
    graph,
    stats,
  ],
});

router.beforeEach(function (to, from, next) {
  const nextPath = process.env.NODE_ENV === 'production'
    ? '/likes/auth'
    : '/auth';

  if (!to.matched.length) {
    next(nextPath);
  } else {
    next();
  }
});

export default router;

export {
  auth,
  graph,
  stats,
};
