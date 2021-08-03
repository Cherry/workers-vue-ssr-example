import {h, createSSRApp} from 'vue';
import {renderToWebStream} from '@vue/server-renderer';
import {ReadableStream as polyReadableStream} from 'web-streams-polyfill/ponyfill/es6';

async function handleRequest(request, env){
	const app = createSSRApp({
		data: () => {
			return {
				msg: 'Hello World from Vue.js SSR!',
			};
		},
		render(){
			return h('div',	[
				this.msg,
			]);
		},
	});

	// native solution, expecting `ReadableStream` constructor
	// not possible in native Cloudflare Workers environment. Throws `Failed to construct 'ReadableStream': the constructor is not implemented.`
	return new Response(renderToWebStream(app));

	// other stream solution, using TransformStream
	// as far as I can tell, this _should_ work, but it doesn't. Throws `Error: The script will never generate a response.`

	/*const transform = new TransformStream()
	const render = renderToWebStream(app, {}, polyReadableStream);
	render.pipeTo(transform.writable);
	return new Response(transform.readable);*/

	// hacky stream solution buffered in memory
	// this works, but is the most inefficient solution, as it will buffer the entire response in memory.

	/*const render = await renderToWebStream(app, {}, polyReadableStream);
	const result = await render.getReader().read();
	return new Response(result.value, {
		headers: {
			'Content-Type': 'text/html',
		},
	});*/
}

export default {
	async fetch(request, env){
		try{
			return await handleRequest(request, env);
		}catch(err){
			return new Response(err.message);
		}
	},
};