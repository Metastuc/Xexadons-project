export const metadata = {
	title: "Nfts",
	description: "Nfts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<main
			className="nfts"
			data-group="parent"
			style={{
				marginTop: "4.5rem",
			}}
		>
			{children}
		</main>
	);
}
