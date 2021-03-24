const path = require('path');
 
module.exports = {
 entry: './index.ts',
 module: {
   rules: [
     {
       test: /\.ts$/,
       use: 'ts-loader',
       exclude: /node_modules/,
     }
   ]
 },
 resolve: {
    extensions: ['.tsx', '.ts', '.js'],
 },
 output: {
   path: path.resolve(__dirname, 'dist'),
   filename: 'index.ts',
   libraryTarget: 'umd',
   globalObject: 'this',
   library: '@airyhq/httpClient',
 },
};
