"use client"
import { Popover, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Icon } from "@iconify/react";
import CartItem from "./cartItem";
import Image from "next/image";
import { cartItem } from "@/data/nftData";
import Button from "./button";

export default function Cart() {
    const [hovered, setHovered] = useState(false);

    return (
        <Popover className="relative">
            {({ close }) => (
                <>
                    <Popover.Button className="px-4 h-[3rem] border border-primary-blue rounded-3xl text-primary-blue relative">
                        <div className="flex justify-center items-center w-4 h-4 absolute top-1 -right-1 text-xs bg-primary-blue rounded-xl text-white">
                            <p>3</p>
                        </div>
                        <Icon
                            icon="solar:cart-linear"
                            className="text-primary-blue"
                        />
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-50"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute z-30 right-0 top-24 h-fit outline-none">
                            <div className="w-[27rem] rounded-3xl border border-gray bg-main shadow-md">
                                <div className="flex justify-between p-4 border-b border-b-white/20">
                                    <div className="flex items-center gap-2">
                                        <span>Cart</span>
                                        <span>
                                            <Icon icon="solar:cart-linear" />
                                        </span>
                                    </div>
                                    <button onClick={() => close()}>
                                        <Icon icon="material-symbols:close" />
                                    </button>
                                </div>
                                <div className="py-5 px-4">
                                    <h4 className="text-white/80 mb-6">
                                        Items added for checkout
                                    </h4>
                                    <ul className="my-10">
                                        {cartItem.map((item) => (
                                            <CartItem
                                                details={item}
                                                key={item.id}
                                            />
                                        ))}
                                    </ul>
                                    <div className="border border-gray border-dashed rounded-2xl p-6 bg-white/5">
                                        <div className="flex justify-between">
                                            <p>You Pay</p>
                                            <div className="w-fit ml-auto flex items-center gap-2 mb-5">
                                                <div
                                                    className="rounded-full h-fit w-fit relative overflow-hidden"
                                                >
                                                    <Image
                                                        src="/matic.png"
                                                        width="20"
                                                        height="20"
                                                        alt="Nft image"
                                                    />
                                                    {hovered && (
                                                        <div className="w-full h-full flex items-center z-40 absolute top-0 left-0 justify-center bg-black/40">
                                                            <button>
                                                                <Icon icon="tabler:trash" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <span>2000 matic</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-white/60 mb-5">
                                            ~you are about to swap 690matic for
                                            3 xexadons, click buy to execute
                                        </p>
                                        <div className="w-fit mx-auto">
                                            <Button text="Buy" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}
