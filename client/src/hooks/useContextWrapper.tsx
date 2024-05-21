import { ReactNode, useContext } from "react";

import {
	NavContext,
	NavContextProvider,
	NFTContext,
	NFTContextProvider,
} from "@/context";
import { Web3Provider } from "@/lib";

export function ContextWrapper() {
	const navContext = useContext(NavContext);
	const nftContext = useContext(NFTContext);

	return { navContext, nftContext };
}

export function ContextProvider({ children }: { children: ReactNode }) {
	return (
		<Web3Provider>
			<NFTContextProvider>
				<NavContextProvider>
					<>{children}</>
				</NavContextProvider>
			</NFTContextProvider>
		</Web3Provider>
	);
}
