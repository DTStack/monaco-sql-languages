import React from 'react';
import { Context } from './context';

export default function ProblemStore({
	children,
	value
}: {
	value: any;
	children: React.ReactNode;
}) {
	return <Context.Provider value={value}>{children}</Context.Provider>;
}
