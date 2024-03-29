// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "../interfaces/IXexadonPair.sol";
import "../interfaces/IXexadonRouter.sol";
import "../interfaces/IXexadonBondCurve.sol";
import "../interfaces/IXexadonFactory.sol";
import "../libraries/Math.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./XexadonERC20.sol";

/// @title The xexadon pair contract template
/// @author NatX
/// @notice This contract when deployed enables users to swap their NFTs for ETH and vice versa
/// @dev This contract should be deployed by the Xexadon factory contract
contract XexadonPair is XexadonShares {
    address public owner; // the deployer of the pair contract

    IERC721 public token; // the NFT token instance
    address public tokenAddress; // NFT token address
    
    IXexadonRouter public router; // the Router contract instance
    address public routerAddress; // the Router contract address

    IXexadonBondCurve public curve; // the bonding curve contract instance
    address public curveAddress; // the bonding curve contract address

    IXexadonFactory public factory; // the Factory contract instance
    address public factoryAddress; // the Factory contract address

    uint256 public reserve0; // the balance of the NFTs in the contract
    uint256 public reserve1; // the balance of the ETH in the contract

    uint256 public feeMultiplier; // the fee the pool creator charges for every swap

    bool private initialized; // variable to check if the contract has been initialized or not

    /// @notice Tracks activity in the smart contract
    /// @dev Event is emitted when ETH is swaped for NFTs
    /// @param ethAmount The amount of ETH used to buy the NFTs
    /// @param tokenIds The token Ids of the NFTs purchased
    /// @param to The receiver of the NFTs after the trade
    event swapEthforNft(uint256 ethAmount, uint256[] tokenIds, address to);

    /// @notice Tracks activity in the smart contract
    /// @dev Event is emitted when ETH is swaped for NFTs
    /// @param tokenIds The token Ids of the NFTs swapped for ETH
    /// @param ethAmount The amount of ETH received from the swap
    /// @param to The receiver of the ETH after the trade
    event swapNftforEth(uint256[] tokenIds, uint256 ethAmount, address to);

    mapping (uint256 => address) private nftOwner;
    uint256 public _totalSupply;

    constructor() {
        factoryAddress = msg.sender;
    }

    function initialize(address _router, address _curve, address _tokenAddress, address _owner, uint256 _fee) external onlyFactory {
        require(_fee <= 50, "Xexadon: Fee must be less thhan or equal to 5%");
        require(initialized == false, "Xexadon: Can not initialize a contract more than once");
        factory = IXexadonFactory(factoryAddress);
        routerAddress = _router;
        router = IXexadonRouter(_router);
        curveAddress = _curve;
        curve = IXexadonBondCurve(_curve);
        token = IERC721(_tokenAddress);
        tokenAddress = _tokenAddress;
        owner = _owner;
        feeMultiplier = _fee;
        initialized = true;
    }

    function adjustFee(uint256 _fee) external {
        require(_fee <= 50, "Xexadon: Fee must be less thhan or equal to 5%");
        feeMultiplier = _fee;
    }

    function setDatails() internal {
        string memory _tokenSymbol = token.symbol();
        string memory _name = 'Xexadon:';
        string memory _symbol = 'XEX:';

        string memory tokenName = string(abi.encodePacked(_name, _tokenSymbol));
        string memory tokenSymbol = string(abi.encodePacked(_symbol, _tokenSymbol));

        setName(tokenName, tokenSymbol);
    }

    function pairAddress() external view returns(address _pairAddress) {
        _pairAddress = address(this);
    }

    function addLiquidity(uint256[] calldata tokenIds, address _from) external payable {
        require(msg.value > 0, "Xexadon: No Ether sent");
        require(msg.sender == owner, "Xexadon: Access not granted");
        // check if the reserves are equal to zero
        if (reserve0 == 0 || reserve1 == 0) {
            batchTransferFrom(tokenIds, _from);

            uint256 shares = Math.sqrt(tokenIds.length * msg.value);
            _mint(_from, shares);

            reserve0 = tokenIds.length;
            reserve1 = msg.value;
        } else {
            require(reserve0 * msg.value == reserve1 * tokenIds.length, "Xexadon: Operational Error");
            batchTransferFrom(tokenIds, _from);

            uint256 shares = Math.min((tokenIds.length * _totalSupply) / reserve0, (msg.value * _totalSupply) / reserve1);
            _mint(_from, shares);

            reserve0 += tokenIds.length;
            reserve1 += msg.value;
        }
    }

    function removeLiquidity(uint256[] memory tokenIds, address _to) external {
        require(reserve0 != 0 && reserve1 != 0);
        
        uint256 shares = (tokenIds.length * _totalSupply) / reserve0;
        require(shares <= balanceOf[_to], "Xexadon: Amount exceeded");
        uint256 ethAmount = (shares * reserve1) / _totalSupply;

        _burn(_to, shares);
        payable(_to).transfer(ethAmount);
        batchTransfer(tokenIds, _to);
    }

    function swap(uint256[] memory tokenIds, address to) external payable returns(uint256) {
        if (msg.value == 0) { // calculate fee before hand, use another check
            batchTransferFrom(tokenIds, to);
            // calculate amount of ETH to send
            (uint256 _amountOut, uint256 newReserve0, uint256 newReserve1) = curve.getSellAmount(tokenIds.length, reserve0, reserve1);
            (uint256 fee, uint256 platformFee) = getFee(_amountOut);
            uint256 amountOut = _amountOut - fee - platformFee;
            payable(factory.feeTo()).transfer(fee);
            payable(to).transfer(amountOut);
            // update reserve
            reserve0 = newReserve0;
            reserve1 = newReserve1;

            emit swapNftforEth(tokenIds, amountOut, to);
            return amountOut;
        }
        else {
            // calculate amount of ETH to be sent
            (uint256 amountIn, uint256 newReserve0, uint256 newReserve1) = curve.getBuyPrice(tokenIds.length, reserve0, reserve1);
            (uint256 fee, uint256 platformFee) = getFee(amountIn);
            require(msg.value >= (amountIn + fee + platformFee), "Xexadon: Invalid Price");
            // send platform fee to platform
            payable(factory.feeTo()).transfer(platformFee);
            batchTransfer(tokenIds, to);
            reserve0 = newReserve0;
            reserve1 = newReserve1;

            uint refundAmount = msg.value - amountIn;
            payable(to).transfer(refundAmount);

            emit swapEthforNft(amountIn, tokenIds, to);
            return tokenIds.length;
        }
    }

    function batchTransferFrom(uint256[] memory tokenIds, address from) internal {
        // check if the address has approved all the nfts
        require(token.isApprovedForAll(from, address(this)) == true, "ERC721: Token Not Approved");
        // run through a loop to trnasfer all the nfts
        for (uint256 i = 0; i < tokenIds.length; i++) {
            token.transferFrom(from, address(this), tokenIds[i]);
        }
    }

    function batchTransfer(uint256[] memory tokenIds, address to) internal {
        // run through a loop to trnasfer all the nfts to check if the contract owns the NFT with tokenId
        for (uint256 i = 0; i < tokenIds.length; i++) {
            token.transferFrom(address(this), to, tokenIds[i]);
        }
    }

    function getReserves() external view returns(uint256, uint256) {
        return (reserve0, reserve1);
    }

    function getFee(uint256 amount) public view returns(uint256 fee, uint256 platformFee) {
        (uint256 platformFeeMultiplier) = router.getFee();

        fee = (amount * feeMultiplier) / 1000;
        platformFee = (amount * platformFeeMultiplier) / 1000;
    }

    modifier onlyFactory {
        require(msg.sender == factoryAddress, "Xexadon: Only Factory can call this function");
        _;
    }

    modifier onlyRouter {
        require(msg.sender == routerAddress, "Xexadon: Only Factory can call this function");
        _; 
    }
}