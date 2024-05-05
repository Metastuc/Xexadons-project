import { ConnectButton } from "@rainbow-me/rainbowkit";

import { commonProps } from "@/types";

type ConnectButtonProps = commonProps & {
	setIsNetworkValid: Function;
};

export function SignedOutConnectButton({
	group,
	setIsNetworkValid,
}: ConnectButtonProps) {
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
