// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// IMPORT: This is like importing a standard Python interface. 
// It tells our contract how to interact with the Mock USD token.
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ModelMarket {
    // DATABASE VARIABLE: We store the address of the Mock USD token here.
    IERC20 public mockUsd;

    // WEBHOOK (Event): When this triggers, our Python AI backend will listen for it.
    // We log *who* paid, *who* they paid, the *amount*, and a unique *promptId*.
    event AIPaymentReceived(address indexed user, address indexed developer, uint256 amount, string promptId);

    // CONSTRUCTOR: Runs only ONCE when you deploy (upload) this to Base Sepolia.
    constructor(address _mockUsdAddress) {
        mockUsd = IERC20(_mockUsdAddress);
    }

    // THE MAIN API ENDPOINT: The Frontend/UGF will call this function.
    function payForAI(address developer, uint256 amount, string memory promptId) external {
        
        // LOGIC 1: Transfer the Mock USD from the User (msg.sender) to the Developer.
        // The frontend UGF SDK handles the gasless part; this just moves the digital dollars.
        bool success = mockUsd.transferFrom(msg.sender, developer, amount);
        
        // ERROR HANDLING: If the user doesn't have enough Mock USD, throw a 400 Error.
        require(success, "Payment failed! Check Mock USD balance.");

        // LOGIC 2: Fire the webhook! Tell the Python backend to release the AI response.
        emit AIPaymentReceived(msg.sender, developer, amount, promptId);
    }
}