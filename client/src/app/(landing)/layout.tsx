import "@/styles/_index.scss";

import type { Metadata } from "next";
import { ReactNode } from "react";

import { Web3Provider } from "@/lib";
import { NavigationBar } from "@/views";

export const metadata: Metadata = {
	title: "xexadons",
	description: `Xexadons are known as XEX`,
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className="app">
				<Web3Provider>
					<section className="app__wrapper">
						{/* <>{NavigationBar()}</> */}
						<>{children}</>
					</section>
				</Web3Provider>
			</body>
		</html>
	);
}
