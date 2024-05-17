import "./index.scss";

import { Polygon } from "@/assets";
import { commonProps } from "@/types";
import { contentWrapper } from "@/views";
export function Create({ group }: commonProps) {
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
