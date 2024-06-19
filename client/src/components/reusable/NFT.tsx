import { BNB, NFTChecked, NFTNotChecked, Polygon } from "@/assets";

import { NextOptimizedImage } from "./image";

export function NFT({
	id,
	isSelected,
	onSelect,
	imageUrl,
	nftId,
	name,
	price,
	chainId,
}: any) {
	return (
		<article>
			<NextOptimizedImage
				src={imageUrl}
				alt=""
				group="rounded-xl"
			/>

			<section>
				<span>#{nftId}</span>

				<div>
					<span>{name}</span>
					<span>{nftId}</span>
				</div>

				<div>
					<div>
						{chainId === 97 ? (
							<>
								<i>
									<BNB />
								</i>
							</>
						) : chainId === 80002 ? (
							<>
								<i>
									{" "}
									<Polygon />{" "}
								</i>
							</>
						) : (
							<i>
								<Polygon />
							</i>
						)}
						<span>{price}</span>
					</div>
					<div onClick={() => onSelect(id)}>
						{isSelected ? (
							<>
								<i>
									<NFTChecked />
								</i>
							</>
						) : (
							<>
								<i>
									<NFTNotChecked />
								</i>
							</>
						)}
					</div>
				</div>
			</section>
		</article>
	);
}
