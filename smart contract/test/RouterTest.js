const {loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  
  describe("Router", function () {
    async function deployRouter() {  
      // Contracts are deployed using the first signer/account by default
      const [owner, otherAccount] = await ethers.getSigners();

      const Token = await ethers.getContractFactory("MockNFT");
      const token = await Token.deploy("Name", "NM");

      const Factory = await ethers.getContractFactory("XexadonFactory");
      const factory = await Factory.deploy(owner);

      const factoryAddress = factory.target;

      const Router = await ethers.getContractFactory("XexadonRouter");
      const router = await Router.deploy(factoryAddress, owner);

      const Curve = await ethers.getContractFactory("BondingCurve");
      const curve = await Curve.deploy();

      const tokenAddress = token.target;
      const routerAddress = router.target;
      const curveAddress = curve.target;

      await factory.createPair(tokenAddress, routerAddress, curveAddress);

      return { owner, otherAccount, router, token, factory, curve };
    }
  
    describe("Deployment", function () {
      it("Should deploy successfully", async function () {
        const { owner, router } = await loadFixture(deployRouter);

        expect(await router.owner()).to.equal(owner);
      });
    });

    describe("Fees setup", function () {
      it("Should deploy a pair contract", async function () {
        const { router, otherAccount } = await loadFixture(deployRouter);
        
        await router.setFee(5, 5);
        const fees = await router.getFee();
        console.log(fees);
        await expect(router.getFee()).not.to.be.reverted;
      });
    });

    describe("Add Liquidity", function () {
      it("Should set add liquidity to pair pool succuessfully", async function () {
        const { router, owner, otherAccount, token, factory } = await loadFixture(deployRouter);
        
        await token.mint(owner.address, 1);
        await token.mint(owner.address, 2);

        const tokenIds = [1, 2];

        const pairAddress = await factory.getPair(token.target);

        await token.setApprovalForAll(pairAddress, true);

        await expect(router.addLiquidity(token.target, tokenIds, owner.address, { value: 2 })).not.to.be.reverted;
      });
    });

    describe("Swap", function () {
        it("Should swap NFTs for ETH succuessfully", async function () {
          const { router, owner, otherAccount, token, factory } = await loadFixture(deployRouter);
          
          await token.mint(owner.address, 1);
          await token.mint(owner.address, 2);
          await token.mint(owner.address, 3);
  
          const tokenIds = [1, 2];

          const swapIds = [3];
  
          const pairAddress = await factory.getPair(token.target);
  
          await token.setApprovalForAll(pairAddress, true);
  
          await router.addLiquidity(token.target, tokenIds, owner.address, { value: 2 });

          const balBeforeSwap = await token.balanceOf(pairAddress);
          console.log(balBeforeSwap);

          await router.swapNFTforETH(token.target, swapIds, owner.address, {value: 0});
          
          const balAfterSwap = await token.balanceOf(pairAddress);
          console.log(balAfterSwap);
        //   await expect(router.swapNFTforETH(token.target, tokenIds, owner.address)).not.to.be.reverted;
        });

        it("Should swap ETH for NFTs succuessfully", async function () {
            const { router, owner, token, factory, curve } = await loadFixture(deployRouter);
            
            const provider = ethers.provider;

            await token.mint(owner.address, 1);
            await token.mint(owner.address, 2);
            await token.mint(owner.address, 3);
    
            const tokenIds = [1, 2];
  
            const swapIds = [2];
    
            const pairAddress = await factory.getPair(token.target);
    
            await token.setApprovalForAll(pairAddress, true);
    
            await router.addLiquidity(token.target, tokenIds, owner.address, { value: 20000000000000000000n });

            const balBeforeSwap = await provider.getBalance(pairAddress);

            const amountIn = await curve.getBuyPrice(1, 2, 20000000000000000000n);
            const fee = await router.getFee();
            console.log(amountIn, fee);
  
            await router.swapETHforNFT(token.target, swapIds, owner.address, {value: 20000000000000000000n});

            const balAfterSwap = await provider.getBalance(pairAddress);

            console.log(balBeforeSwap, balAfterSwap);
          //   await expect(router.swapNFTforETH(token.target, tokenIds, owner.address)).not.to.be.reverted;
          });
    });
  });