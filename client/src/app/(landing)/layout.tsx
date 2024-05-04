import { Web3Provider } from "@/lib";
import "@/styles/_index.scss";

import type { Metadata } from "next";
import { Fragment, ReactNode } from "react";

export const metadata: Metadata = {
	title: "xexadons",
	description: `Xexadons are known as XEX`,
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<Fragment>
			<html lang="en">
				<body className="app">
					<Web3Provider>
						<section className="app__wrapper">{children}</section>
					</Web3Provider>
				</body>
			</html>
		</Fragment>
	);
}
