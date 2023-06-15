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
	define: {
		'process.env': process.env
	},
	resolve: {
		alias: {
			util: resolve('node_modules/rollup-plugin-node-polyfills/polyfills/util'),
			assert: resolve('node_modules/rollup-plugin-node-polyfills/polyfills/assert'),
			'monaco-editor': resolve('node_modules/monaco-editor'),
			'monaco-sql-languages': resolve('../')
		}
	},
	optimizeDeps: {
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: 'globalThis',
				'global.Buffer': 'Buffer'
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
	base: '/monaco-sql-languages/',
	build: {
		commonjsOptions: {
			transformMixedEsModules: true,
			strictRequires: true // 注意：这里必须是 true，否则会报错
		},
		rollupOptions: {
			plugins: [rollupNodePolyFill()]
		},
		outDir: resolve(__dirname, '../docs')
	},
	server: {
		fs: {
			allow: ['..']
		}
	}
});
