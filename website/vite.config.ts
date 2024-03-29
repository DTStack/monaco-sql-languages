import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'monaco-editor': resolve('node_modules/monaco-editor'),
			'monaco-sql-languages': resolve('../')
		}
	},
	base: '/monaco-sql-languages/',
	server: {
		fs: {
			allow: ['..']
		}
	}
});
