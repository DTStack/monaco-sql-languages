import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			// 'monaco-editor': resolve('node_modules/monaco-editor'),
			'monaco-sql-languages': resolve('../../packages/monaco-sql-languages/')
		}
	},
	base: '/monaco-sql-languages/',
	build: {
		commonjsOptions: {
			transformMixedEsModules: true
		},
		outDir: resolve(__dirname, '../../docs')
	},
	server: {
		fs: {
			allow: ['..']
		}
	}
});
