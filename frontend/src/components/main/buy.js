"use client"
import Image from "next/image";
import Button from "../ui/button";
import TokenTag from "../ui/tokenTag";
import { Icon } from "@iconify/react";

export default function Buy() {
    return (
        <div>
            <h2 className="text-2xl">Swap</h2>
            <p className="text-[10px] mt-4 mb-16">
                ~ select nft you wish to buy from the collection and proceed to
                swap
            </p>
            <div className="bg-white/5 rounded-xl border-dashed border border-grey mb-5 px-6 py-4 flex justify-between">
                <div className="flex flex-col justify-between">
                    <p>from</p>
                    <div className="my-5">
                        <p className="text-xl">690</p>
                        <p>$800</p>
                    </div>
                    <TokenTag src="/matic.png" />
                </div>
                <div>
                    <Icon icon="octicon:arrow-right-16" />
                </div>
                <div className="flex flex-col justify-between">
                    <p className="text-center">to</p>
                    <div className="my-5">
                        <p className="mt-5 mb-3 text-xl">3 Xexadons</p>
                    </div>
                    <TokenTag src="/xexadons.png" />
                </div>
            </div>

            <div className="bg-white/5 rounded-xl border-dashed border border-grey py-5 flex justify-center">
                <div>
                    <div className="flex items-center space-x-4 mb-6 w-fit mx-auto ">
                        <div className="flex flex-col justify-center items-center">
                            <div className="w-6 h-6 rounded-full border-[5px] border-[#98D076] bg-white"></div>
                            <div className="h-4 border border-dashed" />
                            <div className="w-6 h-6 rounded-full border-[5px] border-[#B06ECF] bg-white"></div>
                        </div>

                        <div>
                            <div className="flex space-x-3 text-xs items-center mb-5">
                                <p>Nft Pool</p>
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500"></div>
                                {/* Replace with wallet addresss */}
                                <p>0x0390535</p>
                            </div>

                            <div className="flex space-x-3 text-xs items-center">
                                <p>Nft Pool</p>
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500"></div>
                                {/* Replace with wallet addresss */}
                                <p>0x989849589</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start mb-5 w-full justify-center space-x-5">
                        <div className="flex flex-col items-center space-y-3">
                            <Image
                                src="/matic.png"
                                width="40"
                                height="40"
                                alt="Token icon"
                            />

                            {/* TODO: replace with actual figures */}
                            <p>690 Matic</p>
                        </div>
                        <div>
                            <Icon
                                icon="ei:arrow-right"
                                width="27"
                                height="27"
                                className="mt-4"
                            />
                        </div>
                        <div className="flex flex-col items-center space-y-3">
                            <Image
                                src="/xexadons.png"
                                width="40"
                                height="40"
                                alt="Token icon"
                            />

                            {/* TODO: replace with actual figures */}
                            <p>3 xexadons</p>
                        </div>
                    </div>

                    <p className="mb-5">~swap 690matic for 3 xexadons</p>
                    <div className="w-fit mx-auto">
                        <Button text="Proceed" />
                    </div>
                </div>
            </div>
        </div>
    );
}