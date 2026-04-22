// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Guestbook {
    uint256 public constant MAX_MESSAGE_LENGTH = 280;

    event MessageSigned(
        uint256 indexed id,
        address indexed signer,
        string message,
        uint256 timestamp
    );

    error MessageEmpty();
    error MessageTooLong(uint256 length, uint256 max);

    uint256 public totalMessages;

    function sign(string calldata message) external returns (uint256 id) {
        bytes memory raw = bytes(message);
        if (raw.length == 0) revert MessageEmpty();
        if (raw.length > MAX_MESSAGE_LENGTH) {
            revert MessageTooLong(raw.length, MAX_MESSAGE_LENGTH);
        }

        id = totalMessages;
        unchecked {
            totalMessages = id + 1;
        }

        emit MessageSigned(id, msg.sender, message, block.timestamp);
    }
}
