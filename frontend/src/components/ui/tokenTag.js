import Image from "next/image";

export default function TokenTag({ src, text }) {
    return (
        <div className="bg-white/25 rounded-3xl h-[2.5rem] flex items-center gap-3 px-4">
            <img src={src} width="30" height="30" alt="Token icon" />
            <p>{text}</p>
        </div>
    )
}