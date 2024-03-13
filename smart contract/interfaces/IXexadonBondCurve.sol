// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

interface IXexadonBondCurve {
    function getBuyPrice(uint256 tokenLength, uint256 reserve0, uint256 reserve1) external pure returns(uint256, uint256, uint256);
    function getSellAmount(uint256 tokenLength, uint256 reserve0, uint256 reserve1) external pure returns(uint256, uint256, uint256);
}