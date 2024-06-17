"use client";

import "./index.scss";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Cart, chains, DropDown, Search } from "@/assets";
import {
	LeftNavigationLinks,
	RightNavigationButton,
	Web3ConnectButton,
} from "@/components";
import { ContextWrapper } from "@/hooks";
import { Chain, commonProps } from "@/types";

type handleEnterAppButtonUIProps = commonProps & {
	pathname: string;
	router: any;
};

export function NavigationBar({ group }: commonProps) {
	const router = useRouter();
	const pathname = usePathname();
	const windowEl = typeof window !== "undefined" ? window : null;

	const {
		navContext: { isNetworkValid },
	} = ContextWrapper();

	const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
	const [isScrolled, setIsScrolled] = useState<boolean>((windowEl?.scrollY || 0) <= 50);

	useEffect(() => {
		const navBarParent = document.querySelector(".header-navbar") as HTMLElement;

		function handleScroll() {
			if ((windowEl?.scrollY || 0) <= 50) {
				navBarParent?.style.setProperty("background-color", "transparent");

				setIsScrolled(false);
			} else {
				navBarParent?.style.setProperty(
					"background-color",
					// "rgba(27, 17, 30, 0.95)",
					"transparent",
				);

				setIsScrolled(true);
			}
		}

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [isScrolled, windowEl?.scrollY]);

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

					<HandleEnterAppButtonUI
						group={group}
						pathname={pathname}
						router={router}
					/>

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

function HandleEnterAppButtonUI({
	pathname,
	group,
	router,
}: handleEnterAppButtonUIProps) {
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
			return SwitchNetworkButton({ group });
	}
}

function SwitchNetworkButton({ group }: commonProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [network, setNetwork] = useState<Chain>(chains[4]);

	function handleToggle() {
		setIsOpen(!isOpen);
	}

	function handleNetworkChange(selectedChain: Chain) {
		setNetwork(selectedChain);
		setIsOpen(false);
	}

	return (
		<>
			<button
				className={`${group}__right-button !w-[10.25rem] space-x-1 relative`}
				onClick={handleToggle}
			>
				<i>{network.icon()}</i>
				<span>{network.name}</span>
				<span className="flex items-center justify-center">
					{isOpen ? (
						<i className="rotate-180">
							<DropDown />
						</i>
					) : (
						<i>
							<DropDown />
						</i>
					)}
				</span>
			</button>
			{isOpen && (
				<ul className="absolute top-[90%] border border-[#15BFFD] w-[13.375rem] rounded-[2rem] py-9 px-5 bg-[#1B111E] space-y-8">
					{chains.map((chain, index) => (
						<li
							key={index}
							onClick={() => handleNetworkChange(chain)}
							className="flex items-center gap-3"
						>
							<span className="size-8">{chain.icon()}</span>
							<span>{chain.name}</span>
						</li>
					))}
				</ul>
			)}
		</>
	);
}
