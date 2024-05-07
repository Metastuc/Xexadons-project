import { useState } from 'react';

export default function NftCard({ details, selectedNfts, setSelectedNfts, selectedSellNfts, setSelectedSellNfts, activeTab }) {
    const handleCheckboxChange = (event) => {
        const { checked } = event.target;
        if (activeTab === 0) {
            if (checked) {
                setSelectedNfts([...selectedNfts, { id: details.id, poolAddress: details.poolAddress }]);
            } else {
                setSelectedNfts(selectedNfts.filter(nft => nft.id !== details.id));
            }
        } else if (activeTab === 1) {
            if (checked) {
                setSelectedSellNfts([...selectedSellNfts, { id: details.id, poolAddress: details.poolAddress }]);
            } else {
                setSelectedSellNfts(selectedSellNfts.filter(nft => nft.id !== details.id));
            }
        }
    };
    return (
        <div className="border rounded-2xl border-grey p-3 text-xs">
            <img src={details.src} alt={details.name} width="190" height="190" className="rounded-2xl mb-4" />
            <p>#{details.id}</p>
            <p className="font-medium my-2">{details.name}</p>
            <div className="flex justify-between">
                <input type="checkbox" onChange={handleCheckboxChange}/>
            </div>
        </div>
    )
}