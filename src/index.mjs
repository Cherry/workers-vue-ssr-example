import {createSSRApp} from 'vue';
import {renderToWebStream} from '@vue/server-renderer';
import {ReadableStream as polyReadableStream} from 'web-streams-polyfill/dist/ponyfill.es2018.mjs';

import appVue from './app.vue';

async function pipeReaderToWriter(reader, writer){
	const encoder = new TextEncoder();
	for(;;){
		const {value, done} = await reader.read();
		await writer.write(encoder.encode(value));
		if(done){
			break;
		}
	}
	writer.close();
}

// eslint-disable-next-line no-unused-vars
async function handleRequest(request, env){
	const app = createSSRApp(appVue);
	const {readable, writable} = new TransformStream();
	const render = renderToWebStream(app, {}, polyReadableStream);
	pipeReaderToWriter(render.getReader(), writable.getWriter());
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