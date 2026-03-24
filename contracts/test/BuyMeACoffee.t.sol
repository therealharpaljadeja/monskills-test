// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/BuyMeACoffee.sol";

contract BuyMeACoffeeTest is Test {
    BuyMeACoffee public coffee;
    address public owner;
    address public tipper;

    function setUp() public {
        owner = address(this);
        tipper = makeAddr("tipper");
        coffee = new BuyMeACoffee();
        vm.deal(tipper, 10 ether);
    }

    function test_OwnerIsDeployer() public view {
        assertEq(coffee.owner(), owner);
    }

    function test_BuyCoffee() public {
        vm.prank(tipper);
        coffee.buyCoffee{value: 0.01 ether}("Alice", "Great work!");

        BuyMeACoffee.Memo[] memory memos = coffee.getMemos();
        assertEq(memos.length, 1);
        assertEq(memos[0].from, tipper);
        assertEq(memos[0].name, "Alice");
        assertEq(memos[0].message, "Great work!");
        assertEq(memos[0].amount, 0.01 ether);
    }

    function test_BuyCoffeeEmitsEvent() public {
        vm.prank(tipper);
        vm.expectEmit(true, false, false, true);
        emit BuyMeACoffee.NewMemo(tipper, block.timestamp, "Alice", "Hello!", 0.05 ether);
        coffee.buyCoffee{value: 0.05 ether}("Alice", "Hello!");
    }

    function test_RevertIfZeroValue() public {
        vm.prank(tipper);
        vm.expectRevert("Must send MON to buy coffee");
        coffee.buyCoffee{value: 0}("Alice", "No money");
    }

    function test_WithdrawTips() public {
        vm.prank(tipper);
        coffee.buyCoffee{value: 1 ether}("Bob", "Coffee time!");

        uint256 balBefore = owner.balance;
        coffee.withdrawTips();
        assertEq(owner.balance, balBefore + 1 ether);
    }

    function test_RevertWithdrawNotOwner() public {
        vm.prank(tipper);
        coffee.buyCoffee{value: 1 ether}("Bob", "Tip");

        vm.prank(tipper);
        vm.expectRevert("Not the owner");
        coffee.withdrawTips();
    }

    function test_RevertWithdrawNoBalance() public {
        vm.expectRevert("No tips to withdraw");
        coffee.withdrawTips();
    }

    function test_MultipleMemos() public {
        vm.startPrank(tipper);
        coffee.buyCoffee{value: 0.01 ether}("A", "1");
        coffee.buyCoffee{value: 0.02 ether}("B", "2");
        coffee.buyCoffee{value: 0.03 ether}("C", "3");
        vm.stopPrank();

        assertEq(coffee.getTotalMemos(), 3);
        BuyMeACoffee.Memo[] memory memos = coffee.getMemos();
        assertEq(memos[2].amount, 0.03 ether);
    }

    receive() external payable {}
}
