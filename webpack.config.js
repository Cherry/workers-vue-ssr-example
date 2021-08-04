import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import webpack from 'webpack';
import {VueLoaderPlugin} from 'vue-loader';

export default function(){
	const config = {
		target: "webworker",
		devtool: false,
		entry: "./src/index.mjs",
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: "index.mjs",
			chunkFormat: 'array-push',
			library: {
				type: 'module',
			},
		},
		mode: "production",
		module: {
			rules: [
				{
					test: /\.mjs$/,
					type: 'javascript/esm',
				},
				{
					test: /\.vue$/,
					loader: 'vue-loader',
				},
			],
		},
		plugins: [
			new VueLoaderPlugin(),
			// VueJS feature flags for treeshaking - https://github.com/vuejs/vue-next/tree/master/packages/vue#bundler-build-feature-flags
			new webpack.DefinePlugin({
				__VUE_OPTIONS_API__: true,
				__VUE_PROD_DEVTOOLS__: false,
			}),
		],
		experiments: {
			outputModule: true,
		},
	};
	return config;
}