// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BuyMeACoffee is Ownable, ReentrancyGuard {
    event CoffeeBought(
        uint256 indexed id,
        address indexed from,
        uint256 amount,
        string name,
        string message,
        uint256 timestamp
    );

    event Withdrawn(address indexed to, uint256 amount);

    uint256 public coffeeCount;

    error EmptyTip();
    error NothingToWithdraw();
    error WithdrawFailed();

    constructor(address initialOwner) Ownable(initialOwner) {}

    function buyCoffee(string calldata name, string calldata message) external payable {
        if (msg.value == 0) revert EmptyTip();
        uint256 id = ++coffeeCount;
        emit CoffeeBought(id, msg.sender, msg.value, name, message, block.timestamp);
    }

    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        if (balance == 0) revert NothingToWithdraw();
        (bool ok,) = payable(owner()).call{value: balance}("");
        if (!ok) revert WithdrawFailed();
        emit Withdrawn(owner(), balance);
    }

    receive() external payable {
        if (msg.value == 0) revert EmptyTip();
        uint256 id = ++coffeeCount;
        emit CoffeeBought(id, msg.sender, msg.value, "", "", block.timestamp);
    }
}
