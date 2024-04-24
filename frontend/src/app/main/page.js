"use client"
import Buy from "@/components/main/buy";
import Nft from "@/components/main/nft";
import Pool from "@/components/main/pool";
import Sell from "@/components/main/sell";
import Button from "@/components/ui/button";
import Tabs from "@/components/ui/tabs";
import TokenTag from "@/components/ui/tokenTag";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

export default function MainPage() {

    const [ activeTab, setActiveTab ] = useState(0);

    const tabOptions = ["Buy", "Sell", "Pool"];

    return (
        <div className="w-full flex justify-center items-center container mx-auto px-20 py-24">
            <div className="gradient-border-bg p-8 flex gap-6 rounded-lg w-full">
                <div className="rounded-xl p-6 w-1/2 border bg-white/5">
                    <div className="w-fit ml-auto mb-8">
                        <Tabs
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            options={tabOptions}
                        />
                    </div>
                    {
                        activeTab === 0 
                        ? <Buy />
                        : activeTab === 1
                        ? <Sell />
                        : activeTab === 2
                        ? <Pool />
                        : null
                    }
                </div>

                <div className="w-1/2">
                    <Nft />
                </div>
            </div>
        </div>
    );
}