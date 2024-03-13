// SPDX-License-Identifier: SEE LICENSE IN LICENSE

// Declare the version of Solidity this contract is written in
pragma solidity ^0.8.0;

// Import necessary interfaces and libraries
import "../interfaces/IXexadonPair.sol";
import "../interfaces/IXexadonRouter.sol";
import "../interfaces/IXexadonBondCurve.sol";
import "../interfaces/IXexadonFactory.sol";
import "../libraries/Math.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./XexadonERC20.sol";

// Declare the contract for handling pairs of tokens
contract XexadonPair is XexadonShares {
    // Declare variables for tokens, router, bond curve, factory, and reserves
    IERC721 public token; // the non-fungible token (NFT) contract instance
    address public tokenAddress; // Address of the NFT contract

    IXexadonRouter public router; // the router contract instance
    address public routerAddress; // Address of the router contract

    IXexadonBondCurve public curve; // the bonding curve contract instance
    address public curveAddress; // Address of the bond curve contract

    IXexadonFactory public factory; // the factory contract instance
    address public factoryAddress; // Address of the factory contract

    // Variables to store reserves of tokens in the pair
    uint256 public reserve0; // Reserve of the NFT in the pool 
    uint256 public reserve1; // Reserve of native token in the pool

    // Constructor to deploy the contract
    // Should be called by only the factory contract
    // to be registered on the protocol
    constructor() {
        factoryAddress = msg.sender;
    }

    // Function to initialize the pair contract with necessary details
    function initialize(address _router, address _curve, address _tokenAddress) external onlyFactory {
        // Ensure only the factory contract can call this function
        require(msg.sender == factoryAddress, 'Xexadon: Not Permitted');
        
        // Set contract addresses for router, bond curve, and token
        factory = IXexadonFactory(factoryAddress);
        routerAddress = _router;
        router = IXexadonRouter(_router);
        curveAddress = _curve;
        curve = IXexadonBondCurve(_curve);
        token = IERC721(_tokenAddress);
        tokenAddress = _tokenAddress;
        
        // Set token details
        setDatails();
    }

    // Internal function to set pool share token details
    function setDatails() internal {
        // Get token symbol
        string memory _tokenSymbol = token.symbol();
        
        // Set name and symbol for the pair
        string memory _name = 'Xexadon:';
        string memory _symbol = 'XEX:';
        string memory tokenName = string(abi.encodePacked(_name, _tokenSymbol));
        string memory tokenSymbol = string(abi.encodePacked(_symbol, _tokenSymbol));
        setName(tokenName, tokenSymbol);
    }

    // Function to get the address of the pair contract
    function pairAddress() external view returns(address _pairAddress) {
        _pairAddress = address(this);
    }

    // Function to add liquidity to the pair
    function addLiquidity(uint256[] memory tokenIds, address _from) external payable onlyRouter {
        // check if the reserves are equal to zero
        // if reserves are 0 then pool creator can add any amount of NFT and tokens
        if (reserve0 == 0 || reserve1 == 0) {
            batchTransferFrom(tokenIds, _from);

            // Calculate shares to mint for the sender
            uint256 shares = Math.sqrt(tokenIds.length * msg.value);
            _mint(_from, shares);

            // Set reserves
            reserve0 = tokenIds.length;
            reserve1 = msg.value;
        } else {
            // Ensure tokens' value matches the reserves
            require(reserve0 * msg.value == reserve1 * tokenIds.length, "Xexadon: Operational Error");
            
            // Transfer tokens and calculate shares to mint
            batchTransferFrom(tokenIds, _from);
            uint256 shares = Math.min((tokenIds.length * totalSupply) / reserve0, (msg.value * totalSupply) / reserve1);
            _mint(_from, shares);

            // Update reserves
            reserve0 += tokenIds.length;
            reserve1 += msg.value;
        }
    }

    // Function to remove liquidity from the pair
    function removeLiquidity(uint256[] memory tokenIds, address _to) external {
        // Ensure reserves are not empty
        require(reserve0 != 0 && reserve1 != 0);
        
        // Calculate shares and ETH amount to send
        uint256 shares = (tokenIds.length * totalSupply) / reserve0;
        uint256 ethAmount = (shares * reserve1) / totalSupply;

        // Burn shares from the sender and transfer ETH
        _burn(_to, shares);
        payable(_to).transfer(ethAmount);
        batchTransfer(tokenIds, _to);
    }

    // Function to swap tokens
    function swap(uint256[] memory tokenIds, address to) external payable returns(bool success) {
        if (msg.value == 0) { // Check if swapping tokens for ETH
            batchTransferFrom(tokenIds, to);
            // Calculate amount of ETH to send
            (uint256 _amountOut, uint256 newReserve0, uint256 newReserve1) = curve.getSellAmount(tokenIds.length, reserve0, reserve1);
            (uint256 fee, uint256 platformFee) = getFee(_amountOut);
            uint256 amountOut = _amountOut - fee - platformFee;
            payable(factory.feeTo()).transfer(fee);
            payable(to).transfer(amountOut);
            // Update reserves
            reserve0 = newReserve0;
            reserve1 = newReserve1;
            success = true;
        }
        else {
            // Calculate amount of ETH to be sent
            (uint256 amountIn, uint256 newReserve0, uint256 newReserve1) = curve.getBuyPrice(tokenIds.length, reserve0, reserve1);
            (uint256 fee, uint256 platformFee) = getFee(amountIn);
            require(msg.value == (amountIn + fee + platformFee), "Xexadon: Invalid Price");
            // Send platform fee to platform
            payable(factory.feeTo()).transfer(fee);
            batchTransfer(tokenIds, to);
            reserve0 = newReserve0;
            reserve1 = newReserve1;
            success = true;    
        }
    }

    // Internal function to batch transfer tokens from sender to pair
    function batchTransferFrom(uint256[] memory tokenIds, address from) internal {
        // Check if the sender has approved all the NFTs
        require(token.isApprovedForAll(from, address(this)) == true, "ERC721: Token Not Approved");
        
        // Transfer each NFT from the sender to the pair contract
        for (uint256 i = 0; i < tokenIds.length; i++) {
            token.transferFrom(from, address(this), tokenIds[i]);
        }
    }

    // Internal function to batch transfer tokens from pair to a recipient
    function batchTransfer(uint256[] memory tokenIds, address to) internal {
        // Transfer each NFT from the pair contract to the recipient
        for (uint256 i = 0; i < tokenIds.length; i++) {
            token.transferFrom(address(this), to, tokenIds[i]);
        }
    }

    // Function to calculate fee and platform fee
    function getFee(uint256 amount) public view returns(uint256 fee, uint256 platformFee) {
        // Get fee multipliers from the router contract
        // Fees should be between the 0.1% to 1% range
        (uint256 feeMultiplier, uint256 platformFeeMultiplier) = router.getFee();

        // Calculate fees
        fee = (amount * feeMultiplier) / 1000;
        platformFee = (amount * platformFeeMultiplier) / 1000;
    }

    // Modifier to restrict access to only the factory contract
    modifier onlyFactory {
        require(msg.sender == factoryAddress, "Xexadon: Only Factory can call this function");
        _;
    }

    // Modifier to restrict access to only the router contract
    modifier onlyRouter {
        require(msg.sender == routerAddress, "Xexadon: Only Router can call this function");
        _; 
    }
}
