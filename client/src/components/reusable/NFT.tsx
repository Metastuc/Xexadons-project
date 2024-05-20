"use client";

// import { NFTprops } from "@/types";
import { useState } from "react";

import { NFTChecked, NFTNotChecked, Polygon } from "@/assets";

// export function NFT({ address, id, name, poolAddress, src }: NFTprops) {
export function NFT() {
	const [isChecked, setIsChecked] = useState<boolean>(false);

	return (
		<article>
			<span>image</span>

			<section>
				<span>id</span>

				<div>
					<span>name</span>
					<span>id</span>
				</div>

				<div>
					<div>
						<i>
							<Polygon />
						</i>
						<span>price</span>
					</div>

					<div onClick={() => setIsChecked(!isChecked)}>
						{isChecked ? (
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
