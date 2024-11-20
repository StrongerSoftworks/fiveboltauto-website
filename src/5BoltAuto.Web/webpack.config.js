const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');

const isDebugMode = process.env.buildMode === 'Debug';

console.log(`isDebugMode: ${isDebugMode}`);

module.exports = [
    // Vendor JS
    {
        mode: isDebugMode ? 'development' : 'production',
        entry: {
            AOS: 'aos',
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'wwwroot/bundle/vendor/js'),
            publicPath: '/',
            library: '[name]',
            libraryTarget: 'var'
        },
        plugins: [
            new HtmlWebpackPlugin({
                inject: false,
                template: './WebpackTemplates/Scripts.ejs',
                filename: path.join(__dirname, "./Components/Webpack/VendorScripts.razor"),
                hash: true,
                minify: !isDebugMode,
                templateParameters: (compilation, assets) => {
                    const scripts = assets.js.map((filePath) => `<script src="/bundle/vendor/js${filePath}"></script>`).join("\n");
                    return { scripts };
                },
            }),
        ],
        devtool: isDebugMode ? 'source-map' : false,
    },
    // Vendor CSS
    {
        stats: {warnings:false},
        mode: isDebugMode ? 'development' : 'production',
        entry: {
            aos: './node_modules/aos/dist/aos.css'
        },
        output: {
            path: path.resolve(__dirname, 'wwwroot/bundle/vendor/css'),
            publicPath: '/',
        },
        resolve: {
            extensions: ['.scss'],
            preferRelative: true,
        },
        module: {
            rules: [
                {
                    test: /\.s?css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            }
                        },
                    ]
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                inject: false,
                template: './WebpackTemplates/StyleSheets.ejs',
                filename: path.join(__dirname, "./Components/Webpack/VendorStylesSheets.razor"),
                hash: true,
                minify: !isDebugMode,
                templateParameters: (compilation, assets) => {
                    const styleSheets = assets.css.map((filePath) => `<link rel="stylesheet" href="/bundle/vendor/css${filePath}" />`).join("\n");
                    return { styleSheets };
                },
            }),
            new MiniCssExtractPlugin({
                filename: "[name].css",
                chunkFilename: "[id].css",
            }),
            isDebugMode ? false : new PurgeCSSPlugin({
                paths: glob.sync(`${path.join(__dirname, '../')}/**/*.{razor,cs,js}`, { ignore: ['**/node_modules/**'], noDir: true }),
                skippedContentGlobs: ['node_modules']
            }),
        ],
        devtool: isDebugMode ? 'source-map' : false,
    },
    // JS
    {
        mode: isDebugMode ? 'development' : 'production',
        entry: {
            bootstrap: './assets/js/bootstrap-custom.js',
            app: './assets/js/main.js',
            validate: './assets/js/validate.js',
        },
        output: {
            path: path.resolve(__dirname, 'wwwroot/bundle/js'),
            publicPath: '/',
            library: '[name]',
            libraryTarget: 'var'
        },
        resolve: {
            extensions: ['.js'],
            preferRelative: true,
        },
        module: {
            rules: [

            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                inject: false,
                template: './WebpackTemplates/Scripts.ejs',
                filename: path.join(__dirname, "./Components/Webpack/Scripts.razor"),
                hash: true,
                minify: !isDebugMode,
                templateParameters: (compilation, assets) => {
                    const scripts = assets.js.map((filePath) => `<script src="/bundle/js${filePath}"></script>`).join("\n");
                    return { scripts };
                },
            }),
        ],
        devtool: isDebugMode ? 'source-map' : false,
    },
    // CSS
    {
        stats: {warnings:false},
        mode: isDebugMode ? 'development' : 'production',
        entry: {
            bootstrap: './assets/scss/bootstrap-custom.scss',
            fonts: './assets/scss/fonts.scss',
            theme: './assets/scss/theme.scss',
        },
        output: {
            path: path.resolve(__dirname, 'wwwroot/bundle/css'),
            publicPath: '/',
        },
        resolve: {
            extensions: ['.scss'],
            preferRelative: true,
        },
        module: {
            rules: [
                {
                    test: /\.s?css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                esModule: false,
                                url: {
                                    // ignore images
                                    filter: (url, resourcePath) => {
                                        if (url.includes(".png") || url.includes(".jpg") || url.includes(".svg") || url.includes(".avif")) {
                                            return false;
                                        }
                                        return true;
                                    },
                                },
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            }
                        },

                    ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            publicPath: '../fonts',
                            outputPath: '../fonts',
                            name: '[name].[ext]',
                            //esModule: false
                        }
                    }],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                inject: false,
                template: './WebpackTemplates/StyleSheets.ejs',
                filename: path.join(__dirname, "./Components/Webpack/StylesSheets.razor"),
                hash: true,
                minify: !isDebugMode,
                templateParameters: (compilation, assets) => {
                    const styleSheets = assets.css.map((filePath) => `<link rel="stylesheet" href="/bundle/css${filePath}" />`).join("\n");
                    return { styleSheets };
                },
            }),
            new MiniCssExtractPlugin({
                filename: "[name].css",
                chunkFilename: "[id].css",
            }),
            isDebugMode ? false : new PurgeCSSPlugin({
                paths: glob.sync(`${path.join(__dirname, '../')}/**/*.{razor,cs,js}`, { ignore: ['**/node_modules/**'], noDir: true }),
                skippedContentGlobs: ['node_modules']
            }),
        ],
        devtool: isDebugMode ? 'source-map' : false,
    }
];
