// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {Guestbook} from "../src/Guestbook.sol";

contract GuestbookTest is Test {
    Guestbook internal guestbook;

    event MessageSigned(
        uint256 indexed id,
        address indexed signer,
        string message,
        uint256 timestamp
    );

    function setUp() public {
        guestbook = new Guestbook();
    }

    function test_sign_incrementsAndEmits() public {
        address alice = makeAddr("alice");
        vm.prank(alice);

        vm.expectEmit(true, true, false, true, address(guestbook));
        emit MessageSigned(0, alice, "gm monad", block.timestamp);

        uint256 id = guestbook.sign("gm monad");
        assertEq(id, 0);
        assertEq(guestbook.totalMessages(), 1);
    }

    function test_sign_revertsOnEmpty() public {
        vm.expectRevert(Guestbook.MessageEmpty.selector);
        guestbook.sign("");
    }

    function test_sign_revertsOnTooLong() public {
        bytes memory long = new bytes(281);
        for (uint256 i; i < 281; i++) long[i] = "a";
        vm.expectRevert(
            abi.encodeWithSelector(Guestbook.MessageTooLong.selector, 281, 280)
        );
        guestbook.sign(string(long));
    }

    function test_sign_multiple() public {
        guestbook.sign("one");
        guestbook.sign("two");
        guestbook.sign("three");
        assertEq(guestbook.totalMessages(), 3);
    }
}
