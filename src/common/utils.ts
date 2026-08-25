export interface DebouncedFunction<T extends (...args: unknown[]) => unknown> {
	(...args: Parameters<T>): unknown;
	cancel: () => void;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
	func: T,
	timeout: number,
	immediate?: boolean
): DebouncedFunction<T> {
	let timer: NodeJS.Timeout | null = null;

	const debounced = (...args: Parameters<T>) => {
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

	debounced.cancel = () => {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	};

	return debounced;
}
