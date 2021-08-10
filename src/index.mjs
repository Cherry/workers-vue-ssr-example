import {createSSRApp} from 'vue';
import {renderToSimpleStream} from '@vue/server-renderer';

import appVue from './app.vue';

const pipeToWebWritable = function(input, context, writable){
	const writer = writable.getWriter();
	const encoder = new TextEncoder();

	renderToSimpleStream(input, context, {
		async push(content){
			if(content !== null){
				return writer.write(encoder.encode(content));
			}
			return writer.close();
		},
		destroy(err){
			// TODO better error handling?
			console.log(err);
			writer.close();
		},
	});
};

// eslint-disable-next-line no-unused-vars
async function handleRequest(request, env){
	const app = createSSRApp(appVue);
	const {readable, writable} = new TransformStream();
	pipeToWebWritable(app, {}, writable);
	return new Response(readable);
}

export default {
	async fetch(request, env){
		try{
			return handleRequest(request, env);
		}catch(err){
			return new Response(err.message);
		}
	},
};