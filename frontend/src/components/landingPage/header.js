"use client"
import { Icon } from "@iconify/react";

export default function Header() {
    return (
        <header className="w-full py-20">
            <div className="w-full container mx-auto px-20">
                <div className="">
                    <h1 className="font-semibold text-[80px]">xexadons</h1>
                    <h2 className="text-[80px] -mt-4">nft Marketplace</h2>
                    <p className="w-[25rem] mb-14">
                        Xexadons are sentient dinosaur-like creatures and are
                        part of the society that revealed a formula that can
                        transform time into a resource, known as XEX
                    </p>

                    {/* Enter application */}
                    <div className="flex items-center">
                        <button className="peer bg-primary-blue px-10 h-[3rem] rounded-3xl">
                            enter app
                        </button>
                        <div className="bg-primary-blue rounded-full h-[3rem] w-[3rem] flex items-center justify-center">
                            <Icon icon="ic:round-arrow-outward" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}