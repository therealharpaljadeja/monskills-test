// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract BuyMeACoffee {
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
        uint256 amount;
    }

    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message,
        uint256 amount
    );

    address payable public owner;
    Memo[] public memos;

    constructor() {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function buyCoffee(string calldata _name, string calldata _message) external payable {
        require(msg.value > 0, "Must send MON to buy coffee");

        memos.push(Memo(msg.sender, block.timestamp, _name, _message, msg.value));

        emit NewMemo(msg.sender, block.timestamp, _name, _message, msg.value);
    }

    function withdrawTips() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No tips to withdraw");
        (bool ok, ) = owner.call{value: balance}("");
        require(ok, "Withdraw failed");
    }

    function getMemos() external view returns (Memo[] memory) {
        return memos;
    }

    function getTotalMemos() external view returns (uint256) {
        return memos.length;
    }
}
