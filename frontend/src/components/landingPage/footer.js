"use client"
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="py-24 flex items-center justify-center">
            <div className="w-fit">
                <ul className="grid grid-cols-3">
                    <li className="text-lufga text-2xl">
                        <Link href="/">About</Link>
                    </li>
                    <li className="text-lufga text-2xl">
                        <Link href="/">Media</Link>
                    </li>
                    <li className="text-lufga text-2xl">
                        <Link href="/">Ecosystem</Link>
                    </li>
                    <li className="text-lufga text-2xl">
                        <Link href="/">Contact</Link>
                    </li>
                    <li className="text-lufga text-2xl">
                        <Link href="/">Terms of Use</Link>
                    </li>
                    <li className="text-lufga text-2xl">
                        <Link href="/">Documentation</Link>
                    </li>
                </ul>

                <div className="mt-7 flex space-x-6 item-center w-fit mx-auto">
                    <a href="#">
                        <Icon icon="pajamas:twitter" height="26" width="26" />
                    </a>
                    <a href="#">
                        <Icon icon="pajamas:discord" height="26" width="26" />
                    </a>
                </div>
            </div>
        </footer>
    );
}