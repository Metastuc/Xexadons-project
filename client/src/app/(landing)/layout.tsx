import "@/styles/_index.scss";

import type { Metadata } from "next";
import { ReactNode } from "react";
import { Toaster } from "sonner";

import { ContextProvider } from "@/hooks";
import { NavigationBar } from "@/views";

export const metadata: Metadata = {
	title: "xexadons",
	description: `Xexadons are known as XEX`,
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className="app">
				<Toaster />
				<ContextProvider>{App({ children })}</ContextProvider>
			</body>
		</html>
	);
}

function App({ children }: { children: ReactNode }) {
	return (
		<>
			<section className="app__wrapper">
				<AppNavigation />

				<>{children}</>
			</section>
		</>
	);
}

function AppNavigation() {
	return (
		<>
			<header
				className="header-navbar"
				data-group="parent"
			>
				<NavigationBar group={"header-navbar"} />
			</header>
		</>
	);
}
