// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Guestbook {
    uint256 public constant MAX_MESSAGE_LENGTH = 280;

    struct Entry {
        address signer;
        uint256 timestamp;
        string message;
    }

    Entry[] private entries;

    event Signed(uint256 indexed id, address indexed signer, uint256 timestamp, string message);

    error MessageEmpty();
    error MessageTooLong();

    function sign(string calldata message) external returns (uint256 id) {
        bytes memory m = bytes(message);
        if (m.length == 0) revert MessageEmpty();
        if (m.length > MAX_MESSAGE_LENGTH) revert MessageTooLong();

        id = entries.length;
        entries.push(Entry({signer: msg.sender, timestamp: block.timestamp, message: message}));
        emit Signed(id, msg.sender, block.timestamp, message);
    }

    function totalEntries() external view returns (uint256) {
        return entries.length;
    }

    function entryAt(uint256 id) external view returns (Entry memory) {
        return entries[id];
    }
}
