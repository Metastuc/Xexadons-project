import Image from "next/image";

export default function Trade() {
    return (
        <section className="py-16">
            <div className="container mx-auto px-20">
                <div className="rounded-md border-[2px] py-10 px-8">
                    <div className="text-center text-[55px]">
                        <h2 className="font-semibold">Buy, sell & trade</h2>
                        <h3>Nfts instantly</h3>
                    </div>
                    <div className="flex justify-center gap-28 items-center">
                        <div className="flex flex-col gap-9">
                            <p className="font-medium w-[25rem]">
                                <span className="font-bold">Buy - </span>deposit
                                token &#40;Eth,Bsc,Matic,Avax,Ftm,Btc&#41; add
                                choice Nft to cart and buy instantly
                            </p>
                            <p className="font-medium w-[25rem]">
                                <span className="font-bold">Sell - </span>
                                deposit Nft to pool and sell instantly at
                                current floor price for token
                            </p>
                            <p className="font-medium w-[25rem]">
                                <span className="font-bold">Trade - </span>
                                deposit both Nfts and token to pool and earn
                                trading fees
                            </p>
                        </div>
                        <div>
                            <Image
                                src="/card.png"
                                height={400}
                                width={400}
                                alt="Trading cards"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}