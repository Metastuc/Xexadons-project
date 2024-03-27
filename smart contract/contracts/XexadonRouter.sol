// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IXexadonFactory.sol";
import "../interfaces/IXexadonPair.sol";
import "../interfaces/IXexadonBondCurve.sol";

contract XexadonRouter is Ownable{
    
    uint256 feeMultiplier;
    uint256 platformFeeMultiplier;

    IXexadonFactory immutable factory;

    IXexadonBondCurve public curve;

    constructor(address _factory, address owner, address _curve) {
        factory = IXexadonFactory(_factory);
        transferOwnership(owner);
        curve = IXexadonBondCurve(_curve);
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

    function swapNFTforExactNFT(uint256[] memory inputTokenIds, uint256[] memory outputTokenIds, address[2] memory path, address to) external payable {
        IXexadonPair pair0 = IXexadonPair(path[0]);
        IXexadonPair pair1 = IXexadonPair(path[1]);

        uint256 amountOut0 = pair0.swap{value: 0}(inputTokenIds, address(this));

        (uint256 reserveOut0, uint256 reserveOut1) = pair1.getReserves();

        (uint256 amountIn1, , ) = curve.getBuyPrice(outputTokenIds.length, reserveOut0, reserveOut1);
        require(amountOut0 + msg.value == amountIn1 || amountOut0 == amountIn1, "Xexadon: Insufficient funds");
        pair1.swap{value: amountIn1}(outputTokenIds, to);
    }
}