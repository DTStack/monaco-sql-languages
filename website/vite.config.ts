import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react({
			jsxRuntime: 'automatic'
		}),
		...mockDevServerPlugin({
			dir: './src/',
			include: 'mock/**/*.mock.{ts,js,cjs,mjs,json,json5}'
		})
	],
	resolve: {
		alias: {
			'monaco-editor': resolve('node_modules/monaco-editor'),
			'monaco-sql-languages': resolve('../'),
			'@': resolve(__dirname, 'src')
		}
	},
	base: '/monaco-sql-languages/',
	build: {
		commonjsOptions: {
			transformMixedEsModules: true
		},
		outDir: resolve(__dirname, '../docs')
	},
	server: {
		proxy: {
			'^/api': 'http://example.com/'
		}
	}
});
