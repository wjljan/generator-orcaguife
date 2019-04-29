'use strict';

// A css post handler that will add vendor prefix for css files or compiled css files.
const autoprefixer = require('autoprefixer');
// An useful path tool.
const path = require('path');
// Enable more threads build, use process to emulate.
const HappyPack = require('happypack');
// Shared thread pool.
const happyThreadPool = HappyPack.ThreadPool({size: 8});
// Protagonist of the party.
const webpack = require('webpack');
// Create html file to serve the webpack bundles.
const HtmlWebpackPlugin = require('html-webpack-plugin');
// This is an extension plugin for the html-webpack-plugin that simplifies the creation of HTML
// files to serve your webpack bundles.
// const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
// Extract css modules in entry chunks into a separate css file, without inlined into JS bundle.
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// Will generate a manifest file for all resources.
const ManifestPlugin = require('webpack-manifest-plugin');
// Will work with html-webpack-plugin 2.x version to interpolate custom variables into
// the html file, and just think that it is a template resolve engine.
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
// For using service workers to cache your external project dependencies. It will generate
// a service worker file using sw-precache and add it to your build directory.
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
// This is a custom ESLint formatter that work well with this build tool's console output.
const eslintFormatter = require('react-dev-utils/eslintFormatter');
// This plugin will ensure that relative imports from app's source directory don't reach outside of it.
// For this case, it will restrict all the module imports under the 'src/' folder, if not, it will throw
// out an error in the build process.
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
// A visualization tool to analyse the stats.json output by webpack after packing.
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// A method to get the environment variables of current client for injection.
const getClientEnvironment = require('./env');
// The pre-configured paths.
const paths = require('./paths');

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
const shouldUseRelativeAssetPaths = publicPath === './';
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = publicPath.slice(0, -1);
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

// Assert this just to be safe.
// Development builds of React are slow and not intended for production.
if (env.stringified['process.env'].NODE_ENV !== '"production"') {
    throw new Error('Production builds must have NODE_ENV=production.');
}

// Note: defined here because it will be used more than once.
const cssFilename = 'static/css/[name].[contenthash:8].css';

