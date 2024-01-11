import { useState } from 'react';

export default function useEdit() {
	const [data, setData] = useState('');
	const [editing, setEditing] = useState(false);

	function start(initialValue: string) {
		setEditing(true);
		setData(initialValue);
	}

	function stop() {
		setEditing(false);
		setData('');
	}

	function dispatch(value: string) {
		setData(value);
	}

	return { editing, data, start, stop, dispatch };
}
