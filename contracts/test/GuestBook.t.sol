// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {GuestBook} from "../src/GuestBook.sol";

contract GuestBookTest is Test {
    GuestBook book;

    event MessageSigned(
        address indexed signer,
        string message,
        uint256 timestamp,
        uint256 indexed id
    );

    function setUp() public {
        book = new GuestBook();
    }

    function test_signEmitsEvent() public {
        vm.expectEmit(true, true, true, true);
        emit MessageSigned(address(this), "hello", block.timestamp, 0);
        book.sign("hello");
        assertEq(book.totalMessages(), 1);
    }

    function test_revertsOnEmpty() public {
        vm.expectRevert(GuestBook.EmptyMessage.selector);
        book.sign("");
    }

    function test_revertsOnTooLong() public {
        bytes memory long = new bytes(281);
        for (uint256 i; i < 281; i++) long[i] = "a";
        vm.expectRevert(GuestBook.MessageTooLong.selector);
        book.sign(string(long));
    }

    function test_incrementsId() public {
        book.sign("one");
        book.sign("two");
        assertEq(book.totalMessages(), 2);
    }
}
