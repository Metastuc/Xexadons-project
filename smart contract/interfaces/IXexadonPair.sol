// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

interface IXexadonPair {
    event swapEthforNft(uint256 ethAmount, uint256[] tokenIds, address swapper);
    event swapNftforEth(uint256[] tokenIds, uint256 ethAmount, address swapper);
    function pairSymbol() external view returns(string memory);
    function pairAddress() external view returns(address);
    function balanceOf(address owner) external view returns(uint256);
    function totalSupply() external view returns (uint256);
    function addLiquidity(uint256[] memory tokenIds, address _from) external payable;
    function removeLiquidity(uint256[] memory tokenIds, address _to) external;
    function swap(uint256[] memory tokenIds, address to) external payable returns(uint256 );
    function initialize(address _router, address _curve, address _tokenAddress) external;
}