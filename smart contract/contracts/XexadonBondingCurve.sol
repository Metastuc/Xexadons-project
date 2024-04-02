// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

/// @title BondingCurve
/// @author NatX
/// @notice this contract is used to determine the price of an NFT 
/// @dev the contract implements the constant product market maker
contract BondingCurve {
    
    constructor() {}

    /// @notice determines the price of the NFTs a user wants to buy
    /// @dev the XYK curve is used to determine how much is to be paid for the number of NFTs specified
    /// @param tokenLength the number of NFTs the user wants to buy
    /// @param reserve0 the reserve NFT balance from the pair pool
    /// @param reserve1 the reserve ETH balance from the pair pool
    /// @return amountIn the price for the NFTs
    /// @return newReserve0 the new NFT reserve to be updated in the pair pool
    /// @return newReserve1 the new ETH reserve to be updated in the pair pool
    function getBuyPrice(uint256 tokenLength, uint256 reserve0, uint256 reserve1) external pure returns(uint256 amountIn, uint256 newReserve0, uint256 newReserve1) {
        amountIn = ((reserve1 * tokenLength) / (reserve0 - tokenLength));

        newReserve0 = reserve0 - tokenLength;
        newReserve1 = reserve1 + amountIn;
        
        return(amountIn, newReserve0, newReserve1);
    }

    /// @notice determines the amount of ETH a user gets when they sell their NFTs
    /// @dev the XYK curve is used to determine how much a user gets for selling their NFTs
    /// @param tokenLength the number of NFTs the user wants to sell
    /// @param reserve0 the reserve NFT balance from the pair pool
    /// @param reserve1 the reserve ETH balance from the pair pool
    /// @return amountOut the amount the user gets for their NFTs
    /// @return newReserve0 the new NFT reserve to be updated in the pair pool
    /// @return newReserve1 the new ETH reserve to be updated in the pair pool
    function getSellAmount(uint256 tokenLength, uint256 reserve0, uint256 reserve1) external pure returns(uint256 amountOut, uint256 newReserve0, uint256 newReserve1) {
        amountOut = ((reserve1 * tokenLength) / (reserve0 + tokenLength));

        newReserve0 = reserve0 + tokenLength;
        newReserve1 = reserve1 - amountOut;
        
        return(amountOut, newReserve0, newReserve1);
    }
}