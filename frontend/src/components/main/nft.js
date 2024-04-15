import { nftData } from "@/data/nftData";
import NftCard from "./nftCard";

export default function Nft() {
    return (
        <div className="rounded-xl p-6 border bg-white/5">
            <div className="flex justify-between mb-6">
                <h3 className="text-2xl">Select Nfts</h3>
                <button className="bg-white/35 rounded-2xl items-center flex px-4 space-x-2 h-[2rem]">
                    <p>Pools</p>
                    {/* Replace with actual number of pools */}
                    <p className="h-6 w-6 bg-white text-black rounded-full">
                        5
                    </p>
                </button>
            </div>

            {/* list of available nfts */}
            <div className="grid grid-cols-3 gap-4">
                {
                    nftData.map((data, id) => {
                        return (
                            <NftCard details={data} key={id} />
                        )
                    })
                }
            </div>
        </div>
    );
}