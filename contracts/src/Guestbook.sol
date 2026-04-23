// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Guestbook
/// @notice Append-only onchain guestbook: anyone can sign with a message.
///         No storage is kept beyond a monotonic counter; the full feed lives
///         in `Signed` event logs and is served to the UI by an indexer.
contract Guestbook {
    uint256 public totalEntries;

    uint256 public constant MAX_MESSAGE_BYTES = 280;

    event Signed(
        uint256 indexed id,
        address indexed signer,
        string message,
        uint256 timestamp
    );

    error EmptyMessage();
    error MessageTooLong();

    function sign(string calldata message) external returns (uint256 id) {
        uint256 len = bytes(message).length;
        if (len == 0) revert EmptyMessage();
        if (len > MAX_MESSAGE_BYTES) revert MessageTooLong();

        unchecked {
            id = ++totalEntries;
        }
        emit Signed(id, msg.sender, message, block.timestamp);
    }
}
