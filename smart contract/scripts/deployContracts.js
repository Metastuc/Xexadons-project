const hre = require("hardhat");

async function main() {
  const feeToSetter = "0x72De66bFDEf75AE89aD98a52A1524D3C5dB5fB24";

  const factory = await hre.ethers.deployContract("XexadonFactory", [feeToSetter]);

  await factory.waitForDeployment();

  const bondingCurve = await hre.ethers.deployContract("BondingCurve");

  await bondingCurve.waitForDeployment();

  const router = await hre.ethers.deployContract("XexadonRouter", [factory.target, feeToSetter, bondingCurve.target]);

  await router.waitForDeployment();

  console.log(
    `Factory deployed to ${factory.target}, BondingCurve deployed to ${bondingCurve.target}, Router deployed to ${router.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });