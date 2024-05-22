"use client";

import "./index.scss";

import { ChangeEvent, MouseEvent, useCallback, useState } from "react";

import { Close, Polygon } from "@/assets";
import { NextOptimizedImage } from "@/components/reusable";
import { commonProps } from "@/types";
import { contentWrapper } from "@/views";

type SelectCollectionModalProps = commonProps & {
	onClose: () => void;
};

export function Create({ group }: commonProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	console.log({ isModalOpen });

	const toggleModal = useCallback(() => {
		setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
	}, []);

	return (
		<section className={group}>
			<h2>create</h2>

			<p>
				~ deposit both tokens & NFTs to create a pool, earn trading fees
			</p>

			<div className={`${group}__content`}>
				<h3>Create new pool</h3>

				<div className={`${group}__content-top`}>
					{contentWrapper({
						children: (
							<button onClick={toggleModal}>
								<span>image</span>

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

			<p>
				~ select collection and input token amount to set up your pool
			</p>
		</section>
	);
}

function SelectCollectionModal({ group, onClose }: SelectCollectionModalProps) {
	function stopPropagation(event: MouseEvent): void {
		event.stopPropagation();
	}
	const [searchQuery, setSearchQuery] = useState<string>("");

	const collections = [
		{ id: 1, image: "/image1.png", title: "Collection 1" },
		{ id: 2, image: "/image2.png", title: "Collection 2" },
	];

	const filteredCollections = collections.filter((collection) =>
		collection.title.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<section
			className={`${group}__modal`}
			onClick={stopPropagation}
		>
			<div className={`${group}__modal-top`}>
				<h3>Select Collection</h3>

				<i onClick={onClose}>
					<Close />
				</i>
			</div>

			<div className={`${group}__modal-bottom`}>
				<div>
					<i>
						<svg
							width={17}
							height={17}
							viewBox="0 0 17 17"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g
								clipPath="url(#clip0_24_7097)"
								stroke="#F1F2F2"
								strokeOpacity={0.58}
							>
								<circle
									cx={8.14567}
									cy={8.14585}
									r={6.72917}
								/>
								<path
									d="M14.166 14.167l1.417 1.416"
									strokeLinecap="round"
								/>
							</g>
							<defs>
								<clipPath id="clip0_24_7097">
									<path
										fill="#fff"
										d="M0 0H17V17H0z"
									/>
								</clipPath>
							</defs>
						</svg>
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

				<div>
					{filteredCollections.map((collection, index) => {
						return (
							<>
								<article key={index}>
									<span>
										<NextOptimizedImage
											src={collection.image}
											alt={collection.title}
										/>
									</span>
									<span>{collection.title}</span>
								</article>
							</>
						);
					})}
				</div>
			</div>
		</section>
	);
}
