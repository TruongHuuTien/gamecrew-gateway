var path = require('path');

module.exports = {
  entry: './src/app.js',
  output: {
      filename: 'app.js',
      path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  watch: true
};
