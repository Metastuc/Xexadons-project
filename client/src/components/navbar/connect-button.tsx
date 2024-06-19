import { ConnectButton } from "@rainbow-me/rainbowkit";

// import { ContextWrapper } from "@/hooks";
import { commonProps } from "@/types";

import { RenderConnectedUI } from "./render-connected-button";

type renderConnectProps = commonProps & {
	openConnectModal: () => void | undefined;
};

type renderInvalidNetworkProps = commonProps & {
	openChainModal: () => void | undefined;
};

export function Web3ConnectButton({ group }: commonProps) {
	// const {
	// 	navContext: { setIsNetworkValid },
	// } = ContextWrapper();

	return (
		<>
			<ConnectButton.Custom>
				{({
					account,
					chain,
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
									return renderConnectPrompt({
										openConnectModal,
										group,
									});
								}

								if (chain.unsupported) {
									return renderInvalidNetworkPrompt({
										openChainModal,
										group,
									});
								}

								return (
									<RenderConnectedUI
										account={account}
										group={group}
									/>
								);
							})()}
						</span>
					);
				}}
			</ConnectButton.Custom>
		</>
	);
}

function renderConnectPrompt({ openConnectModal, group }: renderConnectProps) {
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

function renderInvalidNetworkPrompt({
	openChainModal,
	group,
}: renderInvalidNetworkProps) {
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
