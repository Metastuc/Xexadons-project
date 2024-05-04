import { Web3ModalProvider } from "@/lib";
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
					<Web3ModalProvider>
						<section className="app__wrapper">{children}</section>
					</Web3ModalProvider>
				</body>
			</html>
		</Fragment>
	);
}
