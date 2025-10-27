export function randomId() {
	return Math.round(Math.random() * 1000);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
	func: T,
	timeout: number,
	immediate?: boolean
): (...args: Parameters<T>) => unknown {
	let timer: NodeJS.Timeout | null = null;
	return (...args) => {
		if (timer) {
			clearTimeout(timer);
		}
		if (immediate && !timer) {
			return func?.(...args);
		}

		timer = setTimeout(() => {
			timer && clearTimeout(timer);
			timer = null;
			func?.(...args);
		}, timeout);
	};
}

export function getBEMElement(block: string, element: string) {
	return `${block}__${element}`;
}

/**
 * This function help you prefix a css class name, default is molecule.
 * Example: prefixClaName('test') will return 'molecule-test',
 * prefixClaName('test', 'c') will return 'c-test'
 * @param name Default class name
 * @param prefix The prefix of class name you want to append
 */
export function prefixClaName(name: string, prefix = 'mo') {
	return name ? `${prefix}-${name}` : '';
}

export function convertNaNValue(value: string) {
	return isNaN(parseInt(value)) ? NaN : value;
}
