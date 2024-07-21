export const metadata = {
	title: "Pools",
	description: "Pools",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<main
			className="pools"
			data-group="parent"
			style={{
				marginTop: "4.5rem",
			}}
		>
			{children}
		</main>
	);
}
