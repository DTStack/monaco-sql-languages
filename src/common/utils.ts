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
