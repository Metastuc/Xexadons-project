import "./index.scss";

import { commonProps } from "@/types";
import { contentWrapper } from "@/views";

type poolProps = commonProps & {
	activeTab: string;
	currentPool: string;
	handleTabClick: Function;
};

type renderTabProps = commonProps & {
	handleTabClick: Function;
	currentPool: string;
};

export function Liquidity({
	group,
	// activeTab,
	handleTabClick,
	currentPool,
}: poolProps) {
	function renderContent() {
		switch (currentPool) {
			case "deposit":
				return deposit({ group });

			case "withdraw":
				return withdraw({ group });
		}
	}

	return (
		<section className={group}>
			<h2>liquidity</h2>

			<section className={`${group}__tabs`}>
				{renderTabs({ handleTabClick, currentPool, group })}
			</section>

			<section className={`${group}__content`}>{renderContent()}</section>
		</section>
	);
}

function renderTabs({ handleTabClick, currentPool }: renderTabProps) {
	return (
		<>
			<ul>
				<li
					onClick={() => {
						currentPool !== "deposit" &&
							handleTabClick("liquidity");
					}}
				>
					<span>deposit</span>
				</li>

				<li
					onClick={() => {
						currentPool !== "withdraw" &&
							handleTabClick("withdraw");
					}}
				>
					<span>withdraw</span>
				</li>

				{/* <span>indicator</span> */}
			</ul>

			<p>
				~ when you deposit liquidity, you earn a 1% fee on each trade
				made on the pool
			</p>
		</>
	);
}

function deposit({ group }: commonProps) {
	const styleClass = `${group}__content`;

	return (
		<section className={`${styleClass}_wrapper`}>
			<h3>Add liquidity</h3>

			<div className={`${styleClass}_top`}>
				{contentWrapper({
					children: (
						<>
							<section className={`${styleClass}_top-content`}>
								<span>Calculated amount deposit</span>

								<div>
									<aside>
										<span>500</span>
										<span>$560</span>
									</aside>

									<aside>
										<div>
											<i>icon</i>
											<span>polygon</span>
										</div>
										<span>845matic available</span>
									</aside>
								</div>
							</section>
						</>
					),
				})}
			</div>

			<div className={`${styleClass}_bottom`}>
				{contentWrapper({
					children: (
						<>
							<section className={`${styleClass}_bottom-content`}>
								<article className={`${styleClass}_detail`}>
									<div className={`${styleClass}_detail-1`}>
										<span></span>
										<i></i>
										<span></span>
									</div>

									<div className={`${styleClass}_detail-2`}>
										<span>nft pool</span>
										<span>receiver</span>
									</div>

									<div className={`${styleClass}_detail-3`}>
										<span></span>
										<i></i>
										<span></span>
									</div>

									<div className={`${styleClass}_detail-4`}>
										<span>account</span>
										<span>account</span>
									</div>
								</article>

								<article className={`${styleClass}_swap`}>
									<div>
										<i>icon</i>
										<i>icon</i>
									</div>

									<span>3 xexadons & 500matic</span>

									<p>~deposit 3 xexadons and 500matic </p>
								</article>

								<div className={`${styleClass}_confirm`}>
									<button>
										<span>proceed</span>
									</button>
								</div>
							</section>
						</>
					),
				})}
			</div>
		</section>
	);
}

function withdraw({ group }: commonProps) {
	function withdrawContent() {
		return <section>withdraw content</section>;
	}

	return (
		<section className={`${group}__wrapper`}>
			create new pool
			{contentWrapper({
				children: withdrawContent(),
			})}
		</section>
	);
}
