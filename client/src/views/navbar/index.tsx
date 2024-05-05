"use client";

import "./index.scss";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Cart, Search } from "@/assets";
import {
	LeftNavigationLinks,
	RightNavigationButton,
	SignedOutConnectButton,
} from "@/components";
import { commonProps } from "@/types";

export function NavigationBar({ group }: commonProps) {
	const router = useRouter();
	const [isNetworkValid, setIsNetworkValid] = useState<boolean>(true);
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

					<RightNavigationButton
						group={group}
						content={"enter app"}
						clickAction={() => router.push("/nfts")}
					/>

					<SignedOutConnectButton
						group={group}
						setIsNetworkValid={setIsNetworkValid}
					/>

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
