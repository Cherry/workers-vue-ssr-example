import {createSSRApp} from 'vue';
import {pipeToWebWritable} from '@vue/server-renderer';

import appVue from './app.vue';

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