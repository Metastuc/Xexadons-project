// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract BondingCurve {
    
    constructor() {}

    function getBuyPrice(uint256 tokenLength, uint256 reserve0, uint256 reserve1) external pure returns(uint256, uint256, uint256) {
        uint256 amountIn;
        uint256 newReserve0;
        uint256 newReserve1;

        amountIn = ((reserve1 * tokenLength) / (reserve0 - tokenLength));

        newReserve0 = reserve0 - tokenLength;
        newReserve1 = reserve1 + amountIn;
        
        return(amountIn, newReserve0, newReserve1);
    }

    function getSellAmount(uint256 tokenLength, uint256 reserve0, uint256 reserve1) external pure returns(uint256, uint256, uint256) {
        uint256 amountOut;
        uint256 newReserve0;
        uint256 newReserve1;

        amountOut = ((reserve1 * tokenLength) / (reserve0 + tokenLength));

        newReserve0 = reserve0 + tokenLength;
        newReserve1 = reserve1 - amountOut;
        
        return(amountOut, newReserve0, newReserve1);
    }
}