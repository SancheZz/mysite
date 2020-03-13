console.log(process.env.NODE_ENV);
const publicPath = process.env.NODE_ENV === 'production'
  ? '/likes'
  : '/';

module.exports = {
  publicPath,

  devServer: {
    proxy: {
      '/likes/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        pathRewrite: {
          '^/likes/api': ''
        },
        ws: true,
      },
    }
  }
}
