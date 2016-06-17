var webpack = require('webpack');

module.exports = {
  entry: './wsclient',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  output: {
    filename: 'dist/js/client.min.js',
    libraryTarget: 'umd',
    library: 'WebRTC'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
     compressor: {
       warnings: false
     }
   })
  ]
};
