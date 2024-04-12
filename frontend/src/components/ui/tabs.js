"use client";
import { usePathname, useRouter } from "next/navigation";

/*
    The tabs component takes in four props namely: 
    -- link: a boolean value to specify if the Tabs components is a link or just a state modifier (defaults to `false`)

    -- options: an array of strings which are options to be displayed in the tab component. The data structure is outlined below:

    if `link` === true
    options = [
        {
            title: "Title 1",
            href: "/link/to/title1"
        },
        {
            title: "Title 2",
            href: "/link/to/title2"
        },
    ]

    if `link` === false
    options = ["Title 1", "Title 2"]
    
    -- setActiveTab: active tab modifier function passed in as a prop from the parent component
    -- activeTab: current active tab from parent component
    -- maxWidth: boolean to determine if the width of the tab should span entire screen width
*/
export default function Tabs({
    link = false,
    options,
    setActiveTab,
    activeTab
}) {
    const pathname = usePathname();

    // Next JS router hook
    const router = useRouter();

    return (
        <div className="h-[3rem] bg-hr-slight-gray rounded-md w-full">
            {link ? (
                <ul className="flex items-center gap-3 p-1 rounded-3xl border h-[3rem]">
                    {options.map((option, id) => (
                        <li
                            key={id}
                            className={`${
                                pathname === option.href
                                    ? "bg-[#196A87]/10 font-medium border"
                                    : "font-normal"
                            } transition-all duration-200 ease-linear text-nowrap h-full px-5 rounded-3xl`}
                        >
                            <button
                                className="h-full w-full"
                                onClick={() => router.push(option.href)}
                            >
                                {option.title}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <ul
                    className={`flex items-center gap-3 p-1 rounded-3xl border h-[3rem]`}
                >
                    {options.map((option, id) => (
                        <li
                            key={id}
                            className={`${
                                activeTab === id
                                    ? "bg-[#196A87]/10 font-medium border"
                                    : "font-normal"
                            } transition-all duration-200 ease-linear text-nowrap h-full px-5 rounded-3xl`}
                        >
                            <button
                                className="w-full h-full"
                                type="button"
                                onClick={() => setActiveTab(id)}
                            >
                                {option}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
