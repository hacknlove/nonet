module.exports = {
  async rewrites() {
    return [
      {
        source: '/WSW.json',
        destination: '/api/WSW',
      },
      {
        source: '/miniature.json',
        destination: '/api/miniature',
      },
      {
        source: '/:slug*/miniature.json',
        destination: '/api/:slug*/miniature',
      },
    ];
  },
};
