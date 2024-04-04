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

    uint256 public _totalSupply; // total supply of shares

    // initializing parameters 
    constructor() {
        factoryAddress = msg.sender;
    }

    /// @notice this function initilizes all the needed variables
    /// @dev it implements the onlyFactory modifier, in order for the pair pool to be included in the protocol
    /// @param _router the xexadon router contract address
    /// @param _curve the xexadon bonding curve contract address
    /// @param _tokenAddress the NFT contract address for which the pool is to be created
    /// @param _owner the address of the pool owner
    /// @param _fee the fee as percentage of the value of each transaction the pool owner wants to charge for each trade
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

    /// @notice this function adjusts the fee of the pool
    /// @dev only the pool owner can call this function
    /// @param _fee the new fee the pool owner wants to set
    function adjustFee(uint256 _fee) external {
        require(msg.sender == owner, "Xexadon: Only owner can call this function");
        require(_fee <= 50, "Xexadon: Fee must be less thhan or equal to 5%");
        feeMultiplier = _fee;
    }

    /// @notice this function sets the name and symbol of the pool
    /// @dev it uses the NFT name and symbol as suffixes
    function setDatails() internal {
        string memory _tokenSymbol = token.symbol();
        string memory _name = 'Xexadon:';
        string memory _symbol = 'XEX:';

        string memory tokenName = string(abi.encodePacked(_name, _tokenSymbol));
        string memory tokenSymbol = string(abi.encodePacked(_symbol, _tokenSymbol));

        setName(tokenName, tokenSymbol);
    }

    /// @notice this function adds liquidity to a pool
    /// @dev the pool can add any amount of Liquidity to the pool to determine price if no liquidity has been added priviously
    /// @dev but the owner will have to put in a set amount of NFTs and ETH if liquidity has been priviously added
    /// @dev pool shares are also minted to the owner to signify ownership and can then be transfered to another address
    /// @param tokenIds the NFT token Ids to be added as liwquidity
    /// @param _from the address the liquidity is to be added from, only accepts the owner of the pool
    function addLiquidity(uint256[] calldata tokenIds, address _from) external payable onlyRouter {
        require(msg.value > 0, "Xexadon: No Ether sent");
        require(_from == owner, "Xexadon: Access not granted");
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

    /// @notice this function removes liquidity from the pool
    /// @dev this function can be called by anyone who has the pool shares token not just the owner
    /// @param tokenIds the ids of the NFT the user wants to remove from the pool
    function removeLiquidity(uint256[] memory tokenIds, address _to) external {
        require(reserve0 != 0 && reserve1 != 0);
        
        uint256 shares = (tokenIds.length * _totalSupply) / reserve0;
        require(shares <= balanceOf[_to], "Xexadon: Amount exceeded");
        uint256 ethAmount = (shares * reserve1) / _totalSupply;

        _burn(_to, shares);
        payable(_to).transfer(ethAmount);
        batchTransfer(tokenIds, _to);
    }

    /// @notice this function swaps NFTs for ETH and vice versa
    /// @dev the function calls the bonding curve of the protocol to detrmine price and updates the reserves
    /// @param tokenIds the ids of the NFT the user wants to buy or sell
    /// @param to the destination address of the swap output
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

    /// @notice this function transfers NFTs from a user to the pool
    /// @dev the function uses a loop to serialy transfer the NFTs the user wants to sell
    /// @dev the function is called in the addLiquidity and swap functions 
    /// @param tokenIds the ids of the NFT to be transfered from the user
    /// @param from the address the NFTs are to be transfered from
    function batchTransferFrom(uint256[] memory tokenIds, address from) internal {
        // check if the address has approved all the nfts
        require(token.isApprovedForAll(from, address(this)) == true, "ERC721: Token Not Approved");
        // run through a loop to trnasfer all the nfts
        for (uint256 i = 0; i < tokenIds.length; i++) {
            token.transferFrom(from, address(this), tokenIds[i]);
        }
    }

    /// @notice this function transfers NFTs to a user from the pool
    /// @dev the function uses a loop to serialy transfer the NFTs the user wants to buy to the user's address
    /// @dev the function is called in the removeLiquidity and swap functions
    /// @param tokenIds the ids of the NFT to be transfered to the user
    /// @param to the address the NFTs are to be transfered to
    function batchTransfer(uint256[] memory tokenIds, address to) internal {
        // run through a loop to trnasfer all the nfts to check if the contract owns the NFT with tokenId
        for (uint256 i = 0; i < tokenIds.length; i++) {
            token.transferFrom(address(this), to, tokenIds[i]);
        }
    }

    /// @notice the function returns the reserves of both NFTs and ETH in a pool
    /// @return reserve0
    /// @return reserve1
    function getReserves() external view returns(uint256, uint256) {
        return (reserve0, reserve1);
    }

    /// @notice return the actual fee prices of a trade in ETH
    /// @dev the function returns both the protocol fee and pool fee
    /// @param amount the value of the transaction
    /// @return fee the pool fee
    /// @return platformFee the protocol fee
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