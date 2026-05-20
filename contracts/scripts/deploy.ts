import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load the .env file explicitly
dotenv.config();

async function main() {
  console.log("Starting deployment to Base Sepolia (Pure Ethers.js Mode)...");

  // 1. Setup our HTTP connection and Wallet directly
  const rpcUrl = "https://sepolia.base.org";
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("❌ No PRIVATE_KEY found in .env file!");
  }

  // Connect to the Base Sepolia network
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log(`👤 Deploying from account: ${wallet.address}`);

  // 2. Read the compiled Blueprints (JSON files Hardhat made for us earlier)
  const mockUsdPath = path.join(process.cwd(), "artifacts/contracts/MockUSD.sol/MockUSD.json");
  const modelMarketPath = path.join(process.cwd(), "artifacts/contracts/ModelMarket.sol/ModelMarket.json");

  const mockUsdJson = JSON.parse(fs.readFileSync(mockUsdPath, "utf8"));
  const modelMarketJson = JSON.parse(fs.readFileSync(modelMarketPath, "utf8"));

  // 3. Deploy Fake Money (MockUSD)
  console.log("\n⏳ Deploying MockUSD...");
  const MockUSDFactory = new ethers.ContractFactory(mockUsdJson.abi, mockUsdJson.bytecode, wallet);
  const mockUsd = await MockUSDFactory.deploy();
  await mockUsd.waitForDeployment();
  const mockUsdAddress = await mockUsd.getAddress();
  console.log(`✅ MockUSD deployed to: ${mockUsdAddress}`);

  // 4. Deploy our API (ModelMarket), pointing it to the Fake Money
  console.log("\n⏳ Deploying ModelMarket API...");
  const ModelMarketFactory = new ethers.ContractFactory(modelMarketJson.abi, modelMarketJson.bytecode, wallet);
  const modelMarket = await ModelMarketFactory.deploy(mockUsdAddress);
  await modelMarket.waitForDeployment();
  const modelMarketAddress = await modelMarket.getAddress();
  console.log(`✅ ModelMarket deployed to: ${modelMarketAddress}`);

  console.log("\n🚀 DEPLOYMENT COMPLETE!");
  console.log("Give these two addresses to your Frontend Team!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});