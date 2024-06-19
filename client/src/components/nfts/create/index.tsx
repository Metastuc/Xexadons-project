"use client";

import "./index.scss";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, MouseEvent, useCallback, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

import { getUserCollections } from "@/api";
import { Close, ModalSearch, Polygon } from "@/assets";
import { NextOptimizedImage } from "@/components/reusable";
import { commonProps, UserCollection } from "@/types";
import { contentWrapper } from "@/views";

type SelectCollectionModalProps = commonProps & {
	onClose: () => void;
};

export function Create({ group }: commonProps) {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const toggleModal = useCallback(() => {
		setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
	}, []);

	return (
		<section className={group}>
			<h2>create</h2>

			<p>~ deposit both tokens & NFTs to create a pool, earn trading fees</p>

			<div className={`${group}__content`}>
				<h3>Create new pool</h3>

				<div className={`${group}__content-top`}>
					{contentWrapper({
						children: (
							<button onClick={toggleModal}>
								<span></span>

								<p>
									<span>Select a collection</span>
									<i>
										<svg
											width={14}
											height={7}
											viewBox="0 0 14 7"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M12.833 1.125L7 5.875l-5.833-4.75"
												stroke="#fff"
												strokeOpacity={0.8}
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</i>
								</p>

								{isModalOpen && (
									<SelectCollectionModal
										group={group}
										onClose={toggleModal}
									/>
								)}
							</button>
						),
					})}
				</div>

				<div className={`${group}__content-bottom`}>
					{contentWrapper({
						children: (
							<>
								<span>token amount</span>

								<div>
									<span>0.00</span>

									<div>
										<i>{Polygon()}</i>
										<span>polygon</span>
									</div>
								</div>
							</>
						),
					})}
				</div>
			</div>

			<p>~ select collection and input token amount to set up your pool</p>
		</section>
	);
}

function SelectCollectionModal({ group, onClose }: SelectCollectionModalProps) {
	const { chainId, address } = useAccount();
	const { openConnectModal } = useConnectModal();

	function stopPropagation(event: MouseEvent): void {
		event.stopPropagation();
	}

	const [searchQuery, setSearchQuery] = useState<string>("");

	const fetchCollections = async () => {
		switch (true) {
			case chainId !== undefined && address !== undefined:
				const collections = await getUserCollections(chainId, address);
				return collections;

			case chainId === undefined || address === undefined:
				toast.error("Please connect your wallet");
				openConnectModal && (await openConnectModal());
				break;
		}
	};

	const {
		data: userCollections = [],
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["collections", chainId, address],
		queryFn: fetchCollections,
	});

	let filteredCollections: UserCollection[] = [];

	switch (Array.isArray(userCollections)) {
		case true:
			filteredCollections = userCollections.filter((collection: UserCollection) =>
				collection.name.toLowerCase().includes(searchQuery.toLowerCase()),
			);
			break;

		case false:
			filteredCollections = [];
			break;
	}

	if (isLoading) {
		return (
			<section className={`${group}__modal flex items-center justify-center`}>
				Loading...
			</section>
		);
	}

	if (isError) {
		return (
			<section className={`${group}__modal flex items-center justify-center`}>
				{chainId === undefined || address === undefined ? (
					<p>please connect your wallet</p>
				) : (
					<p>{error.toString()}</p>
				)}
			</section>
		);
	}

	return (
		<section
			className={`${group}__modal`}
			onClick={stopPropagation}
		>
			<div className={`${group}__modal-top`}>
				<h3>Select Collection</h3>

				<i
					onClick={onClose}
					className="cursor-pointer"
				>
					<Close />
				</i>
			</div>

			<div className={`${group}__modal-bottom`}>
				<div>
					<i>
						<ModalSearch />
					</i>
					<input
						type="text"
						onChange={(event: ChangeEvent<HTMLInputElement>) => {
							setSearchQuery(event.target.value);
						}}
						placeholder="Search by name or symbol"
						value={searchQuery}
					/>
				</div>

				<div className="space-y-4">
					{filteredCollections.length === 0 ? (
						<p>No collections found</p>
					) : (
						filteredCollections.map((collection, index) => {
							return (
								<article key={index}>
									<span>
										<NextOptimizedImage
											src={collection.image}
											alt={collection.name}
										/>
									</span>
									<span>{collection.name}</span>
								</article>
							);
						})
					)}
				</div>
			</div>
		</section>
	);
}
