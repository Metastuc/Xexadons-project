// import { NFTprops } from "@/types";

import { NFTChecked, NFTNotChecked, Polygon } from "@/assets";

// export function NFT({ address, id, name, poolAddress, src }: NFTprops) {
export function NFT({ id, isSelected, onSelect, imageUrl, nftId, name, price }: any) {
	return (
		<article>
			<img src={imageUrl} alt="" />

			<section>
				<span>#{nftId}</span>

				<div>
					<span>{name}</span>
					<span>{nftId}</span>
				</div>

				<div>
					<div>
						<i>
							<Polygon />
						</i>
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
