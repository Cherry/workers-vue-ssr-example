import {terser} from 'rollup-plugin-terser';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';



export default {
	input: 'src/index.mjs',
	output: {
		exports: 'named',
		format: 'es',
		file: 'dist/index.mjs',
		sourcemap: true,
	},

	external: [],
	plugins: [
		replace({
			values: {
				'process.env.NODE_ENV': JSON.stringify('production'),
			},
			preventAssignment: true,
		}),
		commonjs(),
		nodeResolve({
			browser: true,
		}),
		//terser(),
	],
};