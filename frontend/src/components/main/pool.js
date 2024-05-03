"use client"
import { useState, useEffect } from "react";
import Tabs from "../ui/tabs";
import Deposit from "./deposit";

export default function Pool({ setPoolTab }) {

    const [activeTab, setActiveTab] = useState(0);
    const [pool, setPool] = useState(0);

    const tabOptions = ["Deposit", "Withdraw"];

    useEffect(() => {
        setPoolTab(activeTab)
    }, [activeTab]);

    return (
        <div>
            <h3 className="mb-6">Liquidity</h3>
            <div className="w-fit mb-8">  
                <Tabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    setPool={setPool}
                    options={tabOptions}
                />
            </div>
            
            {activeTab === 0 ? <Deposit /> : <p>withdraw</p>}
        </div>
    );
}