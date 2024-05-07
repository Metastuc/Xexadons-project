"use client";

import "./index.scss";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Cart, Search } from "@/assets";
import {
	LeftNavigationLinks,
	RightNavigationButton,
	Web3ConnectButton,
} from "@/components";
import { ContextWrapper } from "@/hooks";
import { commonProps } from "@/types";

type handleEnterAppButtonUIProps = commonProps & {
	pathname: string;
	router: any;
};

export function NavigationBar({ group }: commonProps) {
	const router = useRouter();
	const pathname = usePathname();
	const {
		navContext: { isNetworkValid },
	} = ContextWrapper();

	const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

	return (
		<>
			<section
				className={`${group}__wrapper`}
				data-group={`wrapper`}
			>
				<LeftNavigationLinks group={group} />

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

					{handleEnterAppButtonUI({
						pathname,
						router,
						group,
					})}

					<Web3ConnectButton group={group} />

					<RightNavigationButton
						group={group}
						content={Cart()}
						clickAction={() => setIsCartOpen(!isCartOpen)}
					/>
				</div>
			</section>
		</>
	);
}

function handleEnterAppButtonUI({
	pathname,
	group,
	router,
}: handleEnterAppButtonUIProps) {
	/*eslint indent: ["error", tab, { "SwitchCase": 1 }]*/
	switch (pathname === "/") {
		case true:
			return (
				<>
					<RightNavigationButton
						group={group}
						content={"enter app"}
						clickAction={() => router.push("/nfts")}
					/>
				</>
			);

		case false:
			return <>sumn</>;
	}
}
