import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import commonjs from 'vite-plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [commonjs(), react()],
	resolve: {
		alias: {
			util: 'rollup-plugin-node-polyfills/polyfills/util',
			assert: 'rollup-plugin-node-polyfills/polyfills/assert',
			'monaco-editor': resolve('node_modules/monaco-editor'),
			'monaco-sql-languages': resolve('../')
		}
	},
	optimizeDeps: {
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: 'globalThis'
			},
			// Enable esbuild polyfill plugins
			plugins: [
				NodeGlobalsPolyfillPlugin({
					process: true,
					buffer: true
				}),
				NodeModulesPolyfillPlugin()
			]
		}
	},
	build: {
		rollupOptions: {
			plugins: [
				// Enable rollup polyfills plugin
				// used during production bundling
				rollupNodePolyFill()
			]
			// output: {
			//   manualChunks: {
			//     mysqlWorker: ['sql-languages/dist/languages/mysql/mysql.worker?worker']
			//   }
			// }
		}
	},
	server: {
		fs: {
			allow: ['..']
		}
	}
});
