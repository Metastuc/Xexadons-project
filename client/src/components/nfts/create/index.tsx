import "./index.scss";

import { Polygon, BSC } from "@/assets";
import { commonProps } from "@/types";
import { contentWrapper } from "@/views";
import { JsonRpcSigner } from 'ethers';

type createProps = commonProps & {
	activeTab: string;
	currentPool: string;
	handleTabClick: Function;
	signer: JsonRpcSigner | undefined;
	userAddress: string;
	_chainId: number;
};

export function Create({ group, signer, userAddress, _chainId }: createProps) {
	
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
							<>
								<span>image</span>

								<p>
									<span>Select a collection</span>
									<i>icon</i>
								</p>
							</>
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
										<i>{_chainId === 97 ? (
											<>
											<i>{BSC()}</i>
											</>
										) : _chainId === 80002 ? (
											<>
											<i>{Polygon()}</i>
											</>
										) : (
											<span>Wrong Network</span>
										)}</i>
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
