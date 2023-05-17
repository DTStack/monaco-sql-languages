export function debounce(func: Function, timeout: number, immediate?: boolean) {
	let timer: any = null;
	return (...args: any) => {
		if (timer) {
			clearTimeout(timer);
		}
		if (immediate && !timer) {
			func?.(...args);
		}

		timer = setTimeout(() => {
			clearTimeout(timer);
			timer = null;
			func?.(...args);
		}, timeout);
	};
}
