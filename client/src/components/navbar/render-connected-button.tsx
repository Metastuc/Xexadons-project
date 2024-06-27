"use client";

import { useEffect, useRef, useState } from "react";
import { useDisconnect } from "wagmi";

import { DropDown } from "@/assets";
import { commonProps } from "@/types";

import { NextOptimizedImage } from "../reusable";

type renderConnectedUIProps = commonProps & {
	account: any;
};

export function RenderConnectedUI({ account, group }: renderConnectedUIProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { disconnect } = useDisconnect();
	const dropDownRef = useRef<HTMLUListElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	function handleToggle() {
		setIsOpen(!isOpen);
	}

	function handleClickOutside(event: MouseEvent) {
		if (
			dropDownRef.current &&
			!(dropDownRef.current as HTMLElement).contains(event.target as Node) &&
			event.target !== buttonRef.current
		) {
			setIsOpen(false);
		}
	}

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<>
			<button
				className={`${group}__right-button relative`}
				style={{
					width: "12.25rem",
					gap: ".75rem",
				}}
				onClick={handleToggle}
				ref={buttonRef}
			>
				<span>
					<NextOptimizedImage
						src="/pf-icon.png"
						alt="profile-icon"
					/>
				</span>

				<span>{account.displayName}</span>
				{isOpen ? (
					<i className="rotate-180">
						<DropDown />
					</i>
				) : (
					<i>
						<DropDown />
					</i>
				)}
			</button>

			{isOpen && (
				<ul
					ref={dropDownRef}
					className="absolute top-[90%] border border-[#15BFFD] w-[13.375rem] rounded-[2rem] py-9 px-5 bg-[#1B111E] space-y-8"
				>
					<li className="cursor-pointer">My Pools</li>
					<li className="cursor-pointer">My Nfts</li>
					<li
						onClick={() => disconnect()}
						className="cursor-pointer"
					>
						Disconnect wallet
					</li>
				</ul>
			)}
		</>
	);
}
