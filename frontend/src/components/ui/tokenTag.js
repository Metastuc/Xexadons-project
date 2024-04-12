import Image from "next/image";

export default function TokenTag({ src }) {
    return (
        <div className="bg-white/25 rounded-3xl h-[2.5rem] flex items-center gap-3 px-4">
            <Image src={src} width="30" height="30" alt="Token icon" />
            <p>Polygon</p>
        </div>
    )
}