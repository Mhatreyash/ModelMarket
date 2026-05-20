// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// This is a dummy token just for our local laptop tests!
contract MockUSD is ERC20 {
    constructor() ERC20("Mock USD", "MUSD") {
        // When deployed, give the creator 1,000,000 fake dollars
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}