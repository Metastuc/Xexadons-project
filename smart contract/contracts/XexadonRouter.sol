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

    function swapETHforNFT(address token, uint256[] memory tokenIds, address to) external payable {
        address pairAddress = factory.getPair(token);
        IXexadonPair pair = IXexadonPair(pairAddress);
        pair.swap{value: msg.value}(tokenIds, to);
    }

    function swapNFTforETH(address token, uint256[] memory tokenIds, address to) external payable {
        address pairAddress = factory.getPair(token);
        IXexadonPair pair = IXexadonPair(pairAddress);
        pair.swap{value: 0}(tokenIds, to);
    }

    function addLiquidity(address token, uint256[] calldata tokenIds, address from) external payable {
        require(msg.value > 0, "Xexadon: No Ether sent");
        address pairAddress = factory.getPair(token);
        IXexadonPair pair = IXexadonPair(pairAddress);
        pair.addLiquidity{value: msg.value}(tokenIds, from);
    }
}