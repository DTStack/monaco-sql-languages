/* eslint-disable @typescript-eslint/ban-types */
import EventEmitter from '@dtinsight/molecule/esm/glue/eventEmitter';

const ee = new EventEmitter();

export function emit(name: string, ...args: any) {
	ee.emit(name, ...args);
}

export function subscribe(name: string, listener: Function) {
	ee.subscribe(name, listener);
}

export function unsubscribe(name: string, listener: Function) {
	ee.unsubscribe(name, listener);
}
