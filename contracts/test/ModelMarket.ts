import { expect } from "chai";
import hre from "hardhat";

describe("ModelMarket AI Payment API", function () {
  let mockUSD: any;
  let modelMarket: any;
  let owner: any, user: any, aiDeveloper: any;
  
  // We declare ethers here so all our tests can use it
  let ethers: any; 

  before(async function () {
    // 🔥 THE HARDHAT 3 MAGIC: We explicitly create the local network for this test!
    const network = await hre.network.create();
    ethers = network.ethers;

    // Now we use our freshly generated 'ethers' instance
    [owner, user, aiDeveloper] = await ethers.getSigners();

    const MockUSD = await ethers.getContractFactory("MockUSD");
    mockUSD = await MockUSD.deploy();
    
    await mockUSD.transfer(user.address, ethers.parseUnits("100", 18));

    const ModelMarket = await ethers.getContractFactory("ModelMarket");
    modelMarket = await ModelMarket.deploy(mockUSD.target); 
  });

  it("Should successfully process a $0.05 payment and fire the webhook", async function () {
    const paymentAmount = ethers.parseUnits("0.05", 18); 
    const promptId = "prompt_123_cyberpunk_cat";

    // Step A: The user approves the contract to spend $0.05
    await mockUSD.connect(user).approve(modelMarket.target, paymentAmount);

    // Step B: The user calls the payment endpoint
    await expect(
      modelMarket.connect(user).payForAI(aiDeveloper.address, paymentAmount, promptId)
    )
      .to.emit(modelMarket, "AIPaymentReceived")
      .withArgs(user.address, aiDeveloper.address, paymentAmount, promptId);

    // Step C: Verify the developer's balance increased
    const devBalance = await mockUSD.balanceOf(aiDeveloper.address);
    expect(devBalance).to.equal(paymentAmount);
  });
});