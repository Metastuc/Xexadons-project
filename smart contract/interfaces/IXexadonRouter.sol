// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

interface IXexadonRouter {
    function getFee() external view returns(uint256);
    function swapNFTforETH(address token, uint256[] memory tokenIds, address to) external payable;
    function swapETHforNFT(address token, uint256[] memory tokenIds, address to) external payable;
}