// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {Guestbook} from "../src/Guestbook.sol";

contract GuestbookTest is Test {
    Guestbook book;

    event Signed(uint256 indexed id, address indexed signer, uint256 timestamp, string message);

    function setUp() public {
        book = new Guestbook();
    }

    function test_sign_storesEntryAndEmits() public {
        vm.expectEmit(true, true, false, true);
        emit Signed(0, address(this), block.timestamp, "gm monad");
        uint256 id = book.sign("gm monad");
        assertEq(id, 0);
        assertEq(book.totalEntries(), 1);

        Guestbook.Entry memory e = book.entryAt(0);
        assertEq(e.signer, address(this));
        assertEq(e.message, "gm monad");
        assertEq(e.timestamp, block.timestamp);
    }

    function test_sign_revertsEmpty() public {
        vm.expectRevert(Guestbook.MessageEmpty.selector);
        book.sign("");
    }

    function test_sign_revertsTooLong() public {
        bytes memory b = new bytes(281);
        for (uint256 i = 0; i < 281; i++) b[i] = "x";
        vm.expectRevert(Guestbook.MessageTooLong.selector);
        book.sign(string(b));
    }

    function test_sign_maxLengthOk() public {
        bytes memory b = new bytes(280);
        for (uint256 i = 0; i < 280; i++) b[i] = "x";
        book.sign(string(b));
        assertEq(book.totalEntries(), 1);
    }

    function test_sign_idsIncrement() public {
        assertEq(book.sign("a"), 0);
        assertEq(book.sign("b"), 1);
        assertEq(book.sign("c"), 2);
        assertEq(book.totalEntries(), 3);
    }
}
