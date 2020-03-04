const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: './js/app.ts',
    },
    output: {
        path: path.resolve('./mobile/www', 'js'),
        filename: '[name].js'
    },
    devtool: 'source-map',
    devServer: {
        contentBase: './mobile/www/js'
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    externals: { "jquery": "jQuery" },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    }
};