// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IXexadonFactory.sol";
import "../interfaces/IXexadonPair.sol";
import "../interfaces/IXexadonBondCurve.sol";

/// @title XexadonRouter
/// @author NatX
/// @notice the contract facilitates the routing of transactions between different pool pairs
/// @dev the contract also enables trading NFTs for NFTs
contract XexadonRouter is Ownable{
    
    uint256 platformFee; // the platform fee as a percentage of the value every trade

    IXexadonFactory immutable factory; // the Xexadon factory contract instance

    IXexadonBondCurve public curve; // the Xexadon bonding curve contract instance

    // setting the relevant parameters
    constructor(address _factory, address owner, address _curve) {
        factory = IXexadonFactory(_factory);
        transferOwnership(owner);
        curve = IXexadonBondCurve(_curve);
    }

    /// @notice returns the platform fee
    /// @return platformFee
    function getFee() external view returns(uint256) {
        return(platformFee);
    }

    /// @notice this function updates the platform fee
    /// @dev it implements the onlyOwner modifier
    /// @param _platformFee the updated platformFee
    function setFee(uint256 _platformFee) external onlyOwner {
        require(_platformFee <= 10, "Invalid fee percentage");
        platformFee = _platformFee;
    }

    /// @notice this function swaps ETH for NFTs
    /// @param tokenIds the array of token Ids the users wants to buy
    /// @param pairAddress the address of the pair pool the user wants to trade with
    /// @param to the destination address of the NFTs
    function swapETHforNFT(uint256[] memory tokenIds, address pairAddress, address to) external payable {
        IXexadonPair pair = IXexadonPair(pairAddress);
        pair.swap{value: msg.value}(tokenIds, to);
    }

    /// @notice this function swaps ETH for NFTs
    /// @param tokenIds the array of token Ids the users wants to sell
    /// @param pairAddress the address of the pair pool the user wants to trade with
    /// @param to the destination address of the ETH
    function swapNFTforETH(uint256[] memory tokenIds, address pairAddress, address to) external payable {
        IXexadonPair pair = IXexadonPair(pairAddress);
        pair.swap{value: 0}(tokenIds, to);
    }

    /// @notice this function enables pool owners to add liquidity to a pool
    /// @param tokenIds the array of token Ids the users wants to add to a pool
    /// @param pairAddress the address of the pair pool the user wants to add liquidity to
    /// @param from the address of the pool owner 
    function addLiquidity(uint256[] calldata tokenIds, address pairAddress, address from) external payable {
        require(msg.value > 0, "Xexadon: No Ether sent");
        IXexadonPair pair = IXexadonPair(pairAddress);
        pair.addLiquidity{value: msg.value}(tokenIds, msg.sender);
    }

    /// @notice this function enables pool owners to remove liquidity from a pool
    /// @param tokenIds the array of token Ids the users wants to remove from a pool
    /// @param pairAddress the address of the pair pool the user wants to remove liquidity from
    /// @param to the address of the pool owner 
    function removeLiquidity(uint256[] memory tokenIds, address pairAddress, address to) external {
        IXexadonPair pair = IXexadonPair(pairAddress);
        pair.removeLiquidity(tokenIds, to);
    }

    /// @notice this function enables pool owners to swap NFTs for NFTs
    /// @dev the routes are limited to only 2 pools for a start
    /// @param inputTokenIds the array of token Ids the users wants to trade in
    /// @param outputTokenIds the array of token Ids the users wants to get from the trade
    /// @param path the array of pair pool addresses that swaps are going to take place on
    /// @param to the receiver address of the output NFTs
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