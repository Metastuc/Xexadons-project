// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "../interfaces/IXexadonPair.sol";
import "../interfaces/IXexadonRouter.sol";
import "../interfaces/IXexadonBondCurve.sol";
import "../interfaces/IXexadonFactory.sol";
import "../libraries/Math.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./XexadonERC20.sol";

contract XexadonPair is XexadonShares {
    IERC721 public token;
    address public tokenAddress;
    
    IXexadonRouter public router;
    address public routerAddress;

    IXexadonBondCurve public curve;
    address public curveAddress;

    IXexadonFactory public factory;
    address public factoryAddress;

    uint256 public reserve0;
    uint256 public reserve1;

    mapping (uint256 => address) private nftOwner;
    uint256 public _totalSupply;

    constructor() {
        factoryAddress = msg.sender;
    }

    function initialize(address _router, address _curve, address _tokenAddress) external onlyFactory {
        require(msg.sender == factoryAddress, 'Xexadon: Not Permitted');
        factory = IXexadonFactory(factoryAddress);
        routerAddress = _router;
        router = IXexadonRouter(_router);
        curveAddress = _curve;
        curve = IXexadonBondCurve(_curve);
        token = IERC721(_tokenAddress);
        tokenAddress = _tokenAddress;
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

    function addLiquidity(uint256[] calldata tokenIds, address _from) external payable onlyRouter {
        require(msg.value > 0, "Xexadon: No Ether sent");
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

    function swap(uint256[] memory tokenIds, address to) external payable {
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
        }
        else {
            // calculate amount of ETH to be sent
            (uint256 amountIn, uint256 newReserve0, uint256 newReserve1) = curve.getBuyPrice(tokenIds.length, reserve0, reserve1);
            (uint256 fee, uint256 platformFee) = getFee(amountIn);
            require(msg.value == (amountIn + fee + platformFee), "Xexadon: Invalid Price");
            // send platform fee to platform
            payable(factory.feeTo()).transfer(fee);
            batchTransfer(tokenIds, to);
            reserve0 = newReserve0;
            reserve1 = newReserve1;
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

    function getFee(uint256 amount) public view returns(uint256 fee, uint256 platformFee) {
        (uint256 feeMultiplier, uint256 platformFeeMultiplier) = router.getFee();

        fee = (amount * feeMultiplier) / 1000;
        platformFee = (amount * platformFeeMultiplier) / 1000;
    }

    modifier ownsAll(uint256[] memory tokenIds, address from) {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(nftOwner[tokenIds[i]] == from);
        }
        _;
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