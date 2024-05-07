"use client";

import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useState,
} from "react";

type NavContextType = {
	isNetworkValid: boolean;
	setIsNetworkValid: Dispatch<SetStateAction<boolean>>;
};

export const NavContext = createContext<NavContextType>({} as NavContextType);

export function NavContextProvider({ children }: { children: ReactNode }) {
	const [isNetworkValid, setIsNetworkValid] = useState<boolean>(true);

	return (
		<>
			<NavContext.Provider value={{ isNetworkValid, setIsNetworkValid }}>
				{children}
			</NavContext.Provider>
		</>
	);
}
