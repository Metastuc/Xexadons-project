"use client";

import "./index.scss";

import { ChangeEvent, useState, useEffect } from "react";
import { ContextWrapper } from "@/hooks";
import { Polygon, Xexadons, BSC } from "@/assets";
import { commonProps } from "@/types";
import { contentWrapper } from "@/views";
import { JsonRpcSigner } from 'ethers';
import { addLiquidity, getCurrency, getChain, getUserBalance, removeLiquidity } from "@/utils/app";
import { formatEther } from "viem";

type poolProps = commonProps & {
	activeTab: string;
	currentPool: string;
	handleTabClick: Function;
	signer: JsonRpcSigner | undefined;
	userAddress: string;
	_chainId: number;
};

type liquidityProps = commonProps & {
	signer: JsonRpcSigner | undefined;
	userAddress: string;
	_chainId: number;
}

type renderTabProps = commonProps & {
	handleTabClick: Function;
	currentPool: string;
};

export function Liquidity({ group, handleTabClick, currentPool, signer, userAddress, _chainId }: poolProps) {
	function renderContent() {
		switch (currentPool) {
			case "deposit":
				return <Deposit group={group} signer={signer} userAddress={userAddress} _chainId={_chainId}/>;

			case "withdraw":
				return <Withdraw group={group} signer={signer} userAddress={userAddress} _chainId={_chainId}/>;
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

				<span
					className={currentPool}
					style={{
						left:
							currentPool === "deposit"
								? "calc(0% + .25rem)"
								: "50%",
					}}
				></span>
			</ul>

			<p>
				{currentPool === "deposit"
					? `~ when you deposit liquidity, you earn a 1% fee on each trade
				made on the pool`
					: `~ when you withdraw liquidity, you take out selected Nft, token
				and the fees earned in the pool`}
			</p>
		</>
	);
}

function Deposit({ group, signer, userAddress, _chainId }: liquidityProps) {
	const styleClass = `${group}__deposit`;

	const {
		nftContext: { depositAmount, dollarAmount, selectedNFTs, poolAddress, userBalance, setUserBalance },
	} = ContextWrapper();

	const currency = getCurrency(_chainId);
	const chain = getChain(_chainId);

	const depositLiquidity = async() => {
        await addLiquidity(selectedNFTs, _chainId, poolAddress, signer);
        console.log("successfully");
    }

	return (
		<>
			<h3>Add liquidity</h3>

			<div className={`${styleClass}_top`}>
				{contentWrapper({
					children: (
						<>
							<section className={`${styleClass}_top-content`}>
								<span>Calculated amount deposit</span>

								<div>
									<aside>
										<span>{depositAmount}</span>
										<span>${dollarAmount}</span>
									</aside>

									<aside>
										<div>
											<i>{_chainId === 97 ? (
											<>
											<i>{BSC()}</i>
											</>
										) : _chainId === 80002 ? (
											<>
											<i>{Polygon()}</i>
											</>
										) : (
											<span>Wrong Network</span>
										)}</i>
											<span>{chain}</span>
										</div>
										<span>{userBalance}{currency} available</span>
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
										<span>{userAddress}</span>
										<span>0xe9c...26Ca</span>
									</div>

									<div className={`${styleClass}_detail-3`}>
										<span></span>
										<i></i>
										<span></span>
									</div>

									<div className={`${styleClass}_detail-4`}>
										<span>from</span>
										<span>nft pool</span>
									</div>
								</article>

								<article className={`${styleClass}_swap`}>
									<div>
										<i>{Xexadons()}</i>
										<i>{_chainId === 97 ? (
											<>
											<i>{BSC()}</i>
											</>
										) : _chainId === 80002 ? (
											<>
											<i>{Polygon()}</i>
											</>
										) : (
											<span>Wrong Network</span>
										)}</i>
									</div>

									<span>{selectedNFTs.length} xexadons & {depositAmount}{currency}</span>

									<p>~deposit {selectedNFTs.length} xexadons and {depositAmount}{currency} </p>
								</article>

								<div className={`${styleClass}_confirm`}>
									<button onClick={depositLiquidity}>
										<span>proceed</span>
									</button>
								</div>
							</section>
						</>
					),
				})}
			</div>
		</>
	);
}

function Withdraw({ group, signer, userAddress, _chainId }: liquidityProps) {
	const styleClass = `${group}__withdraw`;
	const [amount, setAmount] = useState<number | null>(50);

	const {
		nftContext: { dollarAmount, poolAddress, withdrawAmount, feesEarned, selectedNFTs},
	} = ContextWrapper();

	const currency = getCurrency(_chainId);
	const chain = getChain(_chainId);

	const withdrawLiquidity = async() => {
        await removeLiquidity(selectedNFTs, poolAddress, signer);
        console.log("successfully");
    }

	function handleAmountInput(event: ChangeEvent<HTMLInputElement>) {
		const inputValue = event.target.value.replace(/\D/g, "");
		const parsedValue = inputValue === "" ? 0 : parseInt(inputValue);

		setAmount(
			parsedValue === null || parsedValue <= 100 ? parsedValue : 100,
		);
	}

	return (
		<>
			<h3>Remove liquidity</h3>

			<div className={`${styleClass}_top`}>
				{contentWrapper({
					children: (
						<>
							<section className={`${styleClass}_top-content`}>
								<span>Calculated withdrawal amount</span>

								<div>
									<article>
										<span>{withdrawAmount}</span>

										<div>
											<i>{_chainId === 97 ? (
											<>
											<i>{BSC()}</i>
											</>
										) : _chainId === 80002 ? (
											<>
											<i>{Polygon()}</i>
											</>
										) : (
											<span>Wrong Network</span>
										)}</i>
											<span>{chain}</span>
										</div>
									</article>

									<span>${dollarAmount}</span>
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
								<span>Compounded trading fees</span>

								<div>
									<article>
										<span>{feesEarned}</span>

										<div>
											<i>{_chainId === 97 ? (
											<>
											<i>{BSC()}</i>
											</>
										) : _chainId === 80002 ? (
											<>
											<i>{Polygon()}</i>
											</>
										) : (
											<span>Wrong Network</span>
										)}</i>
											<span>{chain}</span>
										</div>
									</article>

									<article>
										<span>amount to withdraw</span>

										<div>
											<input
												type="text"
												value={amount!}
												onChange={handleAmountInput}
											/>
											<span>%</span>
										</div>
									</article>
								</div>

								<button onClick={withdrawLiquidity}>
									<span>proceed</span>
								</button>
							</section>
						</>
					),
				})}
			</div>
		</>
	);
}
