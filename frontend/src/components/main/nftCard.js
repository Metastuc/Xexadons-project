import Image from "next/image";

export default function NftCard({ details }) {
    return (
        <div className="border rounded-2xl border-grey p-3 text-xs">
            <Image src={details.src} alt={details.name} width="190" height="190" className="rounded-2xl mb-4" />
            <p>{details.id}</p>
            <p className="font-medium my-2">{details.name}</p>
            <div className="flex justify-between">
                <p>{details.price}</p>
                <input type="checkbox" />
            </div>
        </div>
    )
}