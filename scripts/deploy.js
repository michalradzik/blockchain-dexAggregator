const hre = require("hardhat");
const { ethers } = require("hardhat");
const { parseUnits } = ethers.utils;

const tokens = (n) => parseUnits(n.toString(), "ether");

async function main() {
  console.log("Starting deployment...");

  const network = hre.network.name;
  console.log(`Deploying to network: ${network}`);

  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  console.log("Deploying contracts with the account:", deployer.address);

  const chainId = (await deployer.provider.getNetwork()).chainId;
  console.log("Chain ID:", chainId);

  let totalGasUsed = ethers.BigNumber.from(0); 

  // Deploy DexAggregator
  console.log("Deploying DexAggregator contract...");
  const DexAggregator = await ethers.getContractFactory("DexAggregator");
  const dexAggregator = await DexAggregator.deploy();
  const dexAggregatorReceipt = await dexAggregator.deployTransaction.wait();
  console.log("DexAggregator deployed to:", dexAggregator.address);
  console.log("Gas used for DexAggregator:", dexAggregatorReceipt.gasUsed.toString());
  totalGasUsed = totalGasUsed.add(dexAggregatorReceipt.gasUsed);

  // Deploy Tokens
  console.log("Deploying tokens...");
  const tokenDetails = [
    { name: "Dapp Token", symbol: "DAPP", supply: tokens(10000) },
    { name: "USD Token", symbol: "USD", supply: tokens(10000) },
  ];

  const deployedTokens = [];
  for (let { name, symbol, supply } of tokenDetails) {
    console.log(`Deploying ${name} (${symbol})...`);
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy(name, symbol, supply);
    const tokenReceipt = await token.deployTransaction.wait();
    console.log(`${symbol} deployed to: ${token.address}`);
    console.log(`Gas used for ${symbol}:`, tokenReceipt.gasUsed.toString());
    totalGasUsed = totalGasUsed.add(tokenReceipt.gasUsed);

    // Add token to DexAggregator
    console.log(`Adding ${symbol} to DexAggregator...`);
    const addTokenTx = await dexAggregator.addToken(name, symbol, token.address);
    const addTokenReceipt = await addTokenTx.wait();
    console.log(`Gas used for adding ${symbol} to DexAggregator:`, addTokenReceipt.gasUsed.toString());
    totalGasUsed = totalGasUsed.add(addTokenReceipt.gasUsed);

    deployedTokens.push({ name, symbol, tokenAddress: token.address });
  }

  // Deploy AMM contracts and add to DexAggregator
  console.log("Deploying AMM contracts...");
  const AMM = await ethers.getContractFactory("AMM");
  const baseAmount = 100; // Base liquidity in tokens

  for (let i = 0; i < 3; i++) {
    const token1 = deployedTokens[0];
    const token2 = deployedTokens[1];

    console.log(`Deploying AMM contract ${i + 1} with token1: ${token1.tokenAddress} and token2: ${token2.tokenAddress}`);
    const amm = await AMM.deploy(token1.tokenAddress, token2.tokenAddress);
    const ammReceipt = await amm.deployTransaction.wait();
    console.log(`AMM contract ${i + 1} deployed to: ${amm.address}`);
    console.log(`Gas used for AMM contract ${i + 1}:`, ammReceipt.gasUsed.toString());
    totalGasUsed = totalGasUsed.add(ammReceipt.gasUsed);

    // Randomize liquidity and fees
    const minAmount = baseAmount * 0.9;
    const maxAmount = baseAmount * 1.1;
    const randomAmountToken1 = tokens((Math.random() * (maxAmount - minAmount) + minAmount).toFixed(2));
    const randomAmountToken2 = tokens((Math.random() * (maxAmount - minAmount) + minAmount).toFixed(2));
    const makerFee = Math.floor((Math.random() * (0.015 - 0.005) + 0.005) * 10000); // Fee in 1/10000 scale
    const takerFee = Math.floor((Math.random() * (0.03 - 0.01) + 0.01) * 10000); // Fee in 1/10000 scale

    console.log(`Adding liquidity to AMM_${i + 1}...`);
    const dappToken = await ethers.getContractAt("Token", token1.tokenAddress);
    const usdToken = await ethers.getContractAt("Token", token2.tokenAddress);
    const approveTx1 = await dappToken.connect(deployer).approve(amm.address, randomAmountToken1);
    const approveReceipt1 = await approveTx1.wait();
    console.log(`Gas used for approving DAPP Token for AMM_${i + 1}:`, approveReceipt1.gasUsed.toString());
    totalGasUsed = totalGasUsed.add(approveReceipt1.gasUsed);

    const approveTx2 = await usdToken.connect(deployer).approve(amm.address, randomAmountToken2);
    const approveReceipt2 = await approveTx2.wait();
    console.log(`Gas used for approving USD Token for AMM_${i + 1}:`, approveReceipt2.gasUsed.toString());
    totalGasUsed = totalGasUsed.add(approveReceipt2.gasUsed);

    const addLiquidityTx = await amm.connect(deployer).addLiquidity(randomAmountToken1, randomAmountToken2);
    const addLiquidityReceipt = await addLiquidityTx.wait();
    console.log(`Gas used for adding liquidity to AMM_${i + 1}:`, addLiquidityReceipt.gasUsed.toString());
    totalGasUsed = totalGasUsed.add(addLiquidityReceipt.gasUsed);

    const ammName = `AMM ${i + 1}`;
    console.log(`Adding AMM_${i + 1} to DexAggregator...`);
    const addAMMTx = await dexAggregator.addAmm(amm.address, makerFee, takerFee, randomAmountToken1, randomAmountToken2, ammName);
    const addAMMReceipt = await addAMMTx.wait();
    console.log(`Gas used for adding AMM_${i + 1} to DexAggregator:`, addAMMReceipt.gasUsed.toString());
    totalGasUsed = totalGasUsed.add(addAMMReceipt.gasUsed);
  }

  console.log("Deployment completed successfully.");
  console.log("Total gas used for deployment:", totalGasUsed.toString());
  const gasPrice = await deployer.provider.getGasPrice();
  const totalCostInEth = ethers.utils.formatEther(totalGasUsed.mul(gasPrice));
  console.log(`Total cost of deployment (ETH): ${totalCostInEth}`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
