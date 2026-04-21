// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract GuestBook {
    error EmptyMessage();
    error MessageTooLong();

    uint256 public constant MAX_MESSAGE_LENGTH = 280;

    event MessageSigned(
        address indexed signer,
        string message,
        uint256 timestamp,
        uint256 indexed id
    );

    uint256 public totalMessages;

    function sign(string calldata message) external {
        bytes memory b = bytes(message);
        if (b.length == 0) revert EmptyMessage();
        if (b.length > MAX_MESSAGE_LENGTH) revert MessageTooLong();

        uint256 id = totalMessages;
        unchecked {
            totalMessages = id + 1;
        }

        emit MessageSigned(msg.sender, message, block.timestamp, id);
    }
}