// ExtractTextPlugin expects the build output to be flat.
// (See https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/27)
// However, our output is structured with css, js and media folders.
// To have this structure working with relative paths, we have to use custom options.
const extractTextPluginOptions = shouldUseRelativeAssetPaths
    ? // Making sure that the publicPath goes back to to build folder.
    {publicPath: Array(cssFilename.split('/').length).join('../')}
    : {};

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = {
    // Don't attempt to continue if there are any errors.
    bail: true,
    // We generate sourcemaps in production. This is slow but gives good results.
    // You can exclude the *.map files from the build during deployment.
    devtool: shouldUseSourceMap ? 'source-map' : false,
    // In production, we only want to load the polyfills and the app code.
    entry: [require.resolve('./polyfills'), paths.appIndexJs],
    output: {
        // The build folder.
        path: paths.appBuild,
        // Generated JS file names (with nested folders).
        // There will be one main bundle, and one file per asynchronous chunk.
        // We don't currently advertise code splitting but Webpack supports it.
        filename: 'static/js/[name].[chunkhash:8].js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
        // We inferred the "public path" (such as / or /my-project) from homepage.
        publicPath: publicPath,
        // Point sourcemap entries to original disk location (format as URL on Windows)
        devtoolModuleFilenameTemplate: info =>
            path
                .relative(paths.appSrc, info.absoluteResourcePath)
                .replace(/\\/g, '/'),
    },
    // These will determine webpack how to resolve the module files.
    resolve: {
        // This allows you to set a fallback for where Webpack should look for modules.
        // We placed these paths second because we want `node_modules` to "win"
        // if there are any conflicts. This matches Node resolution mechanism.
        // https://github.com/facebookincubator/create-react-app/issues/253
        modules: ['node_modules', paths.appNodeModules].concat(
            // It is guaranteed to exist because we tweak it in `env.js`
            process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
        ),
        // These are the reasonable defaults supported by the Node ecosystem.
        // We also include JSX as a common component filename extension to support
        // some tools, although we do not recommend using it, see:
        // https://github.com/facebookincubator/create-react-app/issues/290
        // `web` extension prefixes have been added for better support
        // for React Native Web.
        extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
        alias: {
            // Support React Native Web
            // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
            'react-native': 'react-native-web',
            // High frequency used business file path simplify
            'StyleSheets$': path.resolve(__dirname, '..', 'src/styleSheets/index.less'),
            'Images': path.resolve(__dirname, '..', 'src/images/'),
            'Components': path.resolve(__dirname, '..', 'src/components/'),
            'RouterPath$': path.resolve(__dirname, '..', 'src/routerPath/index.js'),
            'Views': path.resolve(__dirname, '..', 'src/views/'),
            'Store$': path.resolve(__dirname, '..', 'src/redux/index.js'),
            'Actions': path.resolve(__dirname, '..', 'src/redux/actions/'),
            'Reducers$': path.resolve(__dirname, '..', 'src/redux/reducers/index.js'),
            'Services$': path.resolve(__dirname, '..', 'src/services/index.js'),
            'Http': path.resolve(__dirname, '..', 'src/http/'),
            'Socket$': path.resolve(__dirname, '..', 'src/socket/index.js'),
        },
        plugins: [
            // Prevents users from importing files from outside of src/ (or node_modules/).
            // This often causes confusion because we only process files within src/ with babel.
            // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
            // please link the files into your node_modules/ and let module-resolution kick in.
            // Make sure your source files are compiled, as they will not be processed in any way.
            new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
        ],
    },
    // Designates the matching rules and handler loader for each type of files.
    module: {
        strictExportPresence: true,
        rules: [
            // TODO: Disable require.ensure as it's not a standard language feature.
            // We are waiting for https://github.com/facebookincubator/create-react-app/issues/2176.
            // { parser: { requireEnsure: false } },

            // First, run the linter.
            // It's important to do this before Babel processes the JS.
            {
                test: /\.(js|jsx|mjs)$/,
                include: paths.appSrc,
                enforce: 'pre',
                use: ['happypack/loader?id=linter'],
            },
            {
                // "oneOf" will traverse all following loaders until one will
                // match the requirements. When no loader matches it will fall
                // back to the "file" loader at the end of the loader list.
                oneOf: [
                    // Make SVG image imported like a React component.
                    {
                        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                        use: [
                            {
                                loader: 'babel-loader',
                            },
                            {
                                loader: '@svgr/webpack',
                                options: {
                                    babel: false,
                                    icon: true,
                                },
                            },
                        ],
                    },
                    // "url" loader works just like "file" loader but it also embeds
                    // assets smaller than specified size as data URLs to avoid requests.
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 1000,
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },
                    // Since there is a issue needs to be solved, don't give it to HappyPack temporarily.
                    /*
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        use: ['happypack/loader?id=image'],
                    },
                    */
                    // Process JS with Babel.
                    {
                        test: /\.(js|jsx|mjs)$/,
                        include: paths.appSrc,
                        use: ['happypack/loader?id=babel'],
                    },
                    // The notation here is somewhat confusing.
                    // 1. "postcss" loader applies autoprefixer to our CSS.
                    // 2. "css" loader resolves paths in CSS and adds assets as dependencies.
                    // 3. "style" loader normally turns CSS into JS modules injecting <style>, but
                    // unlike in development configuration, we do something different.
                    // 4. `ExtractTextPlugin` first applies the "postcss" and "css" loaders (second argument),
                    // then grabs the result CSS and puts it into a separate file in our build process.
                    // This way we actually ship a single CSS file in production instead of JS code
                    // injecting <style> tags. If you use code splitting, however, any async bundles
                    // will still use the "style" loader inside the async code so CSS from them won't
                    // be in the main CSS file.
                    // For examples:
                    // The common css codes will be transferred into a separated single css file and used like:
                    // '<link href="/static/css/main.7b1f7cec.css" rel="stylesheet">'
                    // If we use code splitting to async load components, the css codes only used by this component
                    // will still be handled by the "style" loader and loaded through blob protocol just like:
                    // '<link type="text/css" rel="stylesheet" href="blob:http://192.168.100.55/14d9a69e-5d95-464d-9243-9f22b7ef445d">'
                    // after the JS chunk code is loaded:
                    // '<script type="text/javascript" charset="utf-8" async="" src="/static/js/1.3cea7066.chunk.js"></script>'
                    // So, this is totally different with dev environment.
                    {
                        test: /\.css$/,
                        // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
                        loader: ExtractTextPlugin.extract(
                            Object.assign(
                                {
                                    fallback: {
                                        loader: require.resolve('style-loader'),
                                        options: {
                                            hmr: false,
                                        },
                                    },
                                    use: [
                                        {
                                            loader: require.resolve('css-loader'),
                                            options: {
                                                importLoaders: 1,
                                                minimize: true,
                                                sourceMap: shouldUseSourceMap,
                                            },
                                        },
                                        {
                                            loader: require.resolve('postcss-loader'),
                                            options: {
                                                // Necessary for external CSS imports to work
                                                // https://github.com/facebookincubator/create-react-app/issues/2677
                                                ident: 'postcss',
                                                plugins: () => [
                                                    require('postcss-flexbugs-fixes'),
                                                    autoprefixer({
                                                        browsers: [
                                                            '>1%',
                                                            'last 4 versions',
                                                            'Firefox ESR',
                                                            'Firefox <= 26',
                                                            'not ie < 9', // React doesn't support IE8 anyway
                                                        ],
                                                        flexbox: 'no-2009',
                                                    }),
                                                ],
                                            },
                                        },
                                    ],
                                },
                                extractTextPluginOptions
                            )
                        ),
                    },
                    {
                        test: /\.less$/,
                        // Extract text from js codes, will extract css string computed and injected by css-loader
                        // (the raw style file imported in the entry) to a separated single css file. And use this
                        // css file through the way of External link. To promote the render performance by this way,
                        // instead of using style-loader. Because css files and js files are loaded in parallel.
                        loader: ExtractTextPlugin.extract(
                            Object.assign(
                                {
                                    fallback: {
                                        // Assign a fallback handler:
                                        // If extract text action failed, we can only choose style-loader, that's sad :(
                                        loader: require.resolve('style-loader'),
                                        options: {
                                            hmr: false,
                                        },
                                    },
                                    use: [
                                        // css-loader will let you to use @import and url() just like import or require method
                                        // to import a css file, and it will translate these files to plain string into js code.
                                        // These js codes are prepared for style-loader and extract-text-webpack-plugin. Also
                                        // it supports css scope, and if you need this, you can set the related configurations in
                                        // options. If so, you can write your css codes use ':global' or ':local' decorator.
                                        {
                                            loader: require.resolve('css-loader'),
                                        },
                                        // A css post-handler
                                        {
                                            loader: require.resolve('postcss-loader'),
                                            options: {
                                                ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
                                                plugins: () => [
                                                    // add flex bug fix codes
                                                    require('postcss-flexbugs-fixes'),
                                                    // add vendor prefix
                                                    autoprefixer({
                                                        browsers: [
                                                            '>1%',
                                                            'last 4 versions',
                                                            'Firefox ESR',
                                                            'Firefox <= 26',
                                                            'not ie < 9', // React doesn't support IE8 anyway
                                                        ],
                                                        flexbox: 'no-2009',
                                                    }),
                                                ],
                                            },
                                        },
                                        // A less pre-handler, will translate less codes to pure css codes
                                        {
                                            loader: require.resolve('less-loader'),
                                            // options: {
                                                // your can custom the antd theme like below
                                                // modifyVars: { "@primary-color": "#1DA57A" },
                                            // },

                                        },
                                    ],
                                },
                                extractTextPluginOptions
                            )
                        ),
                    },
                    // Instructs webpack to emit the required object as file and to return its public URL.
                    // "file" loader makes sure assets end up in the `build` folder.
                    // When you `import` an asset, you get its filename.
                    // This loader doesn't use a "test" so it will catch all modules
                    // that fall through the other loaders.
                    {
                        loader: require.resolve('file-loader'),
                        // Exclude `js` files to keep "css" loader working as it injects
                        // it's runtime that would otherwise processed through "file" loader.
                        // Also exclude `html` and `json` extensions so they get processed
                        // by webpacks internal loaders.
                        exclude: [/\.js$/, /\.html$/, /\.json$/],
                        options: {
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },
                    // ** STOP ** Are you adding a new loader?
                    // Make sure to add the new loader(s) before the "file" loader.
                ],
            },
            {
                // test: /\.(woff|svg|eot|tff)\??.*$/,
                test: /\.(woff|eot|tff)\??.*$/,
                use: ['happypack/loader?id=font'],
            },
        ],
    },
    // Expands the features of webpack, and will take effect during the whole packing process.
    // It's the backbone of webpack, and will do some things which module loaders can't do, like:
    // 1. Handler the codes shipped from previous packing phase, such as: replace some contents, split
    // codes to some separated chunk files, introduce some global configurations, etc.
    // 2. Auxiliary output: generate html file with resource link automatically, clean the build
    // file directory, etc.
    plugins: [
        new webpack.BannerPlugin('© 2018 Orcadt All Rights Reserved'),
        // A HappyPack instance for js linter task.
        new HappyPack({
            id: 'linter',
            threadPool: happyThreadPool,
            verbose: true,
            loaders: [
                {
                    options: {
                        formatter: eslintFormatter,
                        eslintPath: require.resolve('eslint'),
                    },
                    loader: require.resolve('eslint-loader'),
                }
            ]
        }),
        // A HappyPack instance for js sources.
        new HappyPack({
            id: 'babel',
            threadPool: happyThreadPool,
            verbose: true,
            loaders: [
                {
                    loader: require.resolve('babel-loader'),
                    options: {
                        compact: true,
                    },
                }
            ]
        }),
        // A HappyPack instance for font sources.
        new HappyPack({
            id: 'font',
            threadPool: happyThreadPool,
            verbose: true,
            loaders: [
                {
                    loader: 'url-loader?name=fonts/[name].[md5:hash:hex:7].[ext]',
                }
            ]
        }),
        // Makes some environment variables available in index.html.
        // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
        // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
        // In production, it will be an empty string unless you specify "homepage"
        // in `package.json`, in which case it will be the pathname of that URL.
        new InterpolateHtmlPlugin(env.raw),
        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        // For some android smart phones' inferior default browsers, the JavaScript codes with webpack module
        // runtime imported into the index.html by the way of outer chain, will not run actually. And the
        // react dom will not be created or mounted on the target DOM in index.html, the screen of the phones
        // will be simply white without any error or logs in console tab. So, here we introduce this plugin to
        // inline the codes of main.xxxxxx.js file into the <script> tag in index.html.
        /*
        new ScriptExtHtmlWebpackPlugin({
            inline: 'main'
        }),
        */
        // Makes some environment variables available to the JS code, for example:
        // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
        // It is absolutely essential that NODE_ENV was set to production here.
        // Otherwise React will be compiled in the very slow development mode.
        new webpack.DefinePlugin(env.stringified),
        // Minify the code.
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                // Disabled because of an issue with Uglify breaking seemingly valid code:
                // https://github.com/facebookincubator/create-react-app/issues/2376
                // Pending further investigation:
                // https://github.com/mishoo/UglifyJS2/issues/2011
                comparisons: false,
            },
            mangle: {
                safari10: true,
            },
            output: {
                comments: false,
                // Turned on because emoji and regex is not minified properly using default
                // https://github.com/facebookincubator/create-react-app/issues/2488
                ascii_only: true,
            },
            sourceMap: shouldUseSourceMap,
        }),
        // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
        new ExtractTextPlugin({
            filename: cssFilename,
        }),
        // Generate a manifest file which contains a mapping of all asset filenames
        // to their corresponding output file so that tools can pick it up without
        // having to parse `index.html`.
        new ManifestPlugin({
            fileName: 'asset-manifest.json',
        }),
        // Generate a service worker script that will precache, and keep up to date,
        // the HTML & assets that are part of the Webpack build.
        new SWPrecacheWebpackPlugin({
            // By default, a cache-busting query parameter is appended to requests
            // used to populate the caches, to ensure the responses are fresh.
            // If a URL is already hashed by Webpack, then there is no concern
            // about it being stale, and the cache-busting can be skipped.
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            filename: 'service-worker.js',
            logger(message) {
                if (message.indexOf('Total precache size is') === 0) {
                    // This message occurs for every build and is a bit too noisy.
                    return;
                }
                if (message.indexOf('Skipping static resource') === 0) {
                    // This message obscures real errors so we ignore it.
                    // https://github.com/facebookincubator/create-react-app/issues/2612
                    return;
                }
                console.log(message);
            },
            minify: true,
            // For unknown URLs, fallback to the index page
            navigateFallback: publicUrl + '/index.html',
            // Ignores URLs starting from /__ (useful for Firebase):
            // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
            navigateFallbackWhitelist: [/^(?!\/__).*/],
            // Don't precache sourcemaps (they're large) and build asset manifest:
            staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
        }),
        // Moment.js is an extremely popular library that bundles large locale files
        // by default due to how Webpack interprets its code. This is a practical
        // solution that requires the user to opt into importing specific locales.
        // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
        // You can remove this if you don't use Moment.js:
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        // A visualization tool.
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        })
    ],
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
    },
};