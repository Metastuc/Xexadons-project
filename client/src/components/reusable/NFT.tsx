// import { NFTprops } from "@/types";

import { NFTChecked, NFTNotChecked, Polygon, BSC } from "@/assets";

// export function NFT({ address, id, name, poolAddress, src }: NFTprops) {
export function NFT({ id, isSelected, onSelect, imageUrl, nftId, name, price, chainId }: any) {
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
						{chainId === 97 ? (
							<>
							<i><BSC /></i>
							</>
						) : chainId === 80002 ? (
							<>
							<i> <Polygon /> </i>
							</>
						) : (
							<i><Polygon /></i>
						)}
							<span>
								{price}							
							</span>
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
