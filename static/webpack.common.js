//const webpack = require('webpack');
//const resolve = require('path').resolve;

const config = {
    entry: __dirname + '/js/script.js',
    output:{
        path: __dirname + '/dist',
        filename: 'bundle.js',
    },
        resolve: {
        extensions: ['.js','.jsx','.css']
    },
    module: {
        rules: [{
            test: /\.jsx?/,
            loader: 'babel-loader',
            exclude: /node_modules/,
        }]
    }
};
module.exports = config;