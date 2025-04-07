const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const glob = require('glob');

const entries = {};
const tsFiles = glob.sync('./src/**/*.ts');
tsFiles.forEach(file => {
  const entryName = file.replace('src/', '').replace('.ts', '');
  entries[entryName] = path.resolve(__dirname, file);
});

module.exports = {
  mode: "production",

  devtool: process.argv.mode === 'development' ? 'inline-source-map' : undefined,

  entry: entries,

  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    assetModuleFilename: 'assets/[hash][ext][query]',
  },

  resolve: {
    extensions: [".ts", ".js"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.svg/,
        type: 'asset/inline',
      }
    ]
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: '**/*',
          to: '[path][name][ext]',
          context: 'src/',
          globOptions: {
            ignore: ['**/*.ts', '**/*.svg']
          }
        }
      ]
    }),
  ]
};