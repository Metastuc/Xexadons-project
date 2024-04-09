"use client"
import { useEffect, useState } from "react";

export default function BlurLayout() { 

    return (
        <div className="w-full relative">
            <div class="absolute top-0 -left-10 w-72 h-72 bg-[#665977] rounded-full filter blur-xl opacity-10 animate-blob"></div>
            <div class="absolute top-20 -right-10 w-72 h-72 bg-[#665977] rounded-full filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
            <div class="absolute top-48 left-20 w-72 h-72 bg-[#665977] rounded-full filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>
    );
}