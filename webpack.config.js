var path = require('path'),
    webpack = require('webpack'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	indexPagePlugin = new HtmlWebpackPlugin({
		inject: true,
		filename: path.join(__dirname, 'public/viz.html'),
		template: './app/viz.html'
	  });

module.exports = {
	// debug: true,
	// devtool: '#inline-source-map',
    entry: {
        'viz': path.join(__dirname, 'app', 'viz.js')
    },
    indexPagePlugin: indexPagePlugin,
    output: { path: path.join(__dirname, 'public/js'), filename: '[name].[hash].js' },
    module: {
        loaders: [
            { test: /.jsx?$/, loader: 'babel-loader', exclude: /node_modules/, query: { presets: ['es2015', 'react'] } },
			{ test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
		// 	__DEV__: true
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        indexPagePlugin,
        new ExtractTextPlugin('[name].[hash].css')
    ],
    devServer: { 
        // This is just so that I can run the node server for API requests on port 8000 while the
        // webpack-dev-server responds to requests on port 8080 during development. 
        proxy: {
            '/api/*': {
                target: 'http://127.0.0.1:8000',
                secure: false
            }
        },
    },
    target: 'web'
};