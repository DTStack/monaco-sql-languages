/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Resolves with the global monaco API
// Uses a proxy to lazily access self.monaco, which may not be available at load time

declare const define: any;

define([], function () {
	// Return a proxy that lazily resolves self.monaco
	// This handles the case where self.monaco is not yet available when this module loads
	return new Proxy(
		{},
		{
			get: function (_target: any, prop: string) {
				// Try multiple global references to find monaco
				const g =
					typeof globalThis !== 'undefined'
						? globalThis
						: typeof self !== 'undefined'
							? self
							: typeof global !== 'undefined'
								? global
								: {};
				const monaco = (g as any).monaco;
				if (!monaco) {
					throw new Error(
						'Monaco editor API not available. Ensure editor.main.js is loaded before language contributions.'
					);
				}
				return monaco[prop];
			}
		}
	);
});
