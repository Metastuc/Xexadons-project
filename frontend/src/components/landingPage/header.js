"use client"
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full py-20">
            <div className="w-full container flex justify-between mx-auto px-20">
                <div className="">
                    <h1 className="font-semibold text-[80px]">xexadons</h1>
                    <h2 className="text-[80px] -mt-4">nft Marketplace</h2>
                    <p className="w-[25rem] mb-14">
                        Xexadons are sentient dinosaur-like creatures and are
                        part of the society that revealed a formula that can
                        transform time into a resource, known as XEX
                    </p>

                    {/* Enter application */}
                    <Link href="/main" className="flex items-center ">
                        <button className="peer bg-primary-blue h-[3rem] px-10 rounded-3xl">
                            enter app
                        </button>
                        <span className="bg-primary-blue rounded-full h-[3rem] w-[3rem] flex items-center justify-center">
                            <Icon icon="ic:round-arrow-outward" />
                        </span>
                    </Link>

                    <div className="text-xl mt-8">
                        <p className="mb-4">common---rare</p>
                        <p className="mb-4 ml-6">legendary---mythic</p>
                    </div>
                </div>
                <div className="-mr-32 -mt-16">
                    <Image
                        src="/headerImage.png"
                        width="600"
                        height="500"
                        alt="Dinosaurs"
                    />
                </div>
            </div>
        </header>
    );
}