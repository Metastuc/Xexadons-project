// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

interface IXexadonFactory {
    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);

    function getPairs(address token) external view returns (address[] memory pairs);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);

    function createPair(address token, address _router, address _curve, uint256 _fee) external returns (address pair);

    function setFeeTo(address) external;
    function setFeeToSetter(address) external;
}