import { ReactNode, useContext } from "react";

import { NavContext, NavContextProvider } from "@/context";
import { Web3Provider } from "@/lib";

export function ContextWrapper() {
	const navContext = useContext(NavContext);

	return { navContext };
}

export function ContextProvider({ children }: { children: ReactNode }) {
	return (
		<Web3Provider>
			<NavContextProvider>
				<>{children}</>
			</NavContextProvider>
		</Web3Provider>
	);
}
