const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev;
console.log('IS DEV: ', isDev);


const optimization = () => {
    const config = {};

    config.splitChunks = {
        chunks: "all",
    }

    if (isProd) {
        config.minimizer = [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config;
};


module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        index: '/ts/app/app.ts',
        roadmap: '/ts/roadmap.ts',
        addfeedback: '/ts/feedback-add/feedback-add.ts',
        feedbackDetail: '/ts/feedback-detail/feedback-detail.ts',
        feedbackEdit: '/ts/feedback-edit.ts'
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        // assetModuleFilename: 'assets/'
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    optimization: optimization(),

    devServer: {
        port: 3100,
        hot: isDev
    },
    devtool: isDev ? 'source-map' : false,
    plugins: [
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './index.html',
            chunks: ['index'],
        }),
        new HTMLWebpackPlugin({
            filename: 'addfeedback.html',
            template: './addfeedback.html',
            chunks: ['addfeedback'],
        }),
        new HTMLWebpackPlugin({
            filename: 'roadmap.html',
            template: './roadmap.html',
            chunks: ['roadmap'],
        }),
        new HTMLWebpackPlugin({
            filename: 'feedback-detail.html',
            template: './feedback-detail.html',
            chunks: ['feedbackDetail'],
        }),
        new HTMLWebpackPlugin({
            filename: 'feedback-edit.html',
            template: './feedback-edit.html',
            chunks: ['feedbackEdit'],
        }),

        new HtmlWebpackInlineSVGPlugin(),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].bundle.css'
        })
    ],
    module: {
        rules: [
            //TYPESCRIPT
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
            },

            //    CSS
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },

            //SCSS
            {
                test: /\.s[ac]ss$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'resolve-url-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    },

                ]
            },

            //IMAGES
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[name].[ext]'
                }

            },

            //FONTS
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[name].[ext]'
                }
            },

            // LOAD IMAGES ON HTML
            {
                test: /\.html$/,
                loader: 'html-loader',
            },

            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    }
}