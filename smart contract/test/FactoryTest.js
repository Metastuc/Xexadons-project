const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  
  describe("Factory", function () {
    async function deployFactory() {  
      // Contracts are deployed using the first signer/account by default
      const [owner, otherAccount, token, router, curve] = await ethers.getSigners();
  
      const Factory = await ethers.getContractFactory("XexadonFactory");
      const factory = await Factory.deploy(owner);
  
      return { factory, owner, otherAccount, token, router, curve };
    }
  
    describe("Deployment", function () {
      it("Should set the feeToSetter", async function () {
        const { factory, owner } = await loadFixture(deployFactory);

        console.log(factory.address);
        expect(await factory.feeToSetter()).to.equal(owner);
      });
    });

    describe("Create Pair", function () {
      it("Should deploy a pair contract", async function () {
        const { factory, owner, otherAccount, token, router, curve } = await loadFixture(deployFactory);
        
        await expect(factory.createPair(token, router, curve)).not.to.be.reverted;
      });
    });

    describe("Set feeTo", function () {
      it("Should set feeTo succuessfully", async function () {
        const { factory, owner, otherAccount } = await loadFixture(deployFactory);
        
        await factory.setFeeTo(otherAccount);
        expect(await factory.feeTo()).to.equal(otherAccount);
      });
    });

    describe("Get pair", function () {
      it("Should get pair", async function () {
        const { factory, owner, otherAccount, token, router, curve } = await loadFixture(deployFactory);
        
        await factory.createPair(token, router, curve);
        const pairAddress = await factory.getPair(token);
        console.log(pairAddress);
      });
    });
  });