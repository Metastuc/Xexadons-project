// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "../interfaces/IXexadonFactory.sol";
import "../interfaces/IXexadonPair.sol";
import "./XexadonPair.sol";

contract XexadonFactory is IXexadonFactory {
    address public feeTo;
    address public feeToSetter;

    mapping(address => address[]) public getPair;
    address[] public allPairs;

    event PairCreated(address token, address pair);

    constructor(address _feeToSetter) {
        feeToSetter = _feeToSetter;
    }

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    function createPair(address token, address _router, address _curve) external returns (address pair) {
        require(token != address(0), 'Xexadon: Address can not be blank');
        bytes memory bytecode = type(XexadonPair).creationCode;
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), 0)
        }
        IXexadonPair(pair).initialize(_router, _curve, token);
        getPair[token].push(pair);
        allPairs.push(pair);
        emit PairCreated(token, pair);
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, 'Xexadon: You are not permitted');
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, 'Xexadon: You are not permitted');
        feeToSetter = _feeToSetter;
    }

    function getPairs(address token) external view returns (address[] memory pairs) {
        pairs = getPair[token];
    }
}