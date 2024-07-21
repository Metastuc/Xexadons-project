"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

type NavContextType = {
	isNetworkValid: boolean;
	setIsNetworkValid: Dispatch<SetStateAction<boolean>>;
};

type TabContextType = {
	activeTab: string;
	setActiveTab: Dispatch<SetStateAction<string>>;
};

type NavAndTabProviderProps = NavContextType & TabContextType;

export const NavContext = createContext<NavAndTabProviderProps>(
	{} as NavAndTabProviderProps,
);

export function NavContextProvider({ children }: { children: ReactNode }) {
	const [isNetworkValid, setIsNetworkValid] = useState<boolean>(true);
	const [activeTab, setActiveTab] = useState<string>("buy");

	return (
		<>
			<NavContext.Provider
				value={{
					isNetworkValid,
					setIsNetworkValid,

					activeTab,
					setActiveTab,
				}}
			>
				{children}
			</NavContext.Provider>
		</>
	);
}
