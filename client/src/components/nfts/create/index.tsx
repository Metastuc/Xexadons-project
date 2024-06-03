"use client";

import "./index.scss";

import { ChangeEvent, useState, useEffect } from "react";
import { Polygon, BSC, Xexadons } from "@/assets";
import { commonProps } from "@/types";
import { contentWrapper } from "@/views";
import { JsonRpcSigner } from 'ethers';
import { ContextWrapper } from "@/hooks";
import { createPool, getChain } from "@/utils/app";

type createProps = commonProps & {
    activeTab: string;
    currentPool: string;
    handleTabClick: Function;
    signer: JsonRpcSigner | undefined;
    userAddress: string;
    _chainId: number;
};

export function Create({ group, signer, userAddress, _chainId }: createProps) {
	const {
		nftContext: { createAmount, setCreateAmount, selectedNFTs, nftAddress, setNftAddress },
	} = ContextWrapper();

	function handleAmountInput(event: ChangeEvent<HTMLInputElement>) {
		const inputValue = event.target.value.replace(/[^0-9.]/g, "");
	
		const parsedValue = inputValue === "" ? 0 : parseFloat(inputValue);
	
		setCreateAmount(parsedValue < 0.1 ? 0.1 : parsedValue);
	}

	const chain = getChain(_chainId);

	// call to create pool
	const create = async() => {
		await createPool(selectedNFTs, createAmount, nftAddress, _chainId, signer);
		console.log("pool created");
	}

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
                                <span>{Xexadons()}</span>

                                <p>
                                    <span>Xexadons</span>
                                    {/* <i>icon</i> */}
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
                                    <span>
									<input
										type="text"
										value={createAmount!}
										onChange={handleAmountInput}
									/>
									</span>
									
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
                                        <span>{chain}</span>
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
