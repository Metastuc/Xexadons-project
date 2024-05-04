"use client";

import { Cart, NAVIGATION_LINKS, Search } from "@/assets";
import { commonProps, navigationLink } from "@/types";
import "./index.scss";

import { ConnectButton } from "@rainbow-me/rainbowkit";

import Link from "next/link";
import { Fragment, JSX, ReactNode, useState } from "react";

type RenderButtonOnTheRightProps = commonProps & {
	children: ReactNode | string;
};

type RenderConnectButtonProps = commonProps & {
	setIsNetworkValid: Function;
};

export function NavBar({ group }: commonProps): JSX.Element {
	const [isNetworkValid, setIsNetworkValid] = useState<boolean>(true);

	return (
		<>
			<section
				className={`${group}__wrapper`}
				data-group={`wrapper`}
			>
				<Fragment>
					<RenderNavLinks group={group} />
				</Fragment>

				<div className={`${group}__right`}>
					{isNetworkValid && (
						<div>
							<i>{Search()}</i>
							<input
								type="text"
								placeholder="search collections"
							/>
						</div>
					)}

					<RenderButtonOnTheRight
						group={group}
						children={"enter app"}
					/>

					<RenderConnectButton
						group={group}
						setIsNetworkValid={setIsNetworkValid}
					/>

					<RenderButtonOnTheRight
						group={group}
						children={Cart()}
					/>
				</div>
			</section>
		</>
	);
}

function RenderNavLinks({ group }: commonProps): JSX.Element {
	let link: JSX.Element[];

	link = NAVIGATION_LINKS.map((item: navigationLink, index: number) => {
		return (
			<li key={index}>
				<Link href={item.url}>{item.title}</Link>
			</li>
		);
	});

	return (
		<nav className={`${group}__left`}>
			<ul>{link}</ul>
		</nav>
	);
}

function RenderButtonOnTheRight({
	group,
	children,
}: RenderButtonOnTheRightProps): JSX.Element {
	function handleClick() {}

	return (
		<>
			<button
				className={`${group}__right-button`}
				onClick={() => handleClick()}
			>
				{typeof children === "string" ? (
					<span>{children}</span>
				) : (
					<i>{children}</i>
				)}
			</button>
		</>
	);
}

function RenderConnectButton({
	group,
	setIsNetworkValid,
}: RenderConnectButtonProps): JSX.Element {
	return (
		<>
			<ConnectButton.Custom>
				{({
					account,
					chain,
					openAccountModal,
					openChainModal,
					openConnectModal,
					authenticationStatus,
					mounted,
				}) => {
					const ready = mounted && authenticationStatus !== "loading";
					const connected =
						ready &&
						account &&
						chain &&
						(!authenticationStatus ||
							authenticationStatus === "authenticated");

					return (
						<span
							{...(!ready && {
								"aria-hidden": true,
								"style": {
									opacity: 0,
									pointerEvents: "none",
									userSelect: "none",
								},
							})}
						>
							{(() => {
								if (!connected) {
									return (
										<button
											className={`${group}__right-button`}
											onClick={openConnectModal}
											type="button"
										>
											connect
										</button>
									);
								}

								if (chain.unsupported) {
									setIsNetworkValid(false);
									return (
										<button
											className={`${group}__right-button`}
											onClick={openChainModal}
											type="button"
											style={{
												width: "11rem",
											}}
										>
											wrong network
										</button>
									);
								}

								return (
									<button
										className={`${group}__right-button`}
										onClick={openAccountModal}
										type="button"
									>
										{setIsNetworkValid(true)}
										{account.displayName}
										{account.displayBalance
											? ` (${account.displayBalance})`
											: ""}
									</button>
								);
							})()}
						</span>
					);
				}}
			</ConnectButton.Custom>
		</>
	);
}
