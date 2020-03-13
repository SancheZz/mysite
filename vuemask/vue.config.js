const publicPath = process.env.NODE_ENV === 'production'
  ? '/vuemask'
  : '/';

module.exports = {
  publicPath,
};
