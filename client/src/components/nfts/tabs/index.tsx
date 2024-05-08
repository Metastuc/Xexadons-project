import "./index.scss";

type TabsProps = {
	handleTabClick: Function;
};

export function Tabs({ handleTabClick }: TabsProps) {
	return (
		<section className="nft_tabs">
			<div className="nft_tabs__wrapper">
				<button
					className="nft_tabs__button"
					onClick={() => handleTabClick("buy")}
				>
					<span>buy</span>
				</button>

				<button
					className="nft_tabs__button"
					onClick={() => handleTabClick("sell")}
				>
					<span>sell</span>
				</button>

				<button
					className="nft_tabs__button"
					onClick={() => handleTabClick("pool")}
				>
					<span>pool</span>
				</button>

				{/* <span>indicator</span> */}
			</div>
		</section>
	);
}
