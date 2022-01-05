module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: true,
        },
      },
    ],
  ],
  plugins: [
    [
      'babel-plugin-root-import',
      {
        rootPathSuffix: 'build/',
        rootPathPrefix: '@',
      },
    ],
  ],
};
