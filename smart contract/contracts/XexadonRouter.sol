// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IXexadonFactory.sol";
import "../interfaces/IXexadonPair.sol";

contract XexadonRouter is Ownable{
    
    uint256 feeMultiplier;
    uint256 platformFeeMultiplier;

    IXexadonFactory immutable factory;

    constructor(address _factory, address owner) {
        factory = IXexadonFactory(_factory);
        transferOwnership(owner);
    }

    function getFee() external view returns(uint256, uint256) {
        return(feeMultiplier, platformFeeMultiplier);
    }

    function setFee(uint256 _platformFee, uint256 _fee) external onlyOwner {
        require(_platformFee <= 10 && _fee <= 10, "Invalid fee percentage");
        platformFeeMultiplier = _platformFee;
        feeMultiplier = _fee;
    }

    function swapETHforNFT(uint256[] memory tokenIds, address pairAddress, address to) external payable {
        IXexadonPair pair = IXexadonPair(pairAddress);
        pair.swap{value: msg.value}(tokenIds, to);
    }

    function swapNFTforETH(uint256[] memory tokenIds, address pairAddress, address to) external payable {
        IXexadonPair pair = IXexadonPair(pairAddress);
        pair.swap{value: 0}(tokenIds, to);
    }

    function addLiquidity(uint256[] calldata tokenIds, address pairAddress, address from) external payable {
        require(msg.value > 0, "Xexadon: No Ether sent");
        IXexadonPair pair = IXexadonPair(pairAddress);
        pair.addLiquidity{value: msg.value}(tokenIds, from);
    }

    function removeLiquidity(uint256[] memory tokenIds, address pairAddress, address to) external {
        IXexadonPair pair = IXexadonPair(pairAddress);
        pair.removeLiquidity(tokenIds, to);
    }

    // function swapNFTforExactNFT(uint256[] memory inputTokenIds, uint256[] memory outputTokenIds, address[2] memory path, address to) external payable {
    //     specify route pairs 
    //     max 2 (path)
    //     perform swaps through router
    //     IXexadonPair pair0 = IXexadonPair(path[0]);
    //     IXexadonPair pair1 = IXexadonPair(path[1]);

    //     uint256 amountOut = pair0.swap{value: 0}(inputTokenIds, address(this));
    //     pair1.
    //     // curve.getBuyPrice(tokenIds.length, reserve0, reserve1)
    //     convert from nft to eth, then eth to nft
    // }
}