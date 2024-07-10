"use client";

import "./index.scss";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, MouseEvent, useCallback, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

import { getUserCollections, getUserCollectionsNFTs } from "@/api";
import { Close, DropDown, ModalSearch, Polygon } from "@/assets";
import { NextOptimizedImage } from "@/components/reusable";
import { ContextWrapper } from "@/hooks";
import { commonProps, Pool, UserCollection } from "@/types";
import { contentWrapper } from "@/views";

type SelectCollectionModalProps = commonProps & {
	onClose: () => void;
	// eslint-disable-next-line no-unused-vars
	onSelect: (pool: Pool) => void;
	// eslint-disable-next-line no-unused-vars
	onSelectCollection: (address: string) => void;
};

export function Create({ group }: commonProps) {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const [selectedPool, setSelectedPool] = useState<any | null>(null);

	const [tokenAmount, setTokenAmount] = useState<string>("0.00");

	const toggleModal = useCallback(() => {
		setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
	}, []);

	const {
		nftContext: { selectedNFTs, setUserCollectionAddress },
	} = ContextWrapper();

	function handleTokenAmount(event: ChangeEvent<HTMLInputElement>) {
		// const inputValue = event.target.value.replace(/\D/g, "");
		// const numericValue = inputValue === "" ? null : Number(inputValue);
		// setTokenAmount(numericValue);
		let inputValue = event.target.value;

		// Allow empty input to clear the field
		if (inputValue === "") {
			setTokenAmount("");
			return;
		}

		// Validate the input to allow only numbers and up to two decimal places
		const isValid = /^[0-9]*\.?[0-9]{0,2}$/.test(inputValue);

		if (isValid) {
			if (inputValue.startsWith(".")) {
				inputValue = "0" + inputValue; // Ensure input like '.5' is treated as '0.5'
			}

			// let numericValue = parseFloat(inputValue);

			// // Ensure numericValue does not exceed 100
			// if (numericValue > 100) {
			// 	numericValue = 100;
			// 	setTokenAmount(numericValue.toString());
			// } else {
			// 	setTokenAmount(inputValue);
			// }
		}
	}

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
								<span>
									{selectedPool && typeof selectedPool === "object" ? (
										<NextOptimizedImage
											src={selectedPool.NFTs[0].src}
											group="opacity-[40%] rounded-[1rem]"
											alt={selectedPool.NFTs[0].name}
										/>
									) : (
										<></>
									)}
								</span>

								<p>
									<span>
										{selectedPool &&
										typeof selectedPool === "object" ? (
												<span>{selectedPool.NFTs[0].name}</span>
											) : (
												<span>Select a collection</span>
											)}
									</span>
									<i>
										<DropDown color="#fff" />
									</i>
								</p>

								{isModalOpen && (
									<SelectCollectionModal
										group={group}
										onClose={toggleModal}
										onSelect={(pool: Pool) => {
											setSelectedPool(pool);
										}}
										onSelectCollection={setUserCollectionAddress}
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
									{selectedPool ? (
										<input
											type="text"
											placeholder="0.00"
											value={tokenAmount}
											onChange={handleTokenAmount}
										/>
									) : (
										<span>0.00</span>
									)}

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

			{true ? (
				<PoolSelected
					selectedPool={selectedPool}
					selectedNFTs={selectedNFTs}
					tokenAmount={tokenAmount}
				/>
			) : (
				<p>~ select collection and input token amount to set up your pool</p>
			)}
		</section>
	);
}

function SelectCollectionModal({
	group,
	onClose,
	onSelect,
	onSelectCollection,
}: SelectCollectionModalProps) {
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
							async function handleClick(collectionAddress: string) {
								onSelectCollection(collectionAddress);

								const result = await getUserCollectionsNFTs(
									"create",
									chainId || 0,
									collectionAddress,
									address as `0x${string}`,
								);

								onSelect(result);
								onClose();
							}

							return (
								<article
									key={index}
									onClick={() => {
										handleClick(collection.address);
									}}
								>
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

function PoolSelected({
	selectedPool,
	selectedNFTs,
	tokenAmount,
}: {
	selectedPool: any;
	selectedNFTs: any[];
	tokenAmount: string;
}) {
	console.log(selectedPool);

	const [feeAmount, setFeeAmount] = useState<string>("0");

	function handleFeeAmount(event: ChangeEvent<HTMLInputElement>) {
		let inputValue = event.target.value;

		if (inputValue === "") {
			setFeeAmount("");
			return;
		}

		const isValid = /^[0-9]*\.?[0-9]{0,2}$/.test(inputValue);

		if (isValid) {
			if (inputValue.startsWith(".")) {
				inputValue = "0" + inputValue;
			}

			let numericValue = parseFloat(inputValue);

			if (numericValue > 100) {
				numericValue = 100;
				setFeeAmount(numericValue.toString());
			} else {
				setFeeAmount(inputValue);
			}
		}
	}

	return (
		<section className="space-y-4">
			<div className="flex items-center justify-between">
				<span>Fee</span>

				{contentWrapper({
					children: (
						<div className="flex items-center justify-center gap-1 px-5 size-full">
							<input
								type="text"
								value={feeAmount}
								className="w-[90%] h-full px-1"
								onChange={handleFeeAmount}
							/>
							<span>%</span>
						</div>
					),
				})}
			</div>

			{contentWrapper({
				children: (
					<div>
						{/* eslint-disable-next-line react/no-unescaped-entities */}
						<p>~you are about to create a new pool by adding token & NFT</p>

						<div>
							<i></i>
							<i></i>
						</div>

						<p>
							{selectedNFTs.length} xexadons & {tokenAmount} matic
						</p>
						<p>
							~deposit {selectedNFTs.length} xexadons and {tokenAmount}matic
							to create pool
						</p>

						<button>
							<span>Proceed</span>
						</button>
					</div>
				),
			})}
		</section>
	);
}
