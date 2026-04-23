// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {Guestbook} from "../src/Guestbook.sol";

contract GuestbookTest is Test {
    Guestbook internal book;

    event Signed(
        uint256 indexed id,
        address indexed signer,
        string message,
        uint256 timestamp
    );

    address internal alice = address(0xA11CE);
    address internal bob = address(0xB0B);

    function setUp() public {
        book = new Guestbook();
    }

    function test_InitialState() public view {
        assertEq(book.totalEntries(), 0);
        assertEq(book.MAX_MESSAGE_BYTES(), 280);
    }

    function test_Sign_EmitsEventAndIncrementsId() public {
        vm.warp(1_700_000_000);
        vm.prank(alice);

        vm.expectEmit(true, true, false, true);
        emit Signed(1, alice, "hello monad", 1_700_000_000);

        uint256 id = book.sign("hello monad");

        assertEq(id, 1);
        assertEq(book.totalEntries(), 1);
    }

    function test_Sign_MultipleEntriesAreMonotonic() public {
        vm.prank(alice);
        book.sign("first");
        vm.prank(bob);
        book.sign("second");
        vm.prank(alice);
        uint256 third = book.sign("third");

        assertEq(third, 3);
        assertEq(book.totalEntries(), 3);
    }

    function test_Sign_RevertOnEmptyMessage() public {
        vm.expectRevert(Guestbook.EmptyMessage.selector);
        book.sign("");
    }

    function test_Sign_RevertOnTooLongMessage() public {
        bytes memory tooLong = new bytes(281);
        for (uint256 i = 0; i < 281; i++) tooLong[i] = "a";

        vm.expectRevert(Guestbook.MessageTooLong.selector);
        book.sign(string(tooLong));
    }

    function test_Sign_AcceptsMaxLengthMessage() public {
        bytes memory atMax = new bytes(280);
        for (uint256 i = 0; i < 280; i++) atMax[i] = "a";

        uint256 id = book.sign(string(atMax));
        assertEq(id, 1);
    }
}
