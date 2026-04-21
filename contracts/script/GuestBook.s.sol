// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {GuestBook} from "../src/GuestBook.sol";

contract DeployGuestBook is Script {
    function run() external {
        vm.startBroadcast();
        GuestBook book = new GuestBook();
        vm.stopBroadcast();
        console.log("GuestBook deployed at:", address(book));
    }
}
