// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

interface IXexadonPair {
    function pairSymbol() external view returns(string memory);
    function pairAddress() external view returns(address);
    function balanceOf(address owner) external view returns(uint256);
    function totalSupply() external view returns (uint256);
    function addLiquidity(uint256[] memory tokenIds, address _from) external payable;
    // function removeLiquidity(uint256[] memory tokenIds, address _to, uint256 _shares) external returns (bool);
    function swap(uint256[] memory tokenIds, address to) external payable;
    function getLiquidityAmount(uint256[] memory tokenIds) external view returns(uint256);
    function initialize(address _router, address _curve, address _tokenAddress) external;
}