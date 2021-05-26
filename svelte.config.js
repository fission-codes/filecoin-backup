import preprocess from 'svelte-preprocess';
import ssr from '@sveltejs/adapter-static';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: ssr(),
		target: '#svelte',
		vite: {
      build: {
        target: 'chrome90'
      },
		}
	}
};

export default config;
