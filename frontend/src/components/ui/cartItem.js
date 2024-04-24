import Image from "next/image";

export default function CartItem({ details }) {
    return (
        <div className="flex items-center">
            <Image
            
                src={details.src}
                alt={details.name}
                width="130"
                height="130"
                className="rounded-2xl mb-4"
            />
            <div className="ml-3">
                <p>{details.name}</p>
                <p>{details.id}</p>
            </div>
            <div className="w-fit ml-auto flex items-center gap-2">
                <Image
                    src="/matic.png"
                    width="20"
                    height="20"
                    alt="Token icon"
                />
                <span>{details.price} matic</span>
            </div>
        </div>
    );
}