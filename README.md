# workers-vue-ssr-example
Showcase Vue.js 3.2+ SSSR with Cloudflare Workers

Issue discussion: https://github.com/vuejs/vue-next/issues/4243


This repo illustrates the current functionality of `@vue/server-renderer@3.2.0-beta.7`, and the issues getting this to run in Cloudflare Workers.

## Info

The `src/index.mjs` file contains a really simple Hello World Vue App, attempting to be rendered server-side. It has 3 different solutions in the code, in this order:

- Native
- via TransformStream
- Buffering stream in memory

Each is commented out, with the only one actually working being #3, buffering in memory.

## Native

This implementation is the most simple, and follows the docs as closely as possible at https://github.com/vuejs/vue-next/tree/master/packages/server-renderer#rendertowebstream.
Unfortunately due to Cloudflare Workers not implementing the `ReadableStream` constructor, this throws a `Failed to construct 'ReadableStream': the constructor is not implemented.` error.

## via TransformStream

This implementation combines the above, with Cloudflare's implementation of `TransformStream`, in an attempt to pipe the response around efficiently, maintaining the steam functionality. It does have to pull in and use `web-streams-polyfill/ponyfill/es6` to get the `ReadableSteam` constructor, but as far as I can tell, this should somewhat work, but doesn't, and throws a `Error: The script will never generate a response.`.

## Buffering steam in memory

This is the similar to #2, but drops the `TransformStream` and solely uses the `ReadableStream` retrieved from `web-streams-polyfill/ponyfill/es6`. Unfortunately though, this doesn't seem to behave with Cloudflare directly, so I have to manually `read()` the stream, and then send the entire response buffered in memory onto the client.

This _works_, but is obviously not ideal as it defeats the entire point of using streams.


## Reproduction

- Setup Cloudflare Wrangler environment. See https://developers.cloudflare.com/workers/cli-wrangler/install-update and https://developers.cloudflare.com/workers/cli-wrangler/authentication
	- Note you will need an account with the new ESM syntax enabled. See https://developers.cloudflare.com/workers/learning/using-durable-objects
- `npm ci`
- `wrangler dev`
- Hit `http://127.0.0.1:8787/`
- Comment in/out each solution in the `src/index.mjs` to see how it works.