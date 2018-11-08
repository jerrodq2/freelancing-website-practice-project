'use strict';


// import webpack from 'webpack';
const HtmlWebpackPlugin = require('html-webpack-plugin'),
	// LiveReloadPlugin = require('webpack-livereload-plugin'),
	HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
		template: __dirname + '/client/index.html',
		filename: 'index.html',
		inject: 'body',
	});

module.exports =  {
	mode: 'development',
	entry: __dirname + '/client/index.js',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},

			// {
			// 	use: ['style-loader', 'css-loader'],
			// 	test: /\.css$/
			// },
		]
	},

	output: {
		filename: 'index.js',
		path: __dirname + '/build',
	},

	plugins: [
		HtmlWebpackPluginConfig,
		// new LiveReloadPlugin(),
	]
};


// this allows webpack to create a new html file to go with the JS file created below, so they will be in the same directory
// const HTMLWebpackPlugin = require('html-webpack-plugin'),
// 	HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
// 		// template is where the current html file is located
// 		template: __dirname + '/client/index.html',
// 		// this is the name of the newly created html file
// 		filename: 'index.html',
// 		// webpack injects a <script> tag in the new html file, linking it to the new JS file. This tells it to either inject it in the 'body' or 'head' of the new html file
// 		inject: 'body',
// 	});
//
//
// module.exports = {
// 	mode: 'development',
// 	// tells webpack what the entry point is, or which file it will transform
// 	entry: __dirname + '/client/index.js',
// 	// the loaders array below details each transformation your code will go through before it reaches the browser. Each loader is written as an object
// 	module: {
// 		rules: [
// 			{
// 				// the test property specifies which files will be affected by the loader, in this case, all .js files
// 				test: /\.js$/,
// 				// exclude specifies files that match the test criteria but you don't want transformed
// 				exclude: /node_modules/,
// 				// the loader property is the transformation that is performed
// 				loader: 'babel-loader',
// 			},
// 		],
// 	},
// 	// output tells webpack where to save the transformed javascript.
// 	output: {
// 		filename: 'transformed.js', //the name of the new file created
// 		path: __dirname + '/build', // the path where the new file is located
// 	},
//
// 	// we add the HTMLWebpackPlugin instance here
// 	plugins: [HTMLWebpackPluginConfig],
// };
