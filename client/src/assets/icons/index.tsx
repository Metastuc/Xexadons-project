import { JSX } from "react";

export const Cart = function (): JSX.Element {
	return (
		<>
			<svg
				width={24}
				height={24}
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M3.864 16.455c-.858-3.432-1.287-5.147-.386-6.301C4.378 9 6.148 9 9.685 9h4.63c3.538 0 5.306 0 6.207 1.154.901 1.153.472 2.87-.386 6.301-.546 2.183-.818 3.274-1.632 3.91-.814.635-1.939.635-4.189.635h-4.63c-2.25 0-3.375 0-4.189-.635-.814-.636-1.087-1.727-1.632-3.91z"
					stroke="#15BFFD"
					strokeWidth={1.5}
				/>
				<path
					d="M19.5 9.5l-.71-2.605c-.274-1.005-.411-1.507-.692-1.886A2.5 2.5 0 0017 4.172C16.56 4 16.04 4 15 4M4.5 9.5l.71-2.605c.274-1.005.411-1.507.692-1.886A2.5 2.5 0 017 4.172C7.44 4 7.96 4 9 4"
					stroke="#15BFFD"
					strokeWidth={1.5}
				/>
				<path
					d="M9 4a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z"
					stroke="#15BFFD"
					strokeWidth={1.5}
				/>
			</svg>
		</>
	);
};

export const Search = function (): JSX.Element {
	return (
		<>
			<svg
				width={24}
				height={24}
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle
					cx={11.5}
					cy={11.5}
					r={9.5}
					stroke="#15BFFD"
					strokeWidth={1.5}
				/>
				<path
					d="M20 20l2 2"
					stroke="#15BFFD"
					strokeWidth={1.5}
					strokeLinecap="round"
				/>
			</svg>
		</>
	);
};

export const DropDown = function (): JSX.Element {
	return (
		<>
			<svg
				width={15}
				height={16}
				viewBox="0 0 15 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M11.875 6.125L7.5 9.875l-4.375-3.75"
					stroke="#15BFFD"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</>
	);
};
