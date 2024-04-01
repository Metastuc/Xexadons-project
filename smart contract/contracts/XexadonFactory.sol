// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "../interfaces/IXexadonFactory.sol";
import "../interfaces/IXexadonPair.sol";
import "./XexadonPair.sol";

/// @title Xexadon Pool Factory
/// @author NatX
/// @notice This contract is used to create new Xexadon NFT trading pools
/// @dev Create2 is used to deploy the xexadonPair contract
contract XexadonFactory is IXexadonFactory {
    address public feeTo; // the protocol fee collector
    address public feeToSetter; // the setter of fee collector

    mapping(address => address[]) public getPair; // maps an NFT address to all its pools
    address[] public allPairs; // all pool pair addresses

    /// @notice event when emitted when a pair is created
    /// @param token the NFT token address
    /// @param pair the address of the pair created 
    event PairCreated(address token, address pair);

    /// Constructor function
    /// the feeToSetter is initialized
    constructor(address _feeToSetter) {
        feeToSetter = _feeToSetter;
    }

    /// @notice returns the number of pools created
    /// @dev the number of pools is the length of the allPairs array
    /// @return uint
    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    /// @notice creates a xexadon pair pool
    /// @dev creates a new pool contract using create2 and updates the getPair mapping and allPairs array
    /// @param token the NFT token address
    /// @param _router the xexadon router contract address
    /// @param _curve the xexadon bonding curve contract address
    /// @param _fee the fee percentage the pool creator wants to impose on each trade on the pool
    /// @return pair the address of the newly created pair pool
    function createPair(address token, address _router, address _curve, uint256 _fee) external returns (address pair) {
        require(token != address(0), 'Xexadon: Address can not be blank');
        bytes memory bytecode = type(XexadonPair).creationCode;
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), 0)
        }
        IXexadonPair(pair).initialize(_router, _curve, token, _fee);
        getPair[token].push(pair);
        allPairs.push(pair);
        emit PairCreated(token, pair);
    }

    /// @notice sets the receiver of the protocol fees
    /// @dev only the feeToSetter can call this function
    /// @param _feeTo the address that will receive protocol fees
    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, 'Xexadon: You are not permitted');
        feeTo = _feeTo;
    }

    /// @notice sets the feeToSetter of the protocol fees
    /// @dev only the feeToSetter can call this function
    /// @param _feeToSetter the address that will receive protocol fees
    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, 'Xexadon: You are not permitted');
        feeToSetter = _feeToSetter;
    }

    /// @notice returns all pool addresses of an NFT token
    /// @dev the getPair mapping is used to retrieve all token pairs
    /// @param token the token address
    /// @return pairs an array of all token pairs
    function getPairs(address token) external view returns (address[] memory pairs) {
        pairs = getPair[token];
    }
}