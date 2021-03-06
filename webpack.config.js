/**
 * Created by logov on 28-Feb-17.
 */

const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleTracker = require('webpack-bundle-tracker');

const BUNDLES = {
    base: './app/static/base',
    baseStyle: './app/static/base/style',
};

module.exports = env => {

    if (!env) env = {};

    const devConfig = {
        devtool: 'source-map',
        plugins: [
            new webpack.DefinePlugin({'process.env': JSON.stringify(env)}),
            new BundleTracker({filename: path.join(__dirname, 'webpack-stats.json')}),
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.less$/,
                    use: ['style-loader', 'css-loader', 'less-loader']
                },
                {
                    test: /\.(sass|scss)$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                },
                {
                    test: /\.(html)$/,
                    use: 'raw-loader',
                },
                {
                    test: /\.(jpg|png|eot|svg|ttf|woff|woff2)$/,
                    use: [{loader: 'file-loader', query: {name: '[name].[ext]'}}]
                }
            ]
        }
    };

    const prodConfig = {
        plugins: [
            new webpack.DefinePlugin({
                'process.env': env
            }),
            new UglifyJsPlugin(),
            new BundleTracker({filename: path.join(__dirname, 'webpack-stats.json')}),
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader', {
                        loader: 'css-loader',
                        options: {minimize: true}
                    }]
                },
                {
                    test: /\.less$/,
                    use: ['style-loader', {
                        loader: 'css-loader',
                        options: {minimize: true}
                    }, 'less-loader']
                },
                {
                    test: /\.(sass|scss)$/,
                    use: ['style-loader', {
                        loader: 'css-loader',
                        options: {minimize: true}
                    }, 'sass-loader']
                },
                {
                    test: /\.(html)$/,
                    use: [
                        'raw-loader',
                        'html-minify-loader'
                    ]
                },
                {
                    test: /\.(jpg|png|eot|svg|ttf|woff|woff2)$/,
                    use: [{loader: 'file-loader', query: {name: '[name].[ext]'}}]
                }
            ]
        }
    };

    const config = {
        entry: BUNDLES,
        output: {
            path: path.join(__dirname, 'app/var/static'),
            publicPath: '/static/',
            filename: `[name]${env.prod ? '-[hash]' : ''}.js`
        }
    };

    let resultConfig;

    resultConfig = Object.assign({}, config, env.prod ? prodConfig : devConfig);

    return resultConfig;
};
