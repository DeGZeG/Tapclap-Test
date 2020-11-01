const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

const buildWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: baseWebpackConfig.externals.paths.dist,
        port: 3001,
        overlay: true,
        historyApiFallback: true,
        hot: true,
        proxy: {
            '/api': {
                target: 'http://localhost:5000'
            },
        }
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map'
        })
    ]
});

module.exports = new Promise((resolve => {
    resolve(buildWebpackConfig)
}));

