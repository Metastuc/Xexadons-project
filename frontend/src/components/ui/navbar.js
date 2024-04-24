"use client"
import { Icon } from "@iconify/react";
import Link from "next/link";
import PrimaryButton from "./primaryButton";
import Cart from "./cart";

export default function Navbar() {
    return (
        <div className="py-5 flex items-center justify-between container mx-auto px-20">
            <nav>
                <ul className="text-white text-lg flex items-center space-x-12">
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/discover">Discover</Link>
                    </li>
                    <li>
                        <Link href="/collections">Collections</Link>
                    </li>
                </ul>
            </nav>

            <div className="flex items-center space-x-8">
                <div className="w-[13rem] h-[3rem] relative">
                    <Icon
                        icon="iconamoon:search"
                        className="absolute top-1/2 text-primary-blue -translate-y-1/2 left-2"
                        height="24"
                        width="24"
                    />
                    <input
                        type="text"
                        placeholder="search collections"
                        className="w-full h-full placeholder:text-primary-blue text-primary-blue rounded-3xl border pl-10 border-primary-blue bg-inherit outline-none"
                    />
                </div>

                {/* Enter application */}
                <PrimaryButton text="enter app" />

                {/* Connect wallet */}
                <PrimaryButton text="connect wallet" />

                <Cart />
            </div>
        </div>
    );
}